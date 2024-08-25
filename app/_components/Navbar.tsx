"use client"
import { faBars, faCaretLeft, faCaretRight, faCircleInfo, faGear, faHome, faLifeRing, faTicket, faUser, faUserTie, faX } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useState, useEffect, useRef } from "react";

interface UserDetails {
    userName: string;
    profilePicUrl: string;
    fullName: string;
    userGender: string;
}

interface NavBarProps { 
    pageId: number;
}

export default function NavBar({ pageId }: NavBarProps) {
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

    return (
        <nav className="relative w-full overflow-x-hidden">
            <div ref={sidebarRef} className={`fixed pb-6 top-0 right-0 h-full py-2 flex flex-col justify-between bg-zinc-950 sidebar-transition ${isOpen ? "sidebar-open" : "sidebar-closed"} ${isCollapsed ? "sidebar-collapsed px-1" : "sidebar-expanded px-2"}`}>
                <div className="flex flex-col gap-2 items-center">
                    <div className={`w-full flex mb-2 px-3 ${!isCollapsed ? "justify-end" : "justify-center"}`}>
                        <button className={`transform transition-transform duration-150 ${!isCollapsed ? "rotate-0" : "-rotate-180"}`} onClick={() => setIsCollapsed(!isCollapsed)}><FontAwesomeIcon icon={faCaretRight}/></button>
                    </div>
                    {userDetailsHome && (
                        <button className={`flex items-center ${isCollapsed ? "" : "w-36"} gap-2 hover:scale-102 duration-150 ${pageId === 7 ? "border-2 border-white" : "border border-gray-500"} border-opacity-30 rounded-lg p-1`}>
                            <div className="relative w-10 h-10">
                                <Image className="object-cover rounded-full border-2 border-gray-700 border-opacity-30" src={userDetailsHome.profilePicUrl ? userDetailsHome.profilePicUrl : `https://avatar.iran.liara.run/public/${genderOutput || "boy"}`} fill alt="profile" />                
                            </div>
                            {!isCollapsed ? <p className="w-20 text-start">My Profile</p> : null}
                        </button>
                    )}
                    <div className={`flex flex-col text-gray-400 mt-8 gap-5 ${!isCollapsed ? "w-28" : ""}`}>
                        <button className={`flex gap-2 items-start transition-transform hover:scale-105 ${pageId === 1 ? "text-white" : ""}`}><FontAwesomeIcon icon={faHome} className="w-5" size="lg"/>{isCollapsed ? null : "Home"}</button>
                        <button className={`flex gap-2 items-start transition-transform hover:scale-105 ${pageId === 2 ? "text-white" : ""}`}><FontAwesomeIcon icon={faTicket} className="w-5" size="lg"/>{isCollapsed ? null : "My Tickets"}</button>
                        <button className={`flex gap-2 items-start transition-transform hover:scale-105 ${pageId === 3 ? "text-white" : ""}`}><FontAwesomeIcon icon={faUserTie} className="w-5" size="lg"/>{isCollapsed ? null : "Be a Host"}</button>
                        <button className={`flex gap-2 items-start transition-transform hover:scale-105 ${pageId === 4 ? "text-white" : ""}`}><FontAwesomeIcon icon={faLifeRing} className="w-5" size="lg"/>{isCollapsed ? null : "Help"}</button>
                    </div>
                </div>
                <div className={`flex flex-col self-center ${!isCollapsed ? "w-28" : ""}`}>
                    <div className="flex flex-col gap-5 text-gray-400">
                        <button className={`flex gap-2 items-start transition-transform hover:scale-105 ${pageId === 5 ? "text-white" : ""}`}><FontAwesomeIcon icon={faCircleInfo} className="w-5" size="lg"/>{isCollapsed ? null : "About"}</button>
                        <button className={`flex gap-2 items-start transition-transform hover:scale-105 ${pageId === 6 ? "text-white" : ""}`}><FontAwesomeIcon icon={faGear} className="w-5" size="lg"/>{isCollapsed ? null : "Settings"}</button>
                    </div>
                </div>
            </div>
            <div className="flex justify-between px-2 py-2 w-full">
                <p>Logo</p>
                <div className="flex items-center gap-4 w-2/5 justify-end">
                    <button className="h-7 px-3 rounded-lg bg-yellow-500 text-black">Log In</button>
                    <button onClick={() => setIsOpen(!isOpen)} className="w-8 h-8 rounded-full border bg-zinc-950 border-gray-500 border-opacity-30"><FontAwesomeIcon icon={faBars} /></button>
                </div>
            </div>
        </nav>
    );
}
