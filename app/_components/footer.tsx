import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter, faInstagram, faLinkedin } from "@fortawesome/free-brands-svg-icons"

export default function Footer(){
    return(
        <footer className="mt-8 md:mt-16 bg-pure p-2 md:p-4 pt-6 relative z-40 bottom-0 left-0 w-full">
        <div className="flex flex-col gap-4 md:gap-4 mb-4 sm:flex-row justify-between mx-4 md:mx-16">
            <div className="flex flex-col md:w-[800px] items-center">
            <h2 className="text-lg font-bold w-full">About Us</h2>
            <p className="text-sm md:text-base md:mt-2">Welcome to Eventr, where we believe every event is an opportunity for connection! 
                Our mission is to foster the largest experience community, merging ticketing with a social media platform. 
                With Eventr, there are no more awkward introductions—Gen Z and millennials can connect before events for unforgettable 
                experiences. Join us as we transform the event landscape in India—where every ticket tells a story!</p>
            </div>
            <div className="flex flex-col w-80">
                <h2 className="text-lg font-bold">Contact Us</h2>
                <p className="text-sm md:text-base md:mt-2">JP Nagar 8th Phase, Bengaluru</p>
                <p className="text-sm md:text-base">Phone: +91 6363345104 </p>
                <p className="text-sm md:text-base">Hello.eventr@gmail.com</p>
                <div className="hidden lg:hidden">
                    <h2 className="text-lg font-bold mt-4">Important Links</h2>
                    <div className="md:mt-2 flex w-full gap-8">
                        <p className="text-sm w-12 md:text-base font-sans"><Link href="/">Home</Link></p>
                        <p className="text-sm md:text-base font-sans"><Link href="/myprofile">My Profile</Link></p>
                    </div>
                    <div className="flex w-full gap-8">
                        <p className="text-sm w-12 md:text-base font-sans"><Link href="/login">Login</Link></p>
                        <p className="text-sm md:text-base font-sans"><Link href="/signup">Sign Up</Link></p>
                    </div>
                </div>
            </div>
            <div className="hidden flex-col w-64">
                <h2 className="text-lg font-bold">Important Links</h2>
                <div className="md:mt-2 flex w-full gap-8">
                    <p className="text-sm w-12 md:text-base font-sans"><Link href="/">Home</Link></p>
                    <p className="text-sm md:text-base font-sans"><Link href="/myprofile">My Profile</Link></p>
                </div>
                <div className="md:mt-2 flex w-full gap-8">
                    <p className="text-sm w-12 md:text-base font-sans"><Link href="/login">Login</Link></p>
                    <p className="text-sm md:text-base font-sans"><Link href="/signup">Sign Up</Link></p>
                </div>
            </div>
            </div>
            <div className="flex text-gray items-center gap-4 justify-center md:justify-end mb-16 md:mb-0">
                <p className="text-sm text-center">© 2024 EventR. All rights reserved.</p>
                <Link href="https://www.instagram.com/eventrco.in?igsh=MTVvZDhiZGppaHUwZw=="><FontAwesomeIcon icon={faInstagram}/></Link>
                <Link href="/"><FontAwesomeIcon icon={faLinkedin}/></Link>
            </div>
        </footer>
    )
}