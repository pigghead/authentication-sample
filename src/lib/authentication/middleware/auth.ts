import { Schema, model, connect } from 'mongoose';
import Validator from '../validator/validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const userInfo = new Schema({
    firstName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30,
    },

    lastName: {
        type: String,
        required: true,
        minLength: 4,
        maxLength: 30
    },

    emailId: {
        type: String, 
        required: true,
        unique: true,
        trim: true,
        lowercase: true,

        // optional e-mail validation
        // validate(value) {
        //     if(!Validator.isEmail(value)) {
        //         throw new Error("Please provide a valid email: " + value);
        //     }
        // }
    },

    password: {
        type: String,
        required: true,

        // optional password validation
        // validate(value) {
        //     if(!Validator.isStrongPassword(value)) {
        //         throw new Error("Please provide a strong password: " + value);
        //     }
        // }
    }
});

// generate a jwt for the user
userInfo.methods.getJWT = async function () {
    // store the current user instance in the 'user' variable for reference
    const user = this;

    // gen a jwt token using the user's unique Id as the payload
    const token = jwt.sign(
        {
            _id: user._id,
        },
        'shhh',  // replace this secret key with a securely stored key in .env
        {
            expiresIn: '7d',  // token expiration in 7 days to maintain user sessions
        }
    );

    // return the generatedd token to be used for auth
    return token;
};

// method for validating a user's password by comparing it with the stored hashed password
userInfo.methods.validatePassword = async function(userPassword: string) {
    // store current user instance in the 'user' variable for reference
    const user = this;

    // get hashed pword from the user's data in the database
    const passwordHash = user.password;

    // use bcrypt to compare plain text pword with the hashed pword
    const isPasswordValid = await bcrypt.compare(userPassword, passwordHash);

    return isPasswordValid;
};

/*
Summary:
1. `getJWT`
    - generates a jwt for the user including only their unique  `_id` in the token payload
    - uses a secret key for signing the token. Replace with .env secret
    - token configured to expire in 7 days, enables longer user sessions

2. `validatePassword`
    - securely compares the plain text password entered by the user (`userPassword`) with the hashed password stored in the database
    - returns `true` if the passwords match or `false` if they do not, ensuring secure validation without exposing sensitive data
    
Security Note:
- Replace placeholder secret with actual stored key
- always validate input data to prevent injection attacks or unexpected errors
*/

// export schema as a model
module.exports = model('User', userInfo);