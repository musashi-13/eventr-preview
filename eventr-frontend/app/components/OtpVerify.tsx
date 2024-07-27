"use client"
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ky, { HTTPError, TimeoutError } from "ky";
import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent, ClipboardEvent } from "react";

export default function OtpVerify({ CodeFor }: { CodeFor: string }) {
    //codeFor: 
    // 1: verification - verify email address on sign up
    // 2: authentication - verify it is user while forgot password, changing password, phone number, making event public or deleting account.
    const userEmail = "karanhathwar@gmail.com";

    const [values, setValues] = useState<string[]>(Array(6).fill(""));
    const [verifyErrMsg, setVerifyErrMsg] = useState<string | null>(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [timeLeft, setTimeLeft] = useState(300);

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
            await ky.post("RESEND_OTP_ENDPOINT");
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
            const response = await ky.post("VERIFY_OTP_ENDPOINT", {
              json: otp,
            }).json();
            //handle otp success
        } 
        catch (error) {
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
                setVerifyErrMsg("Request timed out. Please try again.");
            } else {
                setVerifyErrMsg("An error occurred. Please try again.");
            }
        } finally {
            setIsVerifying(false); 
        };
    };

    return (
        <div className= "relative w-96 h-76 p-6 flex flex-col justify-center rounded-lg bg-zinc-950 bg-opacity-50 shadow-soft backdrop-blur-md border border-gray-500 border-opacity-10">
            <div className="w-full relative text-2xl">
                <p>{CodeFor === "verification" ? "Verify your Email" : "Verify that it's you"}</p>
            </div>
            <div className="text-sm text-gray-500 mt-1">
                <p>Enter the code sent to {userEmail}.</p>
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
    )
}
