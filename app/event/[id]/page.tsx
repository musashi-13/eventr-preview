import Image from "next/image";
import { EventData, ArtistData } from "@/app/_components/dummydata";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { faLocationDot, faUsers, faWarning } from "@fortawesome/free-solid-svg-icons";
import { format } from 'date-fns';

// interface EventCardDetails {
//     eventName: string;
//     eventDate: string;
//     eventStartPrice: number;
//     eventStatus: string;
//     eventLocation: string;
//     eventThumbnail: string;
//     eventCategory: string;
// }
// const fetchEventDetails = async (): Promise<EventCardDetails> => {
//     // Simulate an API call
//     const fakeApiResponse: EventCardDetails = await new Promise(resolve => setTimeout(() => resolve({
//         eventName: "Dummy Event 123 TESTING",
//         eventDate: "10/10/24",
//         eventStartPrice: 300,
//         eventLocation: "Times Square, New York, United States of America ",
//         eventThumbnail: "https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
//         eventCategory: "Concerts",
//         eventStatus: "live"
//     }), 100));

//     return fakeApiResponse;
// };
export default function Page(){
    const formattedDate = format(new Date(EventData.StartingTime),  "do MMMM h a 'onwards'" );
    // if (status === 'loading') {
    // return      <div className="flex items-center justify-center flex-shrink-0 snap-start w-40 h-52 md:w-48 md:h-56 lg:w-56 lg:h-[308px] rounded-lg lg:border border-gray-500/20 lg:hover:border-gray-500/80 duration-200">
    //                 <div className="dot-spinner opacity-40">
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                     <div className="dot-spinner__dot"></div>
    //                 </div>
    //             </div>
    // }   

    // if (status === 'error') {
    //     return null;
    // }
    return(
        <div className="relative z-20">
            <div className="relative lg:fixed -z-40 top-16  w-full aspect-[21/9]">
                <Image alt="Event thumbnail" className="object-cover aspect-[21/9]" priority fill src={"https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
            </div>
            <div className="relative w-full lg:aspect-3"></div>
            <div className="relative w-full flex flex-col items-center justify-center">
                <div className="relative flex top-1/2 w-full lg:w-3/4 h-screen lg:rounded-xl bg-eventr-gray p-8">
                    <div className="flex flex-col w-3/4 gap-8">
                        <div className="flex flex-col text-sm">
                            <div className="flex items-baseline gap-2 mb-2">
                                <h1 className="text-4xl font-gothic tracking-wide">{EventData.EventName}</h1>
                                <h3>by Company</h3> 
                            </div>
                            <p><FontAwesomeIcon icon={faLocationDot}/> {EventData.Venue}</p>
                            <p className="mt-0.5"><FontAwesomeIcon icon={faCalendar}/> {formattedDate}</p>
                        </div>
                        <div className="flex items-center w-full justify-around text-sm">
                            <div className="flex items-center gap-4">
                                <FontAwesomeIcon icon={faClock} size="2xl"/>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold">Duration</h3>
                                    <p>{EventData.Duration}</p>
                                    <p>9AM to 10PM</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <FontAwesomeIcon icon={faUsers} size="2xl"/>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold">Audience</h3>
                                    <p>{EventData.TotalTickets}</p>
                                    <p>{EventData.AgeLimit}+</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <FontAwesomeIcon icon={faWarning} size="2xl"/>
                                <div className="flex flex-col">
                                    <h3 className="text-lg font-bold">Rules</h3>
                                    <p>No Entry without ID</p>
                                    <p>No Alcohol</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 my-6">
                            <p>{EventData.Description}</p>
                            <div className="flex gap-2">
                                {EventData.EventTags.map((tag) => (
                                    <span key={tag} className="bg-eventr-main rounded-md py-1 px-2">{tag}</span>
                                ))}
                            </div>
                        </div>
                        
                    </div>
                    <div>
                        <button className="bg-white text-black p-2 rounded-md">Book Tickets</button>
                        <div>Guest List</div>
                        <h2>Artists</h2>
                        <div className="w-full flex flex-wrap justify-center gap-6">
                            {ArtistData.Artists.map((artist) => (
                            <div key={artist.ArtistId} className="flex flex-col items-center">
                                <img 
                                src={artist.Image} 
                                alt={artist.Name} 
                                className="w-24 h-24 rounded-full object-cover"
                                />
                                <p className="font-semibold">{artist.Name}</p>
                                <p className="text-gray-500">{EventData.Artists.find(a => a.ArtistId === artist.ArtistId)?.Role}</p>
                            </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}