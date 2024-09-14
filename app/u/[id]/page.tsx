'use client'
import EventCard from "@/app/_components/event-card";
import { faMessage } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { QueryClient, QueryClientProvider } from 'react-query';

export default function Page() {
    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
        <div className="flex flex-col items-center">
            <div className="flex w-full lg:w-4/5">
                <div className="w-full flex justify-between items-center my-4 mx-4 md:mx-8 lg:mx-16">
                    <div className="flex gap-2 md:gap-4 items-center">
                        <div className="relative h-20 w-20 md:h-28 md:w-28 lg:h-36 lg:w-36 rounded-full">
                            <Image alt="profile" className="object-cover rounded-full" fill src="https://images.unsplash.com/photo-1654900168832-a59290b01d77?q=80&w=1587&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
                        </div>
                        <div className="flex flex-col">
                            <p className="text-xl">Jane</p>
                            <p className="-mt-1 text-gray-300">@janedoe11</p>
                            <div className="hidden lg:text-lg md:flex gap-4 mt-3 lg:mt-5">
                                <button className="flex gap-1">
                                    <p className="font-bold">1</p>
                                    <p>Following</p> 
                                </button>
                                <button className="flex gap-1">
                                    <p className="font-bold">334</p>
                                    <p>Followers</p>
                                </button>
                                <button className="flex gap-1">
                                    <p className="font-bold">4</p>
                                    <p>Events Attended</p>
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2 lg:text-lg">
                        <button className="hidden active:scale-90 duration-200 md:block bg-gray-700 bg-opacity-40 border border-gray-700 rounded-md px-4 py-1.5">Follow</button>
                        <button className="border active:scale-90 duration-200 border-gray-700 rounded-md px-4 py-1.5">Invite</button>
                        <button className="rounded-full active:scale-90 duration-200 h-10 w-10 bg-white text-black"><FontAwesomeIcon icon={faMessage}/></button>
                    </div>
                </div>
            </div>
            <div className="mt-2 w-full flex justify-around md:hidden">
                <div className="flex flex-col items-center">
                    <p className="text-lg">1</p>
                    <p className="text-sm">Following</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-lg">334</p>
                    <p className="text-sm">Followers</p>
                </div>
                <div className="flex flex-col items-center">
                    <p className="text-lg">4</p>
                    <p className="text-sm">Attended</p>
                </div>
            </div>
            <div className="flex flex-col mt-4 w-full md:w-4/5 lg:w-5/6">
                <h2 className="py-4 px-4 lg:px-0 lg:w-4/5 text-lg font-bold">Events Attended</h2>
                <div className="grid grid-cols-2 gap-2 md:grid-cols-3 lg:grid-cols-5 lg:gap-4 place-items-center mx-auto">
                    <EventCard eventId="1"/>
                    <EventCard eventId="1"/>
                    <EventCard eventId="1"/>
                    <EventCard eventId="1"/>
                    <EventCard eventId="1"/>
                </div>

            </div>
        </div>
        </QueryClientProvider>
    );
}
