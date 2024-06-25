import moment from "moment";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {},
      authorize: async (credentials) => {
        // TODO: Implement or remove.
        return null;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user && token) {
        token.id = user.id;
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;
        token.expiresAt = user.expiresAt;
      }

      console.log(
        "Token expires at: ",
        moment(token.expiresAt * 1000).format()
      );

      if (moment().unix() < token.expiresAt) {
        return token;
      }

      return refreshAccessToken(token);
    },
    session: async ({ session, token }) => {
      if (token) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
      }
      return session;
    },
  },
});

async function refreshAccessToken(token) {
  // TODO: Implement or remove.
  return true;
}
