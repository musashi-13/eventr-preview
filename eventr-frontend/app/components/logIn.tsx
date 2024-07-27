"use client"
import { useState, useEffect, useRef } from "react";
import ky, { HTTPError, TimeoutError } from 'ky';
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch, faEye, faEyeSlash, faWarning } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

interface LogInDetails{
    userMail: string;
    passWord: string;
}

export default function LogIn() {
    
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const [isPassVisible, setPassVisible] = useState<boolean>(false);

    const [userLogIn, setUserLogIn] = useState<LogInDetails | null>(null);

    const [inputErrMsg, setInputErrMsg] = useState<string | null>(null); 
    const [logInErrMsg, setLogInErrMsg] = useState<string>('')

    const [isLogginIn, setIsLogginIn] = useState<boolean>(false);

    const userNameRef = useRef<HTMLInputElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);
    
    //Focus on username field when component loads
    useEffect(() => {
        if (userNameRef.current) {
            userNameRef.current.focus();
        }
    }, []);


    const handleLogIn = async (event: React.FormEvent) => {
        event.preventDefault();
        setInputErrMsg(null);
        setLogInErrMsg("");
    
        //Conditions to check if inputs are correct
        const conditions = [
          { condition: email === "" || password === "", message: "Please fill all the fields." },
          { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), message: "Email is not in the correct format." },
        ];
    
        for (const { condition, message } of conditions) {
          if (condition) {
            setInputErrMsg(message);
            return;
          }
        }
    
        //Create SigUpDetails onbject
        const userLogIn: LogInDetails = {
          userMail: email,
          passWord: password,
        };
    
        setIsLogginIn(true);

        try {
          const response = await ky.post("SIGNIN_API_ENDPOINT", {
            json: userLogIn,
          }).json();
          // Code after signup successful

        //API failures
        } catch (error) {
          if (error instanceof HTTPError) {
            if (error.response.status === 500) {
              setLogInErrMsg("Server error. Please try again later.");
            }
            const errorData = await error.response.json();
            switch (errorData.message) {
              case "emailDoesNotExist":
                setLogInErrMsg("Email does not exist. Try signing up instead.");
                break;
              case "wrongPassword":
                setLogInErrMsg("Password is incorrect.");
                break;
              default:
                setLogInErrMsg("An unexpected error occurred. Please try again.");
            }
          } else if (error instanceof TimeoutError) {
            setLogInErrMsg("Request timed out. Please try again.");
          } else {
            setLogInErrMsg("An unexpected error occurred. Please try again.");
          }
        } finally {
          setIsLogginIn(false);
        }
      };


    return(
    <form onSubmit={handleLogIn} className=" relative w-96 h-[416px] p-6 flex flex-col gap-2 justify-center rounded-lg bg-zinc-950 bg-opacity-50 shadow-soft backdrop-blur-md border border-gray-500 border-opacity-10">

        <div className="w-full relative text-2xl">
            <p>Log In</p>
        </div>

        <div className="relative h-2 mb-0.5">
            {inputErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {inputErrMsg}</p> : null}
            {logInErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {logInErrMsg}</p> : null}
        </div>

        <div className="relative">
            <label htmlFor="email" className="text-sm text-zinc-500">Email</label>
            <input 
                value={email}
                id="email"
                onChange={(e) => setEmail(e.target.value )} 
                className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
            />
        </div>

        <div className="relative">
            <label htmlFor="password" className="text-sm text-zinc-500">Password</label>
            <input type={isPassVisible ? "text" : "password"} 
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"/>
            
            <button type="button" onClick={() => setPassVisible(!isPassVisible)} className="bg-zinc-900 absolute right-2 top-7 text-zinc-500" >{isPassVisible ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }</button>   

        </div>

        <div className="flex flex-col items-center mt-8">

            <button type="submit"
                className="w-full p-2 rounded-lg bg-zinc-900 text-zinc-300 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900"
                disabled={isLogginIn}>
            {isLogginIn ? <p><FontAwesomeIcon icon={faCircleNotch} spin /></p> : <p>Log In</p>}</button>

            <p className="text-xs text-zinc-500 my-1">or</p>

            <button className="w-full flex items-center justify-center gap-2 text-zinc-300 p-2 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                Log In with Google
            </button>

        </div>

        <div className="mt-2">
            <p className="w-full text-right text-sm text-zinc-500">Dont have an account? <Link href='/signup' className="text-zinc-300 underline">Sign up</Link></p>
        </div>
    </form>
    )
}