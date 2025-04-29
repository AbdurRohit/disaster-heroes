// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { PrismaClient } from "../../../../../node_modules/.prisma/client";

const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  session: {
    strategy: "database" as const, 
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/", // optional
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };