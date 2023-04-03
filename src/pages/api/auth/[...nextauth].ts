import NextAuth, { type User, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db";

import { type UserSubType, UserType } from "../../../types/user";

// Call this at create user
export function saltHashPassword(plainPassword: string) {
  const saltRounds = 10;
  const salt = genSaltSync(saltRounds);
  const hash = hashSync(plainPassword, salt);
  return { salt: salt, hash: hash };
}

// Check if password is correct
export function checkPassword(plainPassword: string, correctHash: string) {
  return compareSync(plainPassword, correctHash);
}

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

        // Trick to convert user's type to correct type.
        const u = user as User;

        token.id = u.id;
        token.username = u.username;
        token.email = u.email;
        token.picture = u.imageUri;

        // Removed password.
        const { password: _, ...rest } = u;
        token = {
          ...rest,
          ...token,
        };
        console.log(u);
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

        const { sub, iat, exp, jti, ...rest } = token;
        session.user = rest;
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
      },
      async authorize(credentials) {
        if (credentials === undefined) return null;

        // Get information from credentials
        const email = credentials.email;
        const username = credentials.username;
        const password = credentials.password;

        // Authenticate user
        const userDB = await authenticateUser(email, username, password);
        if (userDB === null) return null;

        // Map user in DB to user in NextAuth, then return it
        const userCommonInfo = {
          id: userDB.userId,
          username: userDB.username,
          password: userDB.password,
          email: userDB.email,
          address: userDB.address,
          phoneNumber: userDB.phoneNumber,
          imageUri: userDB.imageUri,
          salt: userDB.salt,
        };

        if (userDB.petOwner) {
          const userSubInfo: UserSubType = {
            userId: userDB.userId,
            userType: UserType.PetOwner,
            firstName: userDB.petOwner.firstName,
            lastName: userDB.petOwner.lastName,
            petTypes: userDB.petOwner.petTypes,
          };

          const user: User = { ...userSubInfo, ...userCommonInfo };
          return user;
        } else if (userDB.petSitter && userDB.petSitter.freelancePetSitter) {
          const userSubInfo: UserSubType = {
            userId: userDB.userId,
            userType: UserType.FreelancePetSitter,
            verifyStatus: userDB.petSitter.verifyStatus,
            certificationUri: userDB.petSitter.certificationUri,
            firstName: userDB.petSitter.freelancePetSitter.firstName,
            lastName: userDB.petSitter.freelancePetSitter.lastName,
            petTypes: userDB.petSitter.petTypes,
            startPrice: userDB.petSitter.startPrice,
            endPrice: userDB.petSitter.endPrice,
            avgRating: userDB.petSitter.avgRating,
            reviewCount: userDB.petSitter.reviewCount,
          };

          const user: User = { ...userSubInfo, ...userCommonInfo };
          return user;
        } else if (userDB.petSitter && userDB.petSitter.petHotel) {
          const userSubInfo: UserSubType = {
            userId: userDB.userId,
            userType: UserType.PetHotel,
            verifyStatus: userDB.petSitter.verifyStatus,
            certificationUri: userDB.petSitter.certificationUri,
            hotelName: userDB.petSitter.petHotel.hotelName,
            businessLicenseUri: userDB.petSitter.petHotel.businessLicenseUri,
            petTypes: userDB.petSitter.petTypes,
            startPrice: userDB.petSitter.startPrice,
            endPrice: userDB.petSitter.endPrice,
            avgRating: userDB.petSitter.avgRating,
            reviewCount: userDB.petSitter.reviewCount,
          };

          const user: User = { ...userSubInfo, ...userCommonInfo };
          return user;
        } else if (userDB.Admin) {
          const userSubInfo: UserSubType = {
            userId: userDB.userId,
            userType: UserType.Admin,
          };
          const user: User = { ...userSubInfo, ...userCommonInfo };
          return user;
        } else {
          throw new Error("User type cannot be determined");
        }
      },
    }),
  ],
};

/**
 * Authenticates a user (for logging in an existing user).
 *
 * @param {string} username - The username of the user to be authenticated.
 * @param {string} password - The password of the user to be authenticated.
 *
 * @returns The authenticated user if authentication is successful, or `null` if authentication fails.
 */
async function authenticateUser(
  email: string,
  username: string,
  password: string
) {
  // Get user associated with that username, if exists
  // include information on thier subtype
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ email }, { username }],
    },
    include: {
      petSitter: {
        include: {
          freelancePetSitter: true,
          petHotel: true,
        },
      },
      petOwner: true,
      Admin: true,
    },
  });

  // User must exist, and have credentials
  if (user === null) return null;
  // Password must match
  // if (user.password !== password) return null;
  console.log(password, user.password);
  console.log(checkPassword(password, user.password));
  if (!checkPassword(password, user.password)) return null;
  // Return user
  return user;
}

export default NextAuth(authOptions);
