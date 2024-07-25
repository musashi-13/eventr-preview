import { useState } from "react";
import ky, { HTTPError, TimeoutError } from 'ky';

interface SignUpDetails{
    userName: string;
    userMail: string;
    passWord: string;
    firstName: string;
    lastName: string;
}

interface CheckUsernameResponse {
    available: boolean;
    message?: string;
}

export default function SignIn() {
    const [userName, setUserName] = useState<string>('');
    const [isAvailable, setIsAvailable] =  useState<boolean>(false);
    const [userSignUp, setUserSignUp] = useState<SignUpDetails | null>(null);
    const [errMessage, setErrMessage] = useState('')

    const checkUserName = async () => {
        try {
            const response = await ky.post('CHECK_USERNAME_API_ENDPOINT',
                {json: userName}).json<CheckUsernameResponse>();
            setIsAvailable(response.available)
        }
        catch (error) {
            setIsAvailable(false);
        }
    }
    const handleSignUp = async () => {        
        try{
            const response = await ky.post('SIGNIN_API_ENDPOINT',
                {json: userSignUp}).json();
            } 
        catch (error) {

            if (error instanceof HTTPError) {
                if (error.message == "weakPassword") {
                    setErrMessage('Bad request. Please check your input.');
                } else if (error.message == "emailExists") {
                    setErrMessage('Email already exists. Please try another.');
                } else if (error.message == "invalidCreds") {
                    setErrMessage('Unauthorized. Please check your credentials.');

                } else if (error.response.status === 500) {
                    setErrMessage('Server error. Please try again later.');
                }

            } else if (error instanceof TimeoutError) {
                setErrMessage('Request timed out. Please try again.');
            } else {
                setErrMessage('An unexpected error occurred. Please try again.');
            }
        }
    }


    return(
        <div className="w-96 h-[512px] rounded-lg bg-zinc-950">

        </div>
    )
}