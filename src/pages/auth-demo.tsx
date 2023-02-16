/**
 * NextJs Demo page of how to use auth from next-auth.
 * Specifically, how to use the useSession hook, to register, login, and logout, using username and password.
 *
 * Delete when appropiated.
 */
import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";

const AuthDemo = () => {
  // This is useSession hook from nextAuth.
  // It returns a session object, and a status string.
  //
  // session will be null if user hasn't authenticated, and will be an object if they have.
  // if it's a object most of the data can be access from "session.user"
  const { data: session, status } = useSession();

  // If loading, show loading message
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // Set the status color based on the status string.
  // Probably not the best way to do this, but it works.
  let statusColor;
  switch (status) {
    case "authenticated":
      statusColor = "bg-green-200";
      break;
    case "unauthenticated":
      statusColor = "bg-red-200";
      break;
    default:
      statusColor = "bg-yellow-200";
  }

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-center text-2xl">Auth Demo</h1>

      {/* Show the session object and status string */}
      <section className="flex items-center justify-center gap-2 rounded-md border-4 p-2 ">
        <p className="whitespace-pre">
          Session: {JSON.stringify(session, null, 4)}
        </p>
        <p className={"rounded-lg p-1 " + statusColor}>Status: {status}</p>
      </section>

      {/* If not signed in, show sign in button */}
      {!session && (
        <section className="rounded-md border-4 p-2">
          Not signed in <br />
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => signIn()}
          >
            Sign in
          </button>
        </section>
      )}

      {/* If signed in, show auth information and sign out button */}
      {session && (
        <section className="rounded-md border-4 p-2">
          <p className="whitespace-pre">
            Signed in as {JSON.stringify(session.user, null, 4)}{" "}
          </p>
          <button
            className="rounded bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
            onClick={() => signOut()}
          >
            Sign out
          </button>
        </section>
      )}
    </div>
  );
};

export default AuthDemo;
