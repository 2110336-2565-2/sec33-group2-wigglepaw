import { type DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import { type UserSubType } from "./user";

declare module "next-auth/jwt" {
  /** Returned by the `jwt` callback and `getToken`, when using JWT sessions */
  type JWT = {
    id: string;
    username: string;
    email: string;
    picture: string | null;

    // Default JWT properties
    sub: string;
    iat: number;
    exp: number;
    jti: string;
  } & UserSubType;
}

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user?: {
      id: string;
      username: string;
      email: string;
      picture: string | null;
    } & UserSubType;
  }

  /**
   * The shape of the user object returned in the OAuth providers' `profile` callback,
   * or the second parameter of the `session` callback, when using a database.
   */
  type User = {
    id: string;
    username: string;
    email: string;
    password: string;
    phoneNumber: string | null;
    address: string | null;
    imageUri: string | null;
  } & UserSubType;
}
