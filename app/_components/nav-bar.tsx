"use client"
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
    const sidebarRef = useRef<HTMLDivElement>(null);
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
                <Link href={'/home'} className="font-gothic text-3xl tracking-widest mr-2">EVENTR</Link>
                {/* Only temporary */}
                {pathname === "/" || pathname ==="/host/signup" || pathname === "/signup" ?
                <Link href="/#team-section" className="hidden md:block opacity-60 hover:opacity-100 duration-150">Our Team</Link> :
                <Link href={'/events?cat=all'} className="hidden md:block opacity-60 hover:opacity-100 duration-150">Categories</Link>
                }
                <p className="hidden md:block opacity-60 hover:opacity-100 duration-150">About Us</p>
            </div>
            <div className="flex gap-2 md:gap-4">
            <Link className="py-1.5 active:scale-90 px-3 bg-black border rounded-md border-gray-700/50 lg:hover:border-gray-500/80 duration-200" href="/signup">Sign Up</Link>
            <Link className="py-1.5 active:scale-90 px-3 bg-white text-black border rounded-md border-gray-700/50 lg:hover:border-gray-500/80 duration-200" href="/host/signup">Become a Host</Link>
                {/* <Link className="py-2 active:scale-90 px-3 bg-black border rounded-md border-gray-700/50 lg:hover:border-gray-500/80 duration-200" href="/"><FontAwesomeIcon icon={faPlusSquare}/>&nbsp; Event</Link>
                <details className="active:scale-90 h-10 w-10 flex items-center bg-black rounded-full border border-gray-700/50 lg:hover:border-gray-500/80 duration-200">
                    <summary className="relative list-none w-full flex justify-center top-1/2 -translate-y-1/2"><FontAwesomeIcon icon={faUserAlt}/></summary>
                    <ul className="absolute text-white text-center top-[56px] right-12 w-max bg-black rounded-m  border border-gray-700/30">
                        <li className="m-1 py-1.5 px-2 opacity-70 rounded-md hover:bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 hover:opacity-100 duration-150">My Profile</li>
                        <li className="m-1 py-1.5 px-2 opacity-70 rounded-md hover:bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 hover:opacity-100 duration-150">My Tickets</li>
                        <li className="m-1 py-1.5 px-2 opacity-70 rounded-md hover:bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 hover:opacity-100 duration-150">Saved Events</li>
                        <li className="m-1 py-1.5 px-2 opacity-70 rounded-md hover:bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 hover:opacity-100 duration-150">Host Dashboard</li>
                        <li className="m-2 h-[1px] bg-gray-500"></li>
                        <li className="m-1 py-1 px-2 duration-150 rounded-md hover:bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 text-red-700">Log Out</li>
                    </ul>
                </details> */}
            </div>
        </nav>  
    );
}
