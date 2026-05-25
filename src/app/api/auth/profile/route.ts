// src/app/api/auth/profile/route.ts
import { NextRequest, NextResponse } from "next/server";
import jsonwebtoken, { JwtPayload } from 'jsonwebtoken';

const { verify } = jsonwebtoken;

export async function GET(req: NextRequest) {
    const token = req.headers.get('authorization')?.split(' ')[1];
    if(!token) { return NextResponse.json({ error: 'Unauthorized'}, { status: 401 }); }
    try {
        const decoded = verify(token, 'shhh');

        // Check if the decoded object is not a string
        if (typeof decoded === 'object' && decoded !== null) {
            const payload = decoded as JwtPayload & { _id: string };
            const userId = payload._id;

            return NextResponse.json({ userId });
        }

        return NextResponse.json({ error: 'Invalid token structure' }, { status: 400 });
    } catch (err) {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    //const decoded = verify(token, 'shhh') as JwtPayload & { _id: string };
}