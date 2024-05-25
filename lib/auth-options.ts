import { NextAuthOptions } from "next-auth";
import GitHubProvider from "next-auth/providers/github";

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  callbacks: {
    signIn: async ({ user }) => {
      const admins = process.env.ADMINS?.split(',') || [];
      if (admins.includes(user.email)) {
        return true;
      }
      return false; 
    }
  }
};
