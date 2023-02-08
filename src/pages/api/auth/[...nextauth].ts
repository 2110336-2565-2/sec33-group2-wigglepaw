import NextAuth, { type User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

import type { User as UserDB } from "@prisma/client";

export const authOptions: NextAuthOptions = {
  session: {
    // Must use jwt because we're using custom credentials provider:
    // https://stackoverflow.com/questions/74299908/nextauth-not-generating-session-token-for-credential-provider
    strategy: "jwt",
  },
  callbacks: {
    // JWT token is sent to the client as encrypted cookie.
    jwt({ token, account, user, profile }) {
      if (user) {
        // Populate token with user data.
        // Any data you want to send to the client, must be in the token.
        // then you can access it in the session callback.
        // If there any TS error, check or edit the type definition of JWT in next-auth.d.ts.
        token.id = user.id;
        token.username = user.username;
        token.email = user.email;
      }
      return token;
    },

    // Session is sent to the client, use it to pick what to send.
    // Token are populate in "jwt" callback.
    // Do not use "user" argument, it is not populated and will break, I spent 6 hr fixing this shit.
    session({ session, token }) {
      if (session.user) {
        // Populate session with user data.
        // If there any TS error, check or edit the type definition of Session in next-auth.d.ts.
        // DON'T include sensitive information such as user.password on session
        session.user.id = token.id;
        session.user.username = token.username;
        session.user.email = token.email;
      }
      return session;
    },
  },
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    // Custom credentials provider, for signing in with username and password
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        isRegistration: { label: "Register", type: "checkbox" },
      },
      async authorize(credentials) {
        if (credentials === undefined) return null;

        // Get information from credentials
        const email = credentials.email;
        const username = credentials.username;
        const password = credentials.password;
        const isRegistration = Boolean(credentials.isRegistration);

        // Authenticate user
        const userDB = await authenticateUser(
          email,
          username,
          password,
          isRegistration
        );
        if (userDB === null) return null;

        // Map user in DB to user in NextAuth, then return it
        const userNextAuth: User = {
          id: userDB.userId,
          username: userDB.username,
          password: userDB.password,
          email: userDB.email,
        };
        return userNextAuth;
      },
    }),
  ],
};

/**
 * Authenticates a user by either registering a new user or logging in an existing user.
 *
 * @param {string} username - The username of the user to be authenticated.
 * @param {string} password - The password of the user to be authenticated.
 * @param {boolean} isRegistration - A flag indicating whether to register a new user or log in an existing user.
 *
 * @returns The authenticated user if authentication is successful, or `null` if authentication fails.
 */
async function authenticateUser(
  email: string,
  username: string,
  password: string,
  isRegisteration: boolean
) {
  // Get user associated with that username, if exists
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
  });

  if (isRegisteration) {
    // Case: Register

    // User must not already exist
    if (user !== null) return null;

    // Create new user, with credentials
    const newUser = await prisma.user.create({
      data: {
        email,
        username,
        password,
      },
    });
    // Return user
    return newUser;
  } else {
    // Case: Login

    // User must exist, and have credentials
    if (user === null) return null;
    // Password must match
    if (user.password !== password) return null;

    // Return user
    return user;
  }
}

export default NextAuth(authOptions);
