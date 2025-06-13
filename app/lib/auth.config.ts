// lib/auth.config.ts
import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  pages: {
    signIn: "/auth/signin", // your custom sign-in page
  },
  callbacks: {
    async session({ session, token, user }) {
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl; // redirects to http://localhost:3000
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};
