import Link from "next/link"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTwitter, faInstagram } from "@fortawesome/free-brands-svg-icons"

export default function Footer(){
    return(
        <footer className="mt-8 md:mt-16 bg-pure p-2 md:p-4 pt-6 relative bottom-0 left-0 w-full">
        <div className="flex flex-col gap-4 md:gap-0 sm:flex-row justify-between mx-4 md:mx-16">
            <div className="flex flex-col w-80 items-center">
            <h2 className="text-lg font-bold w-full">About Us</h2>
            <p className="text-sm md:text-base md:mt-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
            <div className="flex flex-col w-80">
            <h2 className="text-lg font-bold">Contact Us</h2>
            <p className="text-sm md:text-base md:mt-2">Address: 123, Bakers Street</p>
            <p className="text-sm md:text-base">Phone: +1 234 567 890</p>
            <p className="text-sm md:text-base">contact@example.com</p>
            </div>
            <div className="hidden lg:flex flex-col w-64">
                <h2 className="text-lg font-bold">Important Links</h2>
                <p className="text-sm md:text-base font-sans md:mt-2"><Link href="/">Home</Link></p>
                <p className="text-sm md:text-base font-sans"><Link href="/myprofile">My Profile</Link></p>
                <p className="text-sm md:text-base font-sans"><Link href="/login">Login</Link></p>
                <p className="text-sm md:text-base font-sans"><Link href="/signup">Sign Up</Link></p>
            </div>
            <div className="flex flex-col items-center border-y-2 md:border-0 border-gray-md py-2 sm:w-full md:w-1/4">
            <h2 className="text-lg font-bold text-center">Newsletter</h2>
            <p className="text-sm md:text-base mt-2 text-center">Subscribe to our newsletter for updates.</p>
            <form className="my-2 flex">
                <input type="email" placeholder="Enter your email" className="border border-gray-400 rounded-lg px-2 py-1 text-sm md:text-base" />
                <button disabled type="submit" className="bg-gray-dark text-white rounded-lg px-4 py-1 ml-2 text-sm md:text-base">Subscribe</button>
            </form>
            </div>
            </div>
            <div className="hidden lg:flex text-gray items-center justify-around md:gap-4 md:justify-end mb-16 md:mb-0">
                <p className="text-sm text-center">© 2024 EventR. All rights reserved.</p>
                <Link href="https://www.instagram.com/eventrco.in?igsh=MTVvZDhiZGppaHUwZw=="><FontAwesomeIcon icon={faInstagram}/></Link>
                <Link href="/"><FontAwesomeIcon icon={faTwitter}/></Link>
            </div>
        </footer>
    )
}