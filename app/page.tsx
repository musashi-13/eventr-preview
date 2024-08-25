import Image from "next/image";
import NavBar from "./_components/Navbar";
import EventCard from "./_components/EventCard";
import LogIn from "./_components/Login";
import SignUp from "./_components/SignUp";

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
import OtpVerify from "./_components/OtpVerify";

config.autoAddCss = false


export default function Home() {
  return (
    <main className="flex gap-8 min-h-screen flex-col items-center justify-between">
      <NavBar pageId={1}/>
      <EventCard eventId="lorem ipsum"/>
      <SignUp/>
      <LogIn/>
      <OtpVerify CodeFor="verification"/>
      
    </main>
  );
}
