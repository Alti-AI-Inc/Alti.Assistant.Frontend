import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// ---- Extend NextAuth types ----
declare module 'next-auth' {
  interface User {
    accessToken?: string;
    id?: string;
    role?: string;
    iat?: number;
    exp?: number;
  }

  interface Session {
    accessToken: string;
    isTokenExpired: boolean;
    user: User;
  }

  interface JWT {
    accessToken?: string;
    id?: string;
    role?: string;
    iat?: number;
    exp?: number;
  }
}

// ---- Config ----
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        accessToken: { label: 'Access Token', type: 'text' }, // optional
        id: { label: 'id', type: 'text' }, // optional
      },
      async authorize(credentials) {
        if (!credentials) return null;

        // --- FLOW 1: accessToken was provided (from client) ---
        if (credentials.accessToken) {
          try {
            const decoded =
              typeof credentials.accessToken === 'string'
                ? (jwt.decode(credentials.accessToken) as
                    | (jwt.JwtPayload & {
                        _id?: string;
                        role?: string;
                        iat?: number;
                        exp?: number;
                      })
                    | null)
                : null;

            const id = decoded?._id || credentials.id;
            if (!id) return null;

            return {
              id,
              accessToken: credentials.accessToken,
            };
          } catch (err) {
            console.error('❌ Invalid accessToken passed to authorize()', err);
            return null;
          }
        }

        // --- FLOW 2: fallback to API call with email/password ---
        if (!credentials.email || !credentials.password) return null;

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );

          const data = await response.json();
          console.log('🔑 API response (authorize):', data);

          if (!response.ok || !data?.data?.accessToken || !data?.data?._id) {
            console.error('❌ Invalid credentials from API');
            return null;
          }

          return {
            id: data.data._id,
            accessToken: data.data.accessToken,
          };
        } catch (error) {
          console.error('❌ Error in authorize()', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
  },

  pages: {
    signIn: '/login',
  },

  callbacks: {
    async jwt({ token, user }) {
      // On first login
      if (user?.accessToken) {
        token.id = user.id;
        token.accessToken = user.accessToken;

        const decoded = jwt.decode(user.accessToken) as jwt.JwtPayload & {
          _id?: string;
          role?: string;
          iat?: number;
          exp?: number;
        };

        if (decoded) {
          token.id = decoded._id || token.id;
          token.role = decoded.role;
          token.iat = decoded.iat;
          token.exp = decoded.exp;
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      session.user.id = token.id as string;
      session.user.role =
        typeof token.role === 'string' ? token.role : undefined;
      session.user.iat = token.iat;
      session.user.exp = token.exp;

      // Expiry check (exp is in seconds, convert to ms)
      session.isTokenExpired = token.exp
        ? token.exp * 1000 < Date.now()
        : false;

      return session;
    },
  },
});
