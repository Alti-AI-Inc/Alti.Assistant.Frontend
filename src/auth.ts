import jwt from 'jsonwebtoken';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

// ---- Extend NextAuth types ----
declare module 'next-auth' {
  interface User {
    accessToken?: string;
    id?: string;
    role?: string;
    tenants?: Array<{ id: string; name: string; role: string }>;
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
    tenants?: Array<{ id: string; name: string; role: string }>;
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
        invitationToken: { label: 'Invitation Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const body: Record<string, string> = {
            email: credentials.email as string,
            password: credentials.password as string,
          };
          if (credentials.invitationToken) {
            body.invitationToken = credentials.invitationToken as string;
          }
          const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;
          console.log('Attempting login with:', body);
          console.log('API URL:', apiUrl);
          const response = await fetch(
            `${apiUrl}/auth/login`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(body),
            },
          );
          const user = await response.json();
          console.log('Login response status:', response.status, response.ok);
          if (!response.ok) return null;

          return {
            id: user.data._id,
            accessToken: user.data.accessToken,
          };
        } catch (error) {
          console.error(error);
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
    async jwt({ token, user, trigger, session }) {
      // Handle token updates (e.g., after creating tenant)
      if (trigger === 'update' && session?.accessToken) {
        const decoded = jwt.decode(session.accessToken) as jwt.JwtPayload & {
          _id?: string;
          role?: string;
          tenants?: Array<{ tenantId: string; role: string }>;
          iat?: number;
          exp?: number;
        };

        if (decoded) {
          token.accessToken = session.accessToken;
          token.id = decoded._id || token.id;
          token.role = decoded.role;
          token.iat = decoded.iat;
          token.exp = decoded.exp;

          // Transform backend tenant structure to frontend structure
          if (decoded.tenants && decoded.tenants.length > 0) {
            token.tenants = decoded.tenants.map((t) => ({
              id: t.tenantId,
              name: '', // Will be populated from API call
              role: t.role,
            }));
          } else {
            token.tenants = [];
          }
        }
        return token;
      }

      // On first login
      if (user?.accessToken) {
        token.id = user.id;
        token.accessToken = user.accessToken;

        const decoded = jwt.decode(user.accessToken) as jwt.JwtPayload & {
          _id?: string;
          role?: string;
          tenants?: Array<{ tenantId: string; role: string }>;
          iat?: number;
          exp?: number;
        };

        if (decoded) {
          token.id = decoded._id || token.id;
          token.role = decoded.role;
          token.iat = decoded.iat;
          token.exp = decoded.exp;

          // Transform backend tenant structure to frontend structure
          if (decoded.tenants && decoded.tenants.length > 0) {
            token.tenants = decoded.tenants.map((t) => ({
              id: t.tenantId,
              name: '', // Will be populated from API call
              role: t.role,
            }));
          } else {
            token.tenants = [];
          }
        }
      }

      return token;
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken as string;

      session.user.id = token.id as string;
      session.user.role =
        typeof token.role === 'string' ? token.role : undefined;
      session.user.tenants = token.tenants as Array<{ id: string; name: string; role: string }> | undefined;
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
