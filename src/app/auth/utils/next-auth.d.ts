import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      accessToken: string;
      refreshToken: string;
      expiresAt: number;
    } & DefaultSession["user"];
  }
}
