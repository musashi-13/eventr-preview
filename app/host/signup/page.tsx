"use client"
import { useState, useEffect, useRef } from "react";
import ky, { HTTPError, TimeoutError } from 'ky';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch, faCalendar, faEye, faEyeSlash, faWarning } from "@fortawesome/free-solid-svg-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

import { API_ENDPOINTS } from "@/server/endpoints";

interface FormData{
    userName: string;
    userMail: string;
    passWord: string;
    dob: Date | null;
    companyName: string;
    isCompanyRegistered: boolean;
    companyEmail?: string;
    aadhaarId: string;
}

interface CheckUsernameResponse {
    available: boolean;
    message?: string;
}

export default function SignUp() {
    
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const [isAvailable, setIsAvailable] =  useState<boolean | null>(null);
    const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
    const [isPassVisible, setPassVisible] = useState<boolean>(false);
    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<FormData>({
        userName: "",
        userMail: "",
        passWord: "",
        dob: null,
        companyName: "",
        isCompanyRegistered: false,
        companyEmail: "",
        aadhaarId: "",
    });
    const [tempDate, setTempDate] = useState<{ year: number | null, month: number | null, day: number | null }>({
        year: null,
        month: null,
        day: null,
    });
    const [inputErrMsg, setInputErrMsg] = useState<string | null>(null); 
    const [signUpErrMsg, setSignUpErrMsg] = useState<string>('')

    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
    const router = useRouter();
    const userNameRef = useRef<HTMLInputElement>(null);
    const termsRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    //Focus on username field when component loads
    useEffect(() => {
        if (userNameRef.current) {
            userNameRef.current.focus();
        }
    }, []);

    //API to check if username available
    const checkUserName = async (userName: string) => {
        try {
            const response = await ky.post('CHECK_USERNAME_API_ENDPOINT',
                {json: userName}).json<CheckUsernameResponse>();
            setIsAvailable(response.available)
        }
        catch (error) {
            console.error("Error checking username availability", error);
            setIsAvailable(false);
        }
    }

    //for checking username availibility a second after the user has started typing
    useEffect(() => {
        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }
        if(formData.userName.length > 0){
            setTypingTimeout(setTimeout(() => {
                checkUserName(formData.userName);
            }, 1000));
        } else {
            setIsAvailable(null)
        }
        return () => {
            if (typingTimeout) {
                clearTimeout(typingTimeout);
            }
        };
    }, [formData.userName]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setIsDatePickerOpen(false);
            }
        };
        if (isDatePickerOpen) {
            document.addEventListener("mousedown", handleClickOutside);
        } else {
            document.removeEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isDatePickerOpen]);

    const checkPasswordStrength = (password: string): number => {
        let conditionsMet = 0;
        if (/[A-Z]/.test(password)) conditionsMet++;
        if (/[a-z]/.test(password)) conditionsMet++;
        if (/\d/.test(password)) conditionsMet++;
        if (password.length >= 8) conditionsMet++; 
        return conditionsMet;
    };

    const handleDateChange = (field: 'year' | 'month' | 'day', value: number) => {
        const updatedTempDate = { ...tempDate, [field]: value };
        setTempDate(updatedTempDate);
    
        if (updatedTempDate.year !== null && updatedTempDate.month !== null && field === 'day') {
            const newDate = new Date(updatedTempDate.year, updatedTempDate.month, value);
            setFormData(prevData => ({ ...prevData, dob: newDate }));
            setIsDatePickerOpen(false);
            setTempDate({ year: null, month: null, day: null });
        }
    };

    const renderDatePicker = () => {
        const years = Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i)
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ]
        const days = Array.from({ length: 31 }, (_, i) => i + 1)
    
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm z-50">
            <div className="bg-zinc-800 rounded-md shadow-lg p-4" ref={datePickerRef}>
                <div className="grid grid-cols-3 gap-2">
                    <select
                    className="bg-zinc-700 text-white rounded-md p-1"
                    onChange={(e) => handleDateChange('year', parseInt(e.target.value))}
                    value={tempDate.year || ""}
                    >
                    <option value="">Year</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                    </select>
                    <select
                    className="bg-zinc-700 text-white rounded-md p-1"
                    onChange={(e) => handleDateChange('month', parseInt(e.target.value))}
                    value={tempDate.month !== null ? tempDate.month : ""}
                    >
                    <option value="">Month</option>
                    {months.map((month, index) => (
                        <option key={month} value={index}>{month}</option>
                    ))}
                    </select>
                    <select
                    className="bg-zinc-700 text-white rounded-md p-1"
                    onChange={(e) => handleDateChange('day', parseInt(e.target.value))}
                    value={tempDate.day || ""}
                    >
                    <option value="">Day</option>
                    {days.map(day => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                    </select>
                </div>
            </div>
          </div>
        )
    }
    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setInputErrMsg(null);
        setSignUpErrMsg("");
    
        //Conditions to check if inputs are correct
        const conditions = [
            { condition: Object.entries(formData).some(([key, value]) => (key !== 'companyEmail') && (value === "" || value === null || value === undefined)) || confirmPassword === "", message: "Please fill all the fields." },
            { condition: Object.entries(formData).some(([_, value]) => /;/.test(value)), message: "Your input contains semicolons." },
            { condition: formData.userName.length < 5 || formData.userName.length > 32, message: "Username must be at least 3 characters long." },
            { condition: !/^[a-zA-Z0-9_.]+$/.test(formData.userName), message: "Username can only have letters, numbers . and _." },
            { condition: isAvailable === false, message: "Username is already taken." },
            { condition: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.userMail), message: "Email is not in the correct format." },
            { condition: checkPasswordStrength(formData.passWord) < 4, message: "Password must contain A-Z, a-z and 0-9." },
            { condition: formData.passWord.length < 8, message: "Password must be at least 8 characters long." },
            { condition: formData.passWord !== confirmPassword, message: "Passwords do not match." },
            { condition: !termsRef.current?.checked, message: "Please agree to the terms and conditions." },
        ];
    
        for (const { condition, message } of conditions) {
          if (condition) {
            setInputErrMsg(message);
            return;
          }
        }
        setIsSigningUp(true);

        try {
          const response = await ky.post(API_ENDPOINTS.HOST_SIGNUP, {
            json: formData,
          }).json();
          // Code after signup successful
          localStorage.setItem('signupusername', formData.userName);
          router.push("/registration/otp?verify=host");

        //API failures
        } catch (error) {
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

        <form onSubmit={handleSignUp} className="-translate-y-8 bg-black border-2 border-zinc-500/20 rounded-lg w-96 h-max p-6 flex flex-col gap-2 justify-center relative">

            <div className="w-full relative text-3xl">
                <p>Join as a Host</p>
            </div>

            <div className="relative h-2 mb-0.5">
                {inputErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {inputErrMsg}</p> : null}
                {signUpErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {signUpErrMsg}</p> : null}
            </div>

            <div className="relative">
                <label htmlFor="userName" className="text-sm text-zinc-400">Username</label>
                <input
                    ref={userNameRef}
                    value={formData.userName}
                    id="userName"
                    onChange={(e) => setFormData(prevData => ({ ...prevData, userName: e.target.value }))}
                    className={`w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 
                        outline-none hover:ring-1  focus:ring-1 ring-gray-900 
                        ${isAvailable === null ? '' : isAvailable ? 'ring-1 ring-green-500' : 'ring-1 ring-red-500'}`}
                />        
            </div>

            <div className="relative">
                <label htmlFor="email" className="text-sm text-zinc-400">Email</label>
                <input 
                    value={formData.userMail}
                    id="email"
                    onChange={(e) => setFormData(prevData => ({ ...prevData, userMail: e.target.value }))}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />
            </div>

            <div className="relative">
                <label htmlFor="password" className="text-sm text-zinc-400">Password</label>
                <input type={isPassVisible ? "text" : "password"} 
                    id="password"
                    value={formData.passWord}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, passWord: e.target.value }))}
                    className="w-full p-1 rounded-lg font-mono bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"/>
                
                <button type="button" onClick={() => setPassVisible(!isPassVisible)} className="bg-zinc-900 absolute right-2 top-7 text-zinc-400" >{isPassVisible ? <FontAwesomeIcon icon={faEyeSlash}/> : <FontAwesomeIcon icon={faEye}/> }</button>   
                
                <div className="flex gap-1 w-full  my-1">
                    <div className={`${checkPasswordStrength(formData.passWord) >= 1 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(formData.passWord) >= 2 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(formData.passWord) >= 3 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
                    <div className={`${checkPasswordStrength(formData.passWord) >= 4 ? "bg-green-800" : "bg-zinc-800"} h-1 flex-1 rounded-full`}></div>
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
            
            <div className="relative">
                <label htmlFor="dob" className="text-sm text-zinc-400">Date of Birth</label>
                <div className="relative">
                    <div
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                    <FontAwesomeIcon icon={faCalendar} className="mr-2 text-zinc-400" />
                    {formData.dob ? format(formData.dob, "dd/MM/yyyy") : "Select date"}
                    </div>
                    {isDatePickerOpen && renderDatePicker()}
                </div>
            </div>
            <div>
                <label htmlFor="aadhaar" className="text-sm text-zinc-400">Aadhaar Number</label>
                <input
                    id="aadhaar"
                    name="aadhaar"
                    type="text"
                    value={formData.aadhaarId}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, aadhaarId: e.target.value }))}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                    maxLength={14}
                    placeholder="XXXX XXXX XXXX"
                />
            </div>
            <div>
                <label htmlFor="companyName" className="text-sm text-zinc-400">Company Name</label>
                <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, companyName: e.target.value }))}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                    required
                />
            </div>
            
            <div className="flex gap-1 text-xs text-zinc-400">
                <input
                    className="opacity-75"
                    id="isCompanyRegistered"
                    name="isCompanyRegistered"
                    type="checkbox"
                    onChange={(e) => setFormData(prevData => ({ ...prevData, isCompanyRegistered: e.target.checked }))}
                />
                <label htmlFor="isCompanyRegistered" className="text-xs text-zinc-400">
                    Is company registered?
                </label>
            </div>

            <div>
                <label htmlFor="companyEmail" className="text-sm text-zinc-400">Company Email (if any)</label>
                <input
                    id="companyEmail"
                    name="companyEmail"
                    type="email"
                    value={formData.companyEmail}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, companyEmail: e.target.value }))}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />
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
            </div>

            {/* <div className="mt-2">
                <p className="w-full text-right text-sm text-zinc-400">Already have an account? <Link href='/login' className="text-zinc-300 underline">Login</Link></p>
            </div> */}
        </form>
    </div>
    )
}