// src\middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import jsonwebtoken from 'jsonwebtoken';

//const { verify } = jsonwebtoken;

export function proxy(req: NextRequest) {
    try {
        // get authorization header from the request
        const authHeader = req.headers.get('authorization');

        // ensure format 'Bearer <token>'
        if(!authHeader?.startsWith('Bearer ')) {
            // redirect -or- return a 401
            return NextResponse.json(
                { error: 'Authentication Required' }, { status: 401 }
            );
        }

        // extract the token from the format 'Bearer <token>'
        const token = authHeader.split(' ')[1];
        
        //const decoded = verify(token, 'shhh');

        return NextResponse.next();
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Server Error'
        return NextResponse.json(
            {message}, { status: 500 }
        );
    }
    // const token = req.cookies.get('token')?.value;

    // if (!token) {
    //     return NextResponse.redirect(new URL('login, req.url'));
    // }

    // return NextResponse.next();
}

export const config = {
    matcher: ['/profile/:path*', '/dashboard/:path*']
}

/*
    Summary: In the context of Next.js, this file sits directly at the root, next to the app folder. Next.js automatically runs this file on every request,
        before it hits any route or page. It is not imported anywhere as it is picked up by convention.
*/