import crypto from 'crypto';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const safeCompare = (a = '', b = '') => {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  if (aBuffer.length !== bBuffer.length) return false;
  return crypto.timingSafeEqual(aBuffer, bBuffer);
};

const handler = NextAuth({
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
  providers: [
    CredentialsProvider({
      name: 'Admin Credentials',
      credentials: {
        username: { label: 'Username', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const adminUsername = process.env.ADMIN_USERNAME || '';
        const adminPassword = process.env.ADMIN_PASSWORD || '';

        if (!adminUsername || !adminPassword) {
          throw new Error('Admin credentials not configured');
        }

        const usernameMatches = safeCompare(credentials.username, adminUsername);
        const passwordMatches = safeCompare(credentials.password, adminPassword);

        if (!usernameMatches || !passwordMatches) {
          return null;
        }

        return {
          id: 'clockedoff-admin',
          name: 'Admin',
          username: adminUsername,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.user = {
          name: user.name,
          username: user.username,
        };
      }
      return token;
    },
    async session({ session, token }) {
      if (token.user) {
        session.user = token.user;
      }
      return session;
    },
  },
});

export default handler;
