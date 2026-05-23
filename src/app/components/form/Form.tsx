"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import { SubmitEvent } from 'react';
import { useRouter } from 'next/navigation';

export default function Form() {
    // state for inputs
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const router = useRouter();

    // const handleSubmit = async (e: { preventDefault: () => void; }) => {
    //     e.preventDefault();
    //     setError('');

    //     if (!email || !password) {
    //         setError('Please fill in all fields')
    //         return;
    //     }

    //     try {
    //         console.log("Logging in with, ", {email, password});
    //     } catch (err) {
    //         setError("Invalid email/password");
    //     }
    // }

    async function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const email = formData.get('email');
        const password = formData.get('password');

        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        });

        if(response.ok) {
            router.push('/profile')
        } else {
            // TODO: implement error handling
        }
    }

    const { pending } = useFormStatus();
    return (
        <form onSubmit={(handleSubmit)}>
            <label>Email:</label>
            <input 
                name="email"
                type="email"
                placeholder="E-mail" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="border-2 border-solid border-black rounded-md mx-4 p-1" 
            />

            <label>Password:</label>
            <input 
                type="password" 
                value={password}
                placeholder="Password"
                onChange={(e) => setPassword(e.target.value)}
                required
                className="border-2 border-solid border-black rounded-md mx-4 p-1"
            /> 

            <button 
                type="submit"
                className="border-2 border-solid border-black mx-4 p-1"
            >
                    {pending ? "Logging in..." : "Login"}
            </button>
        </form>
    );
}