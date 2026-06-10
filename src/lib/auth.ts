import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
const { compare } = bcrypt;
import prisma from "./prisma";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) throw new Error("Email and password required");
        const user = await prisma.user.findUnique({ where: { email: credentials.email } });
        if (!user || !user.password) throw new Error("User not found");
        const isValid = await compare(credentials.password, user.password);
        if (!isValid) throw new Error("Invalid password");
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  session: { strategy: "jwt" } as const,
  pages: { signIn: "/login" },
  callbacks: {
    async jwt({ token, user }: any) { if (user) token.id = user.id; return token; },
    async session({ session, token }: any) { if (session.user) session.user.id = token.id as string; return session; },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
