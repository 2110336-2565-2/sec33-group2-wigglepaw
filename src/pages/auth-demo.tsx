/**
 * NextJs Demo page of how to use auth from next-auth.
 * Specifically, how to use the useSession hook, to register, login, and logout, using username and password.
 */
import React from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';

const AuthDemo = () => {
    const {data: session, status} = useSession();

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Auth Demo</h1>
            <p>Session: {JSON.stringify(session)}</p>
            <p>Status: {status}</p>

        {!session && (
            <>
            Not signed in <br />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => signIn()}
            >
              Sign in
            </button>
            </>
        )}
        {session && (
            <>
            Signed in as {JSON.stringify(session.user)} <br />
            <button onClick={() => signOut()}>Sign out</button>
            </>
        )}
        </div>
    );
};

export default AuthDemo;