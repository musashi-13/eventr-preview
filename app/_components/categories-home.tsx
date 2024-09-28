'use client';
import { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

export default function Categories() {
    const scrollRef = useRef<HTMLDivElement>(null);

    const handleScroll = (direction: "left" | "right") => {
        if (scrollRef.current) {
            const scrollAmount = scrollRef.current.offsetWidth * 0.125;
            scrollRef.current.scrollBy({
                left: direction === "left" ? -scrollAmount : scrollAmount,
                behavior: "smooth",
            });
        }
    };

    //Fetch this from API
    const categories = ["Concerts", "Comedy", "Festivals", "Parties", "Conferences", "Expos", "Sports", "Arts"];

    return (
        <section className="w-full">
            <header className="flex justify-between mb-2">
                <h2 className="text-xl font-semibold">Browse Categories</h2>
                <div className="text-xs lg:text-sm flex gap-1">
                    <button 
                        className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" 
                        onClick={() => handleScroll("left")} 
                        aria-label="Scroll left"
                    >
                        <FontAwesomeIcon icon={faChevronLeft} />
                    </button>
                    <button 
                        className="bg-gray-900 bg-opacity-30 px-2.5 border border-gray-500/30 rounded-md hover:bg-gray-800 duration-200" 
                        onClick={() => handleScroll("right")} 
                        aria-label="Scroll right"
                    >
                        <FontAwesomeIcon icon={faChevronRight} />
                    </button>
                </div>
            </header>
            <div 
                ref={scrollRef} 
                className="mt-4 flex gap-4 hide-scrollbar overflow-x-scroll snap-x snap-mandatory scroll-smooth"
            >
                {categories.map((category, index) => (
                    <Link 
                        href={`/events/${category.toLowerCase()}`} 
                        key={index} 
                        className="snap-start flex-shrink-0 px-8 py-5 hover:bg-eventr-gray duration-200 border border-gray-500/30 rounded-md" 
                        title={`View all ${category} events`}
                    >
                        {category}
                    </Link>
                ))}
            </div>
        </section>
    );
}
