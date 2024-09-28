'use client'
import { useRef } from "react";
import EventCard from "./event-card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";

type ScrollDirection = "left" | "right";

export default function Trending() {
  const scrollRef = useRef<HTMLDivElement>(null);

  //Make smooth scroll animation
  const handleScroll = (direction: ScrollDirection) => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.125;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  //Replace with the event data from the API
  const items = [1, 2, 3, 4, 5, 6, 7, 8];
  const city = "Bengaluru";
  type ScrollButtonProps = {
    direction: ScrollDirection;
    onClick: (direction: ScrollDirection) => void;
  };
  
  //Scroll button component
  const ScrollButton = ({ direction, onClick }: ScrollButtonProps) => (
    <button 
      className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" 
      onClick={() => onClick(direction)}
      aria-label={`Scroll ${direction}`}
    >
      <FontAwesomeIcon icon={direction === "left" ? faChevronLeft : faChevronRight} />
    </button>
  );

  return (
    <section className="w-full">

      <header className="flex justify-between mb-2">
        <h1 className="flex items-baseline text-lg">
          <span>What's trending in</span>
          <strong className="font-bold text-2xl text-eventr-main">&nbsp;{city}</strong>
        </h1>

        <div className="text-xs lg:text-sm flex gap-1">
          <ScrollButton direction="left" onClick={handleScroll} />
          <ScrollButton direction="right" onClick={handleScroll} />
        </div>
      </header>
      
      {/* Event Cards Container */}
      <div 
        ref={scrollRef} 
        className="flex gap-2 p-3 lg:gap-5 hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth"
        aria-label={`Trending events in ${city}`}
      >
        {items.map((item) => (
          <EventCard key={item} eventId={`event-${item}`} />
        ))}
      </div>
    </section>
  );
}