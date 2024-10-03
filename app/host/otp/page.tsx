"use client"
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ky, { HTTPError, TimeoutError } from "ky";
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";
import { useRouter } from "next/navigation";
import { API_ENDPOINTS } from "@/server/endpoints";
import { useSearchParams } from "next/navigation";
import secureLocalStorage from "react-secure-storage";



export default function OtpVerify() {
    //codeFor: 
    // 1: verification - verify email address on sign up
    // 2: authentication - verify it is user while forgot password, changing password, phone number, making event public or deleting account.

    const [values, setValues] = useState<string[]>(Array(6).fill(""));
    const [verifyErrMsg, setVerifyErrMsg] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const params = useSearchParams();
    const type = params.get('verify');
    const host = params.get('host');
    const router = useRouter();
    useEffect(() => {
        // Retrieve username from local storage

        const storedEmail = secureLocalStorage.getItem('hostEmail');
        const storedUsername = secureLocalStorage.getItem('username');

        if (storedEmail && storedUsername) {
            if (typeof storedEmail === 'string'){
                setEmail(storedEmail);
            if (typeof storedUsername === 'string') {
                setUsername(storedUsername);
            }
            } else {
                //raise error later
            }
        }
        secureLocalStorage.removeItem('email');
        secureLocalStorage.removeItem('username');

    }, []);
    const inputsRef = useRef<HTMLInputElement[]>([]);

    //These three are for handling the OTP input, pasting etc.
    const handleInputChange = (index: number) => (e: ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setValues(prevValues => {
        const newValues = [...prevValues];
        newValues[index] = newValue;
        return newValues;
        });

        if (/^\d$/.test(newValue) && index < inputsRef.current.length - 1) {
        inputsRef.current[index + 1].focus();
        }
    };

    const handleKeyDown = (index: number) => (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && index > 0 && !values[index]) {
        inputsRef.current[index - 1].focus();
        }
    };

    const handlePaste = (index: number) => (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData("text");
        if (/^\d{6}$/.test(pasteData)) {
          const newValues = pasteData.split("");
          setValues(newValues);
          inputsRef.current.forEach((input, i) => {
            if (input) {
              input.value = newValues[i];
            }
          });
          inputsRef.current[5].focus();
        }
      };

    //timer for how long the OTP is valid
    useEffect(() => {
    const interval = setInterval(() => {
        setTimeLeft(prevTime => {
        if (prevTime <= 1) {
            clearInterval(interval);
            return 0;
        }
        return prevTime - 1;
        });
    }, 1000);
    return () => clearInterval(interval);
    }, []);

    const handleResend = async () => {
        try {
            const response = await ky.post(API_ENDPOINTS.HOST_OTP_RESEND, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${secureLocalStorage.getItem('accessKey')}`
                },
                json: { username: username, email: email }
            });
            setTimeLeft(300);
            setVerifyErrMsg("OTP resent successfully.");
            setValues(Array(6).fill(""));
            inputsRef.current[0].focus();
        } catch (error) {
            setVerifyErrMsg("Failed to resend. Please try again.");
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const otp = values.join("");
        if (!/^\d{6}$/.test(otp)) {
            setVerifyErrMsg("Please enter a valid OTP.");
            return;
        }
        setIsVerifying(true);
        try {
            const response = await ky.post(API_ENDPOINTS.HOST_OTP_VERIFY, {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${secureLocalStorage.getItem('accessKey')}`
                },
                json: { username: username, companyMail: email, otp: otp }
            }).json();
            router.push(`/register/success?host=true`);
        } 
        catch (error) {
            console.log(error)
            if (error instanceof HTTPError) {
                if (error.response.status === 500) {
                setVerifyErrMsg("Server error. Please try again later.");
                }
            const errorData = await error.response.json();
            switch (errorData.message) {
                case "OTP_EXPIRED":
                    setVerifyErrMsg("OTP expired. Please request a new one.");
                case "OTP_INCORRECT":
                    setVerifyErrMsg("Incorrect OTP. Please try again.");
                default:
                    setVerifyErrMsg("An error occurred. Please try again.");
                }
            } else if (error instanceof TimeoutError) {
                //if 408 then delete the tokens and push user to signup
                setVerifyErrMsg("Request timed out. Please try again.");
            } else {
                setVerifyErrMsg("An error occurred. Please try again.");
            }
        } finally {
            setIsVerifying(false); 
        };
    };

    return (
        <div className="flex h-screen w-full items-center justify-center">
        <div className= "relative w-96 h-76 p-6 -translate-y-16 flex flex-col justify-center rounded-lg bg-black bg-opacity-50 border-2 border-zinc-500/20 border-opacity-10">
            <div className="w-full relative text-2xl">
                <p>Verify to become a Host</p>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                <p>Enter the code sent to {email}.</p>
                <p>OTP expires in {timeLeft}s</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col">
                <div className="flex gap-4 justify-center mt-6">
                {values.map((value, index) => (
                    <input
                    key={index}
                    type="text"
                    className="w-10 text-lg text-center p-2 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 outline-none hover:ring-1 focus:ring-1 ring-gray-900"
                    maxLength={1}
                    value={value}
                    onChange={handleInputChange(index)}
                    onKeyDown={handleKeyDown(index)}
                    onPaste={handlePaste(index)}
                    ref={ref => {
                        inputsRef.current[index] = ref as HTMLInputElement;
                    }}
                    />
                ))}
                </div>
                <button disabled={isVerifying} type="submit" className="w-full h-10 mt-6 flex items-center justify-center gap-2 text-zinc-300 p-2 rounded-lg bg-zinc-900 border border-gray-500 border-opacity-10 hover:ring-1 focus:ring-1 ring-gray-900">{isVerifying ? <FontAwesomeIcon icon={faSpinner} spin/> : "Verify"}</button>
                <p className={`h-5 mt-1 ${verifyErrMsg === "OTP resent successfully." ? "text-gray-500" : "text-red-700"}`}>{verifyErrMsg ? verifyErrMsg : null}</p>
            </form>
            <div className="flex justify-end mt-2">
                <p className="text-sm text-gray-500">Didn"t recieve code? <button onClick={handleResend} className="text-gray-300 underline">Resend</button></p>
            </div>
        </div>
        </div>
    )
}