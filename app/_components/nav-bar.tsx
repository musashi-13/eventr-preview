"use client"
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
interface UserDetails {
    userName: string;
    profilePicUrl: string;
    fullName: string;
    userGender: string;
}


export default function NavBar() {
    const [userDetailsHome, setUserDetailsHome] = useState<UserDetails | null>(null);
    const pathname = usePathname();
    
    useEffect(() => {
        const fetchEventDetailsHome = async () => {

            //Add the correct API here.
            const fakeApiResponse: UserDetails = await new Promise(resolve => setTimeout(() => resolve({
                userName: "akira12345678",
                profilePicUrl: "",
                fullName: "John Doe",
                userGender: "male"
            }), 100));

            setUserDetailsHome(fakeApiResponse);
        };

        fetchEventDetailsHome();
    }, []);
    
    const genderOutput = userDetailsHome?.userGender === "male" ? "boy" : "girl";
    // <Image className="object-cover rounded-full border-2 border-gray-700 border-opacity-30" src={userDetailsHome.profilePicUrl ? userDetailsHome.profilePicUrl : `https://avatar.iran.liara.run/public/${genderOutput || "boy"}`} fill alt="profile" />                

    return (
        <nav className="flex relative items-center justify-between px-3 md:px-6 py-2 w-full h-16 overflow-x-hidden bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 z-50 border-b-2 border-gray-700/30">
            <div className="flex gap-4 items-center">
                <Link href={'/'} className="font-gothic text-3xl tracking-widest mr-2">EVENTR</Link>
                {/* <Link href={'/home'} className="font-gothic text-3xl tracking-widest mr-2">EVENTR</Link> */}
                {/* Only temporary and eventr logo should redirect to /home as shown above*/}
                {/* {pathname === "/" || pathname === "/signup" ? */}
                <Link href="/#team-section" className="hidden font-bold md:block opacity-75 hover:opacity-100 duration-150">Our Team</Link> :
                {/* <Link href={'/events?cat=all'} className="hidden font-bold md:block opacity-75 hover:opacity-100 duration-150">Categories</Link> */}
                {/* } */}
                <p className="hidden md:block opacity-75 font-bold hover:opacity-100 duration-150">About Us</p>
            </div>
            <div className="flex gap-2 md:gap-4">
            <Link className="py-1.5 active:scale-90 font-bold px-3 bg-black border rounded-md border-gray-700/50 lg:hover:border-gray-500/80 duration-200" href="/signup">Sign Up</Link>
            <Link className="py-1.5 active:scale-90 font-bold px-3 bg-white text-black border rounded-md border-gray-700/50 lg:hover:border-gray-500/80 duration-200" href='/signup?host=true'>Become a Host</Link>
            </div>
        </nav>  
    );
}
