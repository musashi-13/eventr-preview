"use client"
import { faPlusSquare } from "@fortawesome/free-regular-svg-icons";
import { faBars, faCaretRight, faCircleInfo, faGear, faHome, faLifeRing, faPowerOff, faTicket, faUser, faUserAlt, faUserTie, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

interface UserDetails {
    userName: string;
    profilePicUrl: string;
    fullName: string;
    userGender: string;
}


export default function NavBar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [isCollapsed, setIsCollapsed] = useState<boolean>(true);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const [userDetailsHome, setUserDetailsHome] = useState<UserDetails | null>(null);

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

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
          if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
            setIsOpen(false);
          }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }, [sidebarRef]);
    
    const genderOutput = userDetailsHome?.userGender === "male" ? "boy" : "girl";
    // <Image className="object-cover rounded-full border-2 border-gray-700 border-opacity-30" src={userDetailsHome.profilePicUrl ? userDetailsHome.profilePicUrl : `https://avatar.iran.liara.run/public/${genderOutput || "boy"}`} fill alt="profile" />                

    return (
        <nav className="flex items-center justify-between px-6 py-2 w-full h-16 overflow-x-hidden bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 z-40 border-b-2 border-gray-700/30">
            <h1 className="font-gothic text-3xl tracking-widest">EVENTR</h1>
            <div className="flex gap-4">
                <Link className="py-2 px-3 bg-black border rounded-md border-gray-700/50 lg:hover:border-gray-500/80 duration-200" href="/"><FontAwesomeIcon icon={faPlusSquare}/>&nbsp; Event</Link>
                <details className="active:scale-90 h-10 w-10 flex items-center bg-black rounded-full border border-gray-700/50 lg:hover:border-gray-500/80 duration-200">
                    <summary className="relative list-none w-full flex justify-center top-1/2 -translate-y-1/2"><FontAwesomeIcon icon={faUserAlt}/></summary>
                    <ul className="absolute text-center top-[56px] right-12 w-max p-2 rounded-md bg-black bg-gradient-to-tr from-zinc-800/30 to-slate-800/30 border border-gray-700/30">
                        <li className="m-1.5">My Profile</li>
                        <li className="m-1.5">My Tickets</li>
                        <li className="m-1.5">Saved Events</li>
                        <li className="m-1.5">Host Dashboard</li>
                        <li className="m-1.5">Help</li>
                        <li className="m-1.5 h-[1px] bg-gray-500"></li>
                        <li className="m-1.5 text-red-700"><FontAwesomeIcon icon={faPowerOff} size="sm"/>&nbsp;&nbsp;Log Out</li>
                    </ul>
                </details>
            </div>
        </nav>  
    );
}
