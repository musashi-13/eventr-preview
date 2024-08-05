"use client"
import Image from "next/image";
import { useState, useEffect } from "react";
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

export default function EventCard({eventId}: EventId) {
    const [eventDetails, setEventDetails] = useState<EventCardDetails | null>(null);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    useEffect(() => {
        const fetchEventDetails = async () => {

            //Add the correct API here.
            const fakeApiResponse: EventCardDetails = await new Promise(resolve => setTimeout(() => resolve({
                eventName: "Dummy Event",
                eventDate: "10/10/24",
                eventStartPrice: 300,
                eventLocation: "Times Square, New York, United States of America ",
                eventThumbnail: "https://images.unsplash.com/photo-1472653431158-6364773b2a56?q=80&w=2069&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                eventCategory: "Concerts",
                eventStatus: "live"
            }), 100));

            setEventDetails(fakeApiResponse);
        };

        fetchEventDetails();
    }, [eventId]);

    //Make an API call to check and updated saved by user status.

    if (!eventDetails) {
        return <div className="w-64 h-72 flex items-center justify-center rounded-lg border border-gray-500 border-opacity-10">
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
        </div>;
    } else if (eventDetails.eventStatus === "live") {
        return(
            <div className="w-64 h-72 rounded-lg border border-gray-500 border-opacity-10">
                <div className="relative w-inherit h-48 rounded-t-lg">
                    <Image fill priority className="rounded-t-lg object-cover" alt={eventDetails.eventName} src={eventDetails.eventThumbnail}/>
                    <div className="absolute flex flex-col items-center gap-1.5 px-1 py-1.5 bg-gray-700 bg-opacity-70 right-0 rounded-bl-lg rounded-tr-lg">
                        <button onClick={() => setIsSaved(!isSaved)}>
                            {isSaved ? <FontAwesomeIcon icon={faSolidBookmark} className="relative text-white opacity-60 hover:opacity-100 duration-200 filter"/>
                            : <FontAwesomeIcon icon={faRegularBookmark} className="relative text-white opacity-60 hover:opacity-100 duration-200 filter"/>}
                        </button>
                        <button><FontAwesomeIcon icon={faShareFromSquare} className="relative text-white -right-0.5 opacity-60 hover:opacity-100 duration-200 filter"/></button>
                    </div>
                </div>
                <div className="relative items-start w-inherit h-24 p-2 bg-gray-700 bg-opacity-10 rounded-b-lg">
                    <div className="flex gap-2">
                        <div className="relative top-1 px-1 bg-gray-500 rounded-md bg-opacity-30">
                            <p className="text-xs font-bold relative top-1">JUL</p>
                            <p className="text-xl text-red-500 font-bold text-center">31</p>
                        </div>
                        <div>
                            <h1 className="text-lg w-[200px] truncate-text">{eventDetails.eventName}</h1>
                            <p className="text-xs w-[200px] truncate-text">{eventDetails.eventLocation}</p>
                        </div>
                    </div>
                    {/* ₹  $*/}
                    <div className="flex justify-between w-inherit mt-3">
                        <p className="text-xs text-gray-400">{eventDetails.eventCategory}</p>
                        {eventDetails.eventStartPrice ? <p className="text-xs">From ₹{eventDetails.eventStartPrice}</p>
                        : <p className="text-xs">Free</p>}
                    </div>
                </div>
                
            </div>
        )
    } 
    else {
        null;
    }
}