import { supabase } from "@core/supabase";
import moment from "moment";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {},
      authorize: async (credentials) => {
        if (!credentials) throw Error("Credentials undefined");
        const { data, error } = await supabase.auth.verifyOtp({
          email: credentials.email,
          token: credentials.token,
          type: "email",
        });

        if (error) {
          return null;
        }

        if (data) {
          const user = data.user;
          const accessToken = data?.session?.access_token;
          const refreshToken = data?.session?.refresh_token;
          const expiresAt = data?.session?.expires_at;
          const expiresIn = data?.session?.expires_in;
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiresAt,
            expiresIn,
          };
        }

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
  try {
    const { data } = await supabase.auth.setSession({
      refresh_token: token.refreshToken,
      access_token: token.accessToken,
    });
    return {
      ...token,
      accessToken: data?.session?.access_token,
      refreshToken: data?.session?.refresh_token,
      expiresAt: data?.session?.expires_at,
    };
  } catch (error) {
    console.log(error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
