"use client"
import { useState, useEffect, useRef } from "react";
import ky, { HTTPError, TimeoutError } from 'ky';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faCircleNotch, faCalendar, faWarning, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import secureLocalStorage from "react-secure-storage";
import { format } from "date-fns";

import { API_ENDPOINTS } from "@/server/endpoints";

interface HostData{
    username: string;
    dob: Date | null;
    firstName: string;
    middleName: string,
    lastName: string;
    phoneNumber: string;
    companyName: string;
    isCompanyRegistered: boolean;
    companyEmail?: string;
    hostedStatus: string;
}


export default function SignUp() {

    const [isDatePickerOpen, setIsDatePickerOpen] = useState<boolean>(false);
    const [formData, setFormData] = useState<HostData>({
        username: (secureLocalStorage.getItem('username') as string) || "",
        firstName: "",
        middleName: "",
        lastName: "",
        phoneNumber: "",
        dob: null,
        companyName: "",
        isCompanyRegistered: false,
        companyEmail: "",
        hostedStatus: "UnderFive",
    });
    const [tempDate, setTempDate] = useState<{ year: number | null, month: number | null, day: number | null }>({
        year: null,
        month: null,
        day: null,
    });
    const [inputErrMsg, setInputErrMsg] = useState<string | null>(null); 
    const [signUpErrMsg, setSignUpErrMsg] = useState<string>('')
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false);
    const [fullName, setFullName] = useState<string>("");
    const router = useRouter();
    const nameRef = useRef<HTMLInputElement>(null);
    const datePickerRef = useRef<HTMLDivElement>(null);

    //Focus on username field when component loads
    useEffect(() => {
        if (nameRef.current) {
            nameRef.current.focus();
        }
    }, []);


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
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setInputErrMsg(null);
        setSignUpErrMsg("");
    
        //Conditions to check if inputs are correct
        const conditions = [
            { condition: !fullName || !formData.phoneNumber || !formData.companyName, message: "Fill all the fields."},
            { condition: !/^[6-9]\d{9}$/.test(formData.phoneNumber), message: "Check your phone number." },
            { condition: fullName.trim().split(/\s+/).length > 3, message: "First, Middle and Last Name only" },
            // { condition: !/^[a-zA-Z]+$/.test(fullName), message: "Full name should have alphabets only."},
        ];
    
        for (const { condition, message } of conditions) {
          if (condition) {
            setInputErrMsg(message);
            return;
          }
        }
        const nameParts = fullName.trim().split(/\s+/);
        setFormData(prevData => ({
            ...prevData,
            firstName: nameParts[0],
            middleName: nameParts.length === 3 ? nameParts[1] : "",
            lastName: nameParts.length > 1 ? nameParts[nameParts.length - 1] : ""
        }));

        setIsSigningUp(true);
        console.log(formData);
        try {
          const response = await ky.post(API_ENDPOINTS.HOST_SIGNUP,
            { 
            headers: { 
                "Content-Type": "application/json",
                'Authorization': `Bearer ${secureLocalStorage.getItem('token')}` },
            
            json: formData,
          }).json();
          // Code after signup successful
          //   localStorage.setItem('signupusername', formData.userName);
          router.push("/register/success");
          secureLocalStorage.removeItem('accessKey');
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

        <form onSubmit={handleSubmit} className="-translate-y-8 bg-black border-2 border-zinc-500/20 rounded-lg w-96 h-max p-6 flex flex-col gap-2 justify-center relative">

            <div className="w-full relative text-3xl">
                <p>Complete Your Host Profile</p>
            </div>

            <div className="relative h-2 mb-0.5">
                {inputErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {inputErrMsg}</p> : null}
                {signUpErrMsg ? <p className="text-sm text-red-600"><FontAwesomeIcon icon={faWarning}/> {signUpErrMsg}</p> : null}
            </div>
            <div>
                <label htmlFor="fullName" className="text-sm text-zinc-400">Full Name</label>
                <input
                    id="fullName"
                    name="fullName"
                    ref = {nameRef}
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />
            </div>
            <div className="relative">
                <label htmlFor="phoneNumber" className="text-sm text-zinc-400">Phone Number</label>
                <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    inputMode="numeric"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, phoneNumber: e.target.value }))}
                    className="w-full p-1 pl-8 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />
                <span className="absolute left-1.5 top-1/2 text-zinc-400">+91</span>
            </div>

            <div className="relative">
                <label htmlFor="dob" className="text-sm text-zinc-400">Date of Birth</label>
                <div className="relative">
                    <div
                    className="w-full p-1 rounded-lg flex items-center bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                    onClick={() => setIsDatePickerOpen(!isDatePickerOpen)}
                    >
                    <FontAwesomeIcon icon={faCalendar} className="mr-2 text-zinc-400" />
                    {formData.dob ? <p>{format(formData.dob, "dd/MM/yyyy")}</p> : <p className="text-zinc-400">Select date</p>}
                    </div>
                    {isDatePickerOpen && renderDatePicker()}
                </div>
            </div>
            <div className="relative">
                <label htmlFor="companyName" className="text-sm text-zinc-400">Company Name <abbr title="This will be the name displayed with your events."><FontAwesomeIcon className="text-xs ml-0.5" icon={faInfoCircle}/></abbr></label>
                <input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, companyName: e.target.value }))}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                />
            </div>
            
            <div className="relative flex gap-1 text-xs text-zinc-400">
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
            <div>
                <label htmlFor="eventsHosted" className="text-sm text-zinc-400">Events hosted to date</label>
                <select
                    id="eventsHosted"
                    name="eventsHosted"
                    value={formData.hostedStatus || "UnderFive"}
                    onChange={(e) => setFormData(prevData => ({ ...prevData, eventsHosted: e.target.value }))}
                    className="w-full p-1 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                >
                    <option value="UnderFive">&lt; 5</option>
                    <option value="UnderTen">5 - 10</option>
                    <option value="UnderTwenty">10 - 20</option>
                    <option value="UnderFifty">20 - 50</option>
                    <option value="AroundHundred">50+</option>
                </select>
            </div>
            <div className="flex flex-col items-center mt-4">

                <button type="submit"
                    className="w-full p-2 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900"
                    disabled={isSigningUp}>
                {isSigningUp ? <p><FontAwesomeIcon icon={faCircleNotch} spin /></p> : <p>Become a Host!</p>}</button>
            </div>
        </form>
    </div>
    )
}