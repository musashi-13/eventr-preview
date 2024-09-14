"use client"
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import { useQuery } from 'react-query';
import { faShareFromSquare } from "@fortawesome/free-regular-svg-icons"; 
import { faBookmark as faRegularBookmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark as faSolidBookmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
interface EventId {
   eventId: string;
}

interface EventCardDetails {
    eventName: string;
    eventDate: string;
    eventStartPrice: number;
    eventStatus: string;
    eventLocation: string;
    eventThumbnail: string;
    eventCategory: string;
}
const fetchEventDetails = async (): Promise<EventCardDetails> => {
    // Simulate an API call
    const fakeApiResponse: EventCardDetails = await new Promise(resolve => setTimeout(() => resolve({
        eventName: "Dummy Event 123 TESTING",
        eventDate: "10/10/24",
        eventStartPrice: 300,
        eventLocation: "Times Square, New York, United States of America ",
        eventThumbnail: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        eventCategory: "Concerts",
        eventStatus: "live"
    }), 100));

    return fakeApiResponse;
};
// const fetchEventDetails = async (): Promise<EventCardDetails> => {
//     const response = await ky.get('/api/event-details').json<EventCardDetails>();
//     return response;
// };

export default function EventCard({eventId}: EventId) {
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const { data: eventDetails, status } = useQuery<EventCardDetails>('eventDetails', fetchEventDetails);

    if (status === 'loading') {
        return <div className="flex items-center justify-center flex-shrink-0 snap-start w-40 h-52 md:w-48 md:h-56 lg:w-56 lg:h-[308px] rounded-lg lg:border border-gray-500/20 lg:hover:border-gray-500/80 duration-200">
                    <div className="dot-spinner opacity-40">
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                        <div className="dot-spinner__dot"></div>
                    </div>
                </div>
    }   

    if (status === 'error') {
        return null;
    }
    //Make an API call to check and updated saved by user status.
    if (eventDetails?.eventStatus === "live") {
        return(
            <div className="relative snap-start w-44 h-56 md:w-48 md:h-56 lg:w-56 lg:h-[316px] rounded-lg border p-0.5 lg:p-0 border-gray-700/50 lg:hover:border-gray-500/80 duration-200">
                <div className="absolute z-50 top-0 right-0 flex flex-col items-center w-fit h-fit gap-1.5 px-1 py-1.5 bg-gray-700 bg-opacity-20 hover:bg-opacity-60 duration-300 rounded-bl-md lg:rounded-bl-lg rounded-tr-sm lg:rounded-tr-lg">
                    <button onClick={() => setIsSaved(!isSaved)} className="text-md ">
                        {isSaved ? <FontAwesomeIcon icon={faSolidBookmark} className="relative text-white hover:opacity-100 duration-200 filter"/>
                        : <FontAwesomeIcon icon={faRegularBookmark} className="relative text-white opacity-60 hover:opacity-100 duration-200 filter"/>}
                    </button>
                    <button className="hidden lg:block text-md "><FontAwesomeIcon icon={faShareFromSquare} className="relative text-white -right-0.5 opacity-60 hover:opacity-100 duration-200 filter"/></button>
                </div>
                <div className="relative w-full aspect-1 rounded-t-lg">
                    <Image fill priority className="rounded-md lg:rounded-b-none lg:rounded-t-lg object-cover" alt={eventDetails.eventName} src={eventDetails.eventThumbnail}/>
                </div>
                <div className="relative h-fit lg:h-24 items-start w-inherit py-1 md:py-0.5 lg:p-2 bg-transparent lg:bg-gradient-to-tr from-zinc-800/50 to-slate-800/50 rounded-b-md lg:rounded-b-lg">
                    <div className="flex gap-1 lg:gap-2">
                        <div className="relative top-0.5 lg:top-1 px-1 bg-gray-500 rounded-md bg-opacity-30">
                            <p className="text-xs font-bold relative top-1">JUL</p>
                            <p className="text-md lg:text-xl text-eventr-main font-bold text-center">31</p>
                        </div>
                        <div>
                            <h1 className="text-sm md:text-md lg:text-lg w-36 md:w-36 lg:w-40 lg:truncate">{eventDetails.eventName}</h1>
                            <p className="text-xs w-40 hidden lg:block truncate-text">{eventDetails.eventLocation}</p>
                        </div>
                    </div>
                    <div className="hidden lg:flex text-xs md:text-sm lg:h-fit justify-between w-inherit mt-1.5 px-0.5 lg:mt-3 lg:mb-2">
                        <p className="text-gray-400">{eventDetails.eventCategory}</p>
                        {eventDetails.eventStartPrice ? <p>From ₹{eventDetails.eventStartPrice}</p>
                        : <p>Free</p>}
                    </div>
                </div>
            </div>
        )
    } 
    else {
        null;
    }
}