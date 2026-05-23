import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/user'

interface CreateUserBody {
    firstName: string,
    lastName: string,
    emailId: string,
    password: string
}

export async function POST(req: NextRequest) {
    try {
        const body: CreateUserBody = await req.json();

        // Step 1: Validate input data from the req body
        // Destructure incoming data from the request body
        const { firstName, lastName, emailId, password } = body;

        // Step 2: Check if the user already exists with the given email address
        const existingUser = await User.findOne({ emailId });
        if (existingUser) {
            // if user with the same email exists, return 400 with an error message
            return NextResponse.json({ message: 'User already exists' }, { status: 400 });
        }

        // Step 3: hash the password using bcrypt
        const passwordHash = await bcrypt.hash(password, 10);  // bcrypt hash with salt

        // Step 4: Create new user doc using the validated data and hashed password
        const userModel = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash  // storing the hashed password
        });

        // Step 5: save the new document to the database
        const savedUser = await userModel.save();

        // Step 6: generate a jwt token for the newly created user for session management
        const token = await savedUser.getJWT();  // the getJWT method generates the JWT token

        // Step 7: Set the JWT token in an HttpOnly cookie for secure client-side storage
        // res.cookie('token', token, {
        //     expires: new Date(Date.now() + 1 * 3600000),
        //     httpOnly: true,  // make the cookie inaccessible to JavaScript for added security
        //     secure: process.env.NODE_ENV === 'production',
        // });
        const response = NextResponse.json(
            { token, firstName: userModel.firstName, _id: userModel._id, message: 'User added successfully' }, 
            { status: 201 }
        );
        response.cookies.set('token', token, {
            httpOnly: true,
            expires: new Date(Date.now() + 3600000),
            secure: process.env.NODE_ENV === 'production',
        });

        // Step 8: Send a success response with the saved user data and a success message
        //res.status(201).json({ data: savedUser, message: "User added successfully" });

        return response;
    } catch(err: unknown) {
        // Step 9: Handle any errors that occur during the process
        // Return 400 status code if there's an error, with the error message or a default "Server error" messaage
        const message = err instanceof Error ? err.message : 'Server error';
        return NextResponse.json({ message }, { status: 400 });
    }
}

/*
Summary:
- Sign-up process ensures new users are registered securely in the system

1. Validation Process
    - validatesSignUpData function enforces data integrity. Checks email format against validator.js,
    password strength (minimum length, etc), required fields (firstName, emailId)

2. Password hashing with bcrypt
    - Before saving a user, password gets hashed using bcrypt.hash(), with a salt round of 10
    - Hashed password is then stored securely

3. Generate Jwt Tokens
    - Jwt token is created using getJWT
    - Token is sent back to the client in an httpOnly cookie, ensuring it's secure and cannot be accessed via Javascript
*/