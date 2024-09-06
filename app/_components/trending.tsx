'use client'
import { useRef } from "react";
import EventCard from "./event-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

export default function Trending() {
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: string) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.125;
      (scrollRef.current as HTMLElement).scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };
  const items = [1, 2, 3, 4, 5, 6, 7, 8];

  return (
    <div className="w-full">
      <div className="flex justify-between mb-2">
        <h1 className="flex items-baseline text-lg"><p>What's trending in</p><p className="font-bold text-2xl text-eventr-main">&nbsp;Bengaluru</p></h1>
        <div className="text-xs lg:text-sm flex gap-1">
          <button className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" onClick={() => handleScroll("left")}><FontAwesomeIcon icon={faChevronLeft}/></button>
          <button className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" onClick={() => handleScroll("right")}><FontAwesomeIcon icon={faChevronRight}/></button>
        </div>
      </div>
      <div ref={scrollRef} className="flex gap-2 p-3 lg:gap-6 hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth">
          {items.map((item) => (
              <EventCard key={item} eventId="lol"/>
          ))}
      </div>
    </div>
  );
}
