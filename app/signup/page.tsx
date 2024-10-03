"use client"
import { useState, useEffect, useRef } from "react";
import ky, { HTTPError, TimeoutError } from 'ky';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch, faEye, faEyeSlash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { API_ENDPOINTS } from "@/server/endpoints";
import { useSearchParams } from "next/navigation";
import secureLocalStorage from "react-secure-storage";

interface SignUpResponse {
    email: string;
    expiryAt: string;
    message: string;
    tempToken: string;
    username: string;
}
interface SignUpForm{
    firstName: string;
    middleName?: string;
    lastName: string;
    email: string;
    username: string;
    password: string;
}

interface CheckUsernameResponse {
    available: boolean;
    message?: string;
}


export default function SignUp() {

    const router = useRouter();
    const params = useSearchParams();
    const host = params.get('host');
    const [userName, setUserName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');

    const [isAvailable, setIsAvailable] =  useState<boolean | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isPassVisible, setPassVisible] = useState<boolean>(false);

    const [inputErrMsg, setInputErrMsg] = useState<string | null>(null); 
    const [signUpErrMsg, setSignUpErrMsg] = useState<string>('')

    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);

    const userNameRef = useRef<HTMLInputElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);
    
    //Focus on username field when component loads
    useEffect(() => {
        if (userNameRef.current) {
            userNameRef.current.focus();
        }
    }, []);

    //API to check if username available
    const checkUserName = async (userName: string) => {
        try {
            const response = await ky.post(API_ENDPOINTS.USERNAME_CHECK,{
                headers: {
                'Content-Type': 'application/json',
                },
                json: {username: userName}
            }).json<CheckUsernameResponse>();
            setIsAvailable(response.available)
        }
        catch (error) {
            setSignUpErrMsg("We are currently facing issues. Please try later.");
            setIsAvailable(false);
        }
    }

    //for checking username availibility a second after the user has started typing
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

    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setInputErrMsg(null);
        setSignUpErrMsg("");
    
        //Conditions to check if inputs are correct
        const conditions = [
          { condition: userName === "" || email === "" || password === "" || confirmPassword === "", message: "Please fill all the fields." },
          { condition: userName.length < 5 || userName.length > 32, message: "Username must be 5-25 characters long." },
          { condition: !/^[a-zA-Z0-9_.]+$/.test(userName), message: "Username can only have letters, numbers . and _." },
          { condition: isAvailable === false, message: "Username is already taken." },
          { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), message: "Email is not in the correct format." },
          { condition: checkPasswordStrength(password) < 4, message: "Password must contain A-Z, a-z and 0-9." },
          { condition: password.length < 8 && password.length > 30, message: "Password must be between 8 and 30 characters long." },
          { condition: password !== confirmPassword, message: "Passwords do not match." },
          { condition: !termsRef.current?.checked, message: "Please agree to the terms and conditions." },
        ];
    
        for (const { condition, message } of conditions) {
          if (condition) {
            setInputErrMsg(message);
            return;
          }
        }
    
        //Create SigUpDetails onbject
        const userSignUp: SignUpForm = {
            firstName: "",
            middleName: "",
            lastName: "",
            username: userName,
            email: email,
            password: password,
        };
    
        setIsSigningUp(true);

        try {
          const response = await ky.post(API_ENDPOINTS.USER_SIGNUP,{
            headers: {
            'Content-Type': 'application/json',
            },
            json: userSignUp
        }).json<SignUpResponse>();
          console.log(response)
          // Code after signup successful
          secureLocalStorage.setItem('accessKey', response.tempToken);          
          secureLocalStorage.setItem('email', response.email);
          secureLocalStorage.setItem('username', response.username);
          if (host) {
            router.push("/register/otp?verify=user&host=true");
          } else {
          router.push("/register/otp?verify=user");
          }
        //API failures
        } catch (error) {
            console.log(error)
          if (error instanceof HTTPError) {
            if (error.response.status === 500) {
              setSignUpErrMsg("Server error. Please try again later.");
            }
            const errorData = await error.response.json();
            switch (errorData.message) {
              case "badRequest":
                setSignUpErrMsg("Bad request. Please check your input.");
                break;
              case "emailExists":
                setSignUpErrMsg("Email already exists. Please try another.");
                break;
              case "invalidCreds":
                setSignUpErrMsg("Unauthorized. Please check your credentials.");
                break;
              default:
                setSignUpErrMsg("An unexpected error occurred. Please try again.");
            }
          } else if (error instanceof TimeoutError) {
            setSignUpErrMsg("Request timed out. Please try again.");
          } else {
            setSignUpErrMsg("An unexpected error occurred. Please try again.");
          }
        } finally {
          setIsSigningUp(false);
        }
    };
    

    return(
    <div className="relative flex h-full my-16 items-center justify-center rounded-lg">
        <form onSubmit={handleSignUp} className="-translate-y-8 bg-black border-2 border-zinc-500/20 rounded-lg w-96 h-[480px] p-6 flex flex-col gap-2 justify-center relative">
            <div className="w-full relative text-3xl">
                <p>Create Account</p>
            </div>

            <div className="relative h-2 mb-0.5">
                {inputErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {inputErrMsg}</p> : null}
                {signUpErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {signUpErrMsg}</p> : null}
            </div>

            <div className="relative">
                <label htmlFor="userName" className="text-sm text-zinc-400">Username</label>
                <input
                    ref={userNameRef}
                    value={userName}
                    id="userName"
                    onChange={(e) => setUserName(e.target.value)} 
                    className={`w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 
                        outline-none hover:ring-1  focus:ring-1 ring-gray-900 
                        ${isAvailable === null ? '' : isAvailable ? 'ring-1 ring-green-500' : 'ring-1 ring-red-500'}`}
                />        
            </div>

            <div className="relative">
                <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
                <input 
                    value={email}
                    id="email"
                    onChange={(e) => setEmail(e.target.value )} 
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />
            </div>

            <div className="relative">
                <label htmlFor="password" className="text-sm text-zinc-400">Password</label>
                <input type={isPassVisible ? "text" : "password"} 
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-1 rounded-lg font-mono bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"/>
                
                <button type="button" onClick={() => setPassVisible(!isPassVisible)} className="bg-zinc-900 absolute right-2 top-7 text-zinc-400" >{isPassVisible ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }</button>   
                
                <div className="flex gap-1 w-full  my-1">
                    <div className={`${checkPasswordStrength(password) >= 1 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(password) >= 2 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(password) >= 3 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(password) >= 4 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                </div>
            </div>

            <div className="relative">
                <label htmlFor="confirmpassword" className="text-sm text-zinc-400">Confirm Password</label>
                <input type={isPassVisible ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full p-1 rounded-lg font-mono bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"/>
                <button type="button" onClick={() => setPassVisible(!isPassVisible)} className="bg-zinc-900 absolute right-2 top-7 text-zinc-400" >{isPassVisible ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }</button>   
            </div>

            <div className="flex gap-1 text-xs text-zinc-400">
                <input ref={termsRef} type="checkbox" className="opacity-75"/>
                <p>I agree to the <button type="button" className="underline">Terms and Conditions</button></p>
            </div>

            <div className="flex flex-col items-center mt-4">

                <button type="submit"
                    className="w-full p-2 rounded-lg bg-zinc-900 text-zinc-300 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900"
                    disabled={isSigningUp}>
                {isSigningUp ? <p><FontAwesomeIcon icon={faCircleNotch} spin /></p> : <p>Create Account</p>}</button>

                {/* <p className="text-xs text-zinc-400 my-1">or</p>

                <button type="button" className="w-full flex items-center justify-center gap-2 text-zinc-300 p-2 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900">
                    <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 48 48">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                    </svg>
                    Sign In with Google
                </button> */}

            </div>

            {/* <div className="mt-2">
                <p className="w-full text-right text-sm text-zinc-400">Already have an account? <Link href='/login' className="text-zinc-300 underline">Login</Link></p>
            </div> */}
        </form>
    </div>
    )
}