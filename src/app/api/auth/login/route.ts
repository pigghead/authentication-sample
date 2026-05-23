import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import jwt from 'jsonwebtoken';

interface LoginBody {
    emailId: string,
    password: string,
}

export async function POST(req: NextRequest) {
    try {
        // Step 1: Extract emailId + password from request body
        const body: LoginBody = await req.json();

        // destructure our request body
        const { emailId, password } = body;

        // Step 2: Check if the user already exists in the database using the provided emailId
        const user = await User.findOne({ emailId });

        // Step 3: if no user is found with the given emailId, return an error message
        if (!user) {
            return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
        }

        // Step 4: Validate the password entered by the user comparing it with the hashed password stored in the database
        const isPasswordValid: boolean = await user.validatePassword(password);

        // Step 5: If the password valid, generate a Jwt token for the user
        if (isPasswordValid) {
            // Generate a Jwt token using the user's credentials
            const token = await user.getJWT();

            // Step 6: Set the Jwt token in an HttpOnly cookie to store it securely
            const response = NextResponse.json(
                { token, firstName: user.firstName, _id: user._id, message: 'User logged in successfully'}, 
                { status: 201 }
            );
            response.cookies.set('token', token, {
                httpOnly: true,
                expires: new Date(Date.now() + 3600000),
                secure: process.env.NODE_ENV === 'production',
            });

            // Step 7: send the response json object
            return response;

            // Step 7: Send the response with the generated jwt token and user data (e.g., first name and user Id)
            // res.status(200).json({ 
            //     token,
            //     firstName: user.firstName,
            //     _id: user._id,
            // });
        } else {
            // Step 8: if the password is incorrect, send an error message
            return NextResponse.json({ message: 'Invalid credentials' });
            // res.status(400).json({
            //     message: 'Invalid credentials',
            // });
        }
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Server error';
        return NextResponse.json({ message }, { status: 400} );
    }
}

/*
Summary:
- Validate credentials
- Password verification
- Generate Jwt & store it in an httpOnly cookie
*/