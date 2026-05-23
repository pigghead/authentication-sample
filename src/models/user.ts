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
    firstName:  { type: String, required: true },
    lastName:   { type: String, required: true },
    emailId:    { type: String, required: true },
    password:   { type: String, required: true },
});

userSchema.methods.getJWT = async function (): Promise<string> {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET!, { expiresIn: '1h' });
};

userSchema.methods.validatePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
}

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);

export default User;