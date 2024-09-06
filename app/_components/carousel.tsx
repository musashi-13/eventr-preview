'use client'
import { faChevronCircleRight, faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { useRef } from "react";
const imageUrls = [
    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1505236858219-8359eb29e329?q=80&w=1862&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1506485777791-e120681573dd?q=80&w=1632&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1482575832494-771f74bf6857?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D "
];
export default function Carousel() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: string) => {
        if (scrollRef.current) {
          const scrollAmount = scrollRef.current.offsetWidth * 0.2;
          (scrollRef.current as HTMLElement).scrollBy({
            left: direction === "left" ? -scrollAmount : scrollAmount,
            behavior: "smooth",
          });
        }
      };
      const items = [1, 2, 3, 4, 5];
    
    return (
        <div className="relative w-full">
            <div ref={scrollRef} className="relative w-full flex rounded-lg lg:rounded-xl aspect-[21/9] md:aspect-[32/9] bg-eventr-gray hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth">
                {imageUrls.map((url, index) => (
                    <div key={index} className="flex-shrink-0 snap-start relative w-full aspect-[21/9] md:aspect-[32/9">
                        <Image priority src={url} alt={`Carousel item ${index + 1}`} className="object-cover" fill />
                    </div>
                ))}
            </div>
            <button onClick={() => handleScroll("left")} className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-12 bg-black bg-opacity-0 hover:bg-opacity-30 duration-300 text-sm md:text-lg lg:text-xl"><FontAwesomeIcon icon={faChevronLeft}/></button>
            <button onClick={() => handleScroll("right")} className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-12 bg-black bg-opacity-0 hover:bg-opacity-30 duration-300 text-sm md:text-lg lg:text-xl"><FontAwesomeIcon icon={faChevronRight}/></button>
        </div>
    )
}