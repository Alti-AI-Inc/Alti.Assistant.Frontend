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

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                email: credentials.email,
                password: credentials.password,
              }),
            },
          );
          if (!response.ok) return null;
          const user = await response.json();

          return {
            id: user.data._id,
            accessToken: user.data.accessToken,
          };
        } catch (error) {
          console.log(error);
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
