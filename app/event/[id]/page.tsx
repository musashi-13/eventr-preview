import Image from "next/image";

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
            <div className="relative lg:fixed top-0 w-full aspect-[21/9]">
                <Image alt="Event thumbnail" className="object-cover aspect-[21/9]" priority fill src={"https://images.unsplash.com/photo-1566737236500-c8ac43014a67?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}/>
            </div>
            <div className="relative w-full lg:aspect-3"></div>
            <div className="relative w-full flex flex-col items-center justify-center">
                <div className="relative top-1/2 w-full lg:w-3/4 h-screen lg:rounded-xl bg-eventr-gray">
                </div>
            </div>
        </div>
    )
}