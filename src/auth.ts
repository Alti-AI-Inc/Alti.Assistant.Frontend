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

const verifyBackendJwt = (token: string): jwt.JwtPayload | null => {
  const secret =
    process.env.JWT_ACCESS_TOKEN ||
    process.env.JWT_ACCESS_TOKEN_SECRET ||
    process.env.AUTH_SECRET;

  if (!secret) {
    console.error(
      'Inso AI Auth: Neither JWT_ACCESS_TOKEN nor AUTH_SECRET is defined. Cannot verify backend JWT signature.'
    );
    return null;
  }

  try {
    return jwt.verify(token, secret) as jwt.JwtPayload;
  } catch (error) {
    console.error('Inso AI Auth: Failed to verify backend JWT signature:', error);
    return null;
  }
};

export const { handlers, signIn, signOut, auth } = NextAuth({
  trustHost: true,
  providers: [
    // ── Email / Password ─────────────────────────────────────────────────────
    Credentials({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        invitationToken: { label: 'Invitation Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          console.warn('Missing email or password in credentials');
          return null;
        }
        try {
          const body: Record<string, string> = {
            email: credentials.email as string,
            password: credentials.password as string,
          };
          if (credentials.invitationToken) {
            body.invitationToken = credentials.invitationToken as string;
          }
          const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'https://insoai.com/api/v1';
          const response = await fetch(`${apiUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          });
          const user = await response.json();
          if (!response.ok) return null;
          return { id: user.data._id, accessToken: user.data.accessToken };
        } catch (error) {
          console.error(error);
          return null;
        }
      },
    }),

    // ── Google OAuth popup — accepts pre-issued backend JWT ──────────────────
    Credentials({
      id: 'social-token',
      name: 'social-token',
      credentials: {
        accessToken: { label: 'Access Token', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.accessToken) return null;
        try {
          const token = credentials.accessToken as string;
          const decoded = verifyBackendJwt(token) as jwt.JwtPayload & { _id?: string };
          if (!decoded || !decoded._id) return null;
          if (decoded.exp && decoded.exp * 1000 < Date.now()) return null;
          return { id: decoded._id, accessToken: token };
        } catch (error) {
          console.error('[social-token]', error);
          return null;
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },

  pages: {
    signIn: '/',
  },

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Handle token updates (e.g., after creating tenant)
      if (trigger === 'update' && session?.accessToken) {
        const decoded = verifyBackendJwt(session.accessToken) as jwt.JwtPayload & {
          _id?: string;
          role?: string;
          tenants?: Array<{
            tenantId: string;
            role?: string;
            tenantRole?: string;
          }>;
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
            token.tenants = decoded.tenants.map(t => ({
              id: t.tenantId,
              name: '', // Will be populated from API call
              role: t.role ?? t.tenantRole ?? 'member',
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

        const decoded = verifyBackendJwt(user.accessToken) as jwt.JwtPayload & {
          _id?: string;
          role?: string;
          tenants?: Array<{
            tenantId: string;
            role?: string;
            tenantRole?: string;
          }>;
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
            token.tenants = decoded.tenants.map(t => ({
              id: t.tenantId,
              name: '', // Will be populated from API call
              role: t.role ?? t.tenantRole ?? 'member',
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
      session.user.tenants = token.tenants as
        | Array<{ id: string; name: string; role: string }>
        | undefined;
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
