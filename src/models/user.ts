// src/models/user.ts

import mongoose, { Schema, Document, Model } from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    firstName: string;
    lastName: string;
    emailId: string;
    password: string;
    getJWT(): Promise<string>;
    validatePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
    firstName:  { type: String, required: true, minLength: 3, maxLength: 33 },
    lastName:   { type: String, required: true, minLength: 3, maxLength: 33 },
    emailId:    { type: String, required: true, unique: true },
    password:   { type: String, required: true },
}, {
    timestamps: true  // automatically add createdAt and updatedAt
});

// generates a jwt for user authentication
userSchema.methods.getJWT = async function (): Promise<string> {
    // rewrote the return for more verbosity + clarity
    const token = jwt.sign(
        { id: this._id},    // includes user's unique db Id in token payload
        'shhh',             // replace with a secret key from .env
        { expiresIn: '7d'}  // 7d token expiry for longer user sessions
    );

    return token;
    //return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

// compare user provided passwords with stored hash using bcrypt
userSchema.methods.validatePassword = async function(candidatePassword: string): Promise<boolean> {
    const passwordHash = this.password;

    const isPasswordValid = await bcrypt.compare(candidatePassword, passwordHash);

    return isPasswordValid;
    //return bcrypt.compare(candidatePassword, this.password);
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;