"use client"
import { useState, useEffect, useRef } from "react";
import ky, { HTTPError, TimeoutError } from 'ky';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch, faSpinner } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface SignUpDetails{
    userName: string;
    userMail: string;
    passWord: string;
}

interface CheckUsernameResponse {
    available: boolean;
    message?: string;
}


export default function SignUp() {
    
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [isAvailable, setIsAvailable] =  useState<boolean | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);

    const [userSignUp, setUserSignUp] = useState<SignUpDetails | null>(null);

    const [inputErrMsg, setInputErrMsg] = useState<string | null>(null); 
    const [signUpErrMsg, setSignUpErrMsg] = useState<string>('')

    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

    const termsRef = useRef<HTMLInputElement>(null);

    const checkUserName = async (userName: string) => {
        try {
            const response = await ky.post('CHECK_USERNAME_API_ENDPOINT',
                {json: userName}).json<CheckUsernameResponse>();
            setIsAvailable(response.available)
        }
        catch (error) {
            setIsAvailable(false);
        }
    }

    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if(userName.length > 0){
            setTypingTimeout(setTimeout(() => {
                checkUserName(userName);
            }, 1000));
        } else {
            setIsAvailable(null)
        }
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [userName]);

    const checkPasswordStrength = (password: string): number => {
        let conditionsMet = 0;
    
        if (/[A-Z]/.test(password)) conditionsMet++;
        if (/[a-z]/.test(password)) conditionsMet++;
        if (/\d/.test(password)) conditionsMet++;
        if (password.length >= 8) conditionsMet++; 
    
        return conditionsMet;
    };

    const handleSignUp = async () => {
        const conditions = [
            { condition: userName === '' || email === '' || password === '' || confirmPassword === '', message: 'All fields are required.' },
            { condition: userName.length < 3, message: 'Username must be at least 3 characters long.' },
            { condition: !/^[a-zA-Z0-9_.]+$/.test(userName), message: 'username can have only _ and . as special characters' },
            { condition: !isAvailable, message: 'Username is not available.' },
            { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), message: 'Email is not in the correct format.' },
            { condition: checkPasswordStrength(password) < 4, message: 'Password is too weak.' },
            { condition: password !== confirmPassword, message: 'Passwords do not match.' },
            { condition: !termsRef.current?.checked, message: 'Please agree to the terms and conditions.' }
        ];

        for (const { condition, message } of conditions) {
            if (condition) {
                setInputErrMsg(message);
                return;
            }
        }

        try{
            const response = await ky.post('SIGNIN_API_ENDPOINT',
                {json: userSignUp}).json();
            } 
        catch (error) {

            if (error instanceof HTTPError) {
                if (error.response.status === 500) {
                    setSignUpErrMsg('Server error. Please try again later.');
                }
                switch (error.message) {
                    case "badRequest":
                        setSignUpErrMsg('Bad request. Please check your input.');
                        break;
                    case "emailExists":
                        setSignUpErrMsg('Email already exists. Please try another.');
                        break;
                    case "invalidCreds":
                        setSignUpErrMsg('Unauthorized. Please check your credentials.');
                        break;
                    default:
                        setSignUpErrMsg('An unexpected error occurred. Please try again.');
                } 
            } else if (error instanceof TimeoutError) {
                setSignUpErrMsg('Request timed out. Please try again.');
            } else {
                setSignUpErrMsg('An unexpected error occurred. Please try again.');
            }
        }
        return;
    }


    return(
    <div className="flex rounded-lg bg-zinc-950 bg-opacity-50 shadow-soft backdrop-blur-md border border-gray-500 border-opacity-10">
        <div className="relative w-96 h-[540px] p-2 flex items-center justify-center">
            <Image fill className="object-cover rounded-l-lg brightness-50" src="https://images.unsplash.com/photo-1549194400-06e6874c2fd1?q=80&w=1964&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="SignUp"/>
            <div className="relative w-72 h-96 rounded-lg bg-zinc-950 bg-opacity-75 backdrop-blur-sm">
            </div>
        </div>
        <form className="w-96 h-[540px] p-6 flex flex-col gap-2 justify-center relative">
            <div className="w-full h-12 text-xl">
                <p>Sign Up</p>
            </div>
            <div>
                <p className="text-sm text-zinc-500">Username</p>
                <input 
                    value={userName} 
                    onChange={(e) => setUserName(e.target.value)} 
                    className={`w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 
                        outline-none hover:ring-1 focus:ring-1 ring-gray-900 
                        ${isAvailable === null ? '' : isAvailable ? 'ring-1 ring-green-500' : 'ring-1 ring-red-500'}`}
                />        
            </div>
            <div>
                <p className="text-sm text-zinc-500">Email</p>
                <input 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value )} 
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />            
            </div>
            <div className="relative">
                <p className="text-sm text-zinc-500">Password</p>
                <input type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"/>
                <div className="flex gap-1 w-full  mt-1">
                    <div className={`${checkPasswordStrength(password) >= 1 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(password) >= 2 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(password) >= 3 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(password) >= 4 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                </div>
            </div>
            <div className="relative">
                <p className="text-sm text-zinc-500">Confirm Password</p>
                <input type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"/>
            </div>
            <div className="flex gap-1 text-xs text-zinc-500">
                <input ref={termsRef} type="checkbox" className="opacity-75"/>
                <p>I agree to the <button className="underline">Terms and Conditions</button></p>
            </div>
            <div className="flex flex-col items-center mt-4">
                
                <button onSubmit={handleSignUp} 
                    className="w-full p-2 rounded-lg bg-zinc-900 text-zinc-300 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900"
                    disabled={isSigningUp}>
                {isSigningUp ? <p><FontAwesomeIcon icon={faCircleNotch} spin /></p> : <p>Create Account</p>}</button>
                <p className="text-xs text-zinc-500 my-1">or</p>
                <button className="w-full flex items-center justify-center gap-2 text-zinc-300 p-2 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Sign In with Google
                </button>
            </div>
            <div className="mt-2">
                <p className="w-full text-right text-sm text-zinc-500">Already have an account? <Link href='/login' className="text-zinc-300 underline">Login</Link></p>
            </div>
        </form>
    </div>
    )
}