// src\app\api\auth\logout\route.ts
import { NextResponse } from 'next/server';

export async function POST() {
    try {
        // Step 1: Build the NextResponse json object with confirmation logic
        const response = NextResponse.json (
            { message: 'Logged out successfully' }, { status: 200 }
        );

        // Step 2: Set the cookie token '' to clear and set expiry date to the past
        response.cookies.set('token', '', {
            httpOnly: true,
            expires: new Date(0),
        });

        // Step 3: Return the NextResponse json object
        return response;
    } catch (err: unknown) {
        // Step 4: Handle potential errors and respond with 500 status if something goes wrong
        const message = err instanceof Error ? err.message : 'Server error';  // clarify the err's type as per TypeScript typing rules
        return NextResponse.json(
            { message }, { status: 500 }
        );
    }
}

/*
    Summary:
    1. Clear the authentication token
        - when a user logs out, the jwt token stored in the cookie must be cleared to terminate the session
        - set the token cookie to null and set expiry date to the past
    2. Logout confirmation
        - After clearing authentication cookie, send confirmation back to the user with a 200
        - Tells the user they have been successfully logged out and their session has been terminated
    3. Security considerations
        - setting the httpOnly flag and using sameSite: 'Strict', logout process ensures the token cannot be
            accessed via javascript and prevents cross-site request forgery (csrf) attacks
        - cookie is securely deleted ensuring no session data remains on the client side
*/