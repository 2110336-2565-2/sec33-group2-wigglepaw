import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  // Session is sent to the client, use it to pick what to send
  callbacks: {
    session({ session, user }) {
      if (session.user) {
        // Include user.id on session
        session.user.id = user.id;
        // Include user.username on session
        session.user.username = user.username;
        // ! DON"T include user.password on session
      }
      console.log("Session:", session);
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    /**
     * ...add more providers here
     *
     * Most other providers require a bit more work than the Discord provider.
     * For example, the GitHub provider requires you to add the
     * `refresh_token_expires_in` field to the Account model. Refer to the
     * NextAuth.js docs for the provider you want to use. Example:
     * @see https://next-auth.js.org/providers/github
     */
    // Sign in with username and password
    CredentialsProvider({
      id: "Credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        isRegisteration: { label: "Register", type: "checkbox" },
      },
      async authorize(credentials) {
        if (credentials === undefined) return null;

        // Get information from credentials
        const username = credentials.username;
        const password = credentials.password;
        const isRegisteration = credentials.isRegisteration;

        // Get user with that username, if exists
        const user = await prisma.user.findUnique({
          where: { username },
        });

        if (isRegisteration) {
          // Case: Register

          // User must not already exist
          if (user !== null) return null;

          // Create new user
          console.log("Creating new user:", username);
          const newUser = await prisma.user.create({
            data: {
              username,
              password,
            },
          });
          // Return user
          return newUser;
        } else {
          // Case: Login

          // User must exist
          if (user === null) return null;
          // Password must match
          if (user.password !== password) return null;

          console.log("User logged in:", user);
          // Return user
          return user;
        }
      },
    }),
  ],
};

export default NextAuth(authOptions);
