'use client'
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
export default function Categories(){
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
                <h1>Browse Categories</h1>
                <div className="text-xs lg:text-sm flex gap-1">
                    <button className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" onClick={() => handleScroll("left")}><FontAwesomeIcon icon={faChevronLeft}/></button>
                    <button className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" onClick={() => handleScroll("right")}><FontAwesomeIcon icon={faChevronRight}/></button>
                </div>
            </div>
            <div ref={scrollRef} className="flex gap-4 hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth">
                {items.map((item) => (
                    <Link href={'/events/all'} key={item} className="snap-start flex-shrink-0 w-36 h-36 md:w-48 md:h-48 lg:w-64 lg:h-64 bg-eventr-gray">
                        <div className="w-full flex">
                            <div className="flex-grow aspect-1 bg-zinc-800"></div>
                            <p className="w-8 text-center text-xs md:text-sm lg:text-md" style={{ writingMode: 'vertical-rl', textOrientation: 'sideways' }}>IN 2 DAYS!</p>
                        </div>
                        {item}  
                    </Link>
                ))}
            </div>
      </div>
    )
}

