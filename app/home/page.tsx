'use client'
import Carousel from "../_components/carousel";
import EventCard from "../_components/event-card";
import SearchBar from "../_components/search-bar";
import Trending from "../_components/trending";
import Upcoming from "../_components/upcoming";
import { QueryClient, QueryClientProvider } from 'react-query';
export default function Page() {
    const queryClient = new QueryClient();
    return(
        <QueryClientProvider client={queryClient}>
            <div className="w-full md:w-[75vw] m-auto p-2 md:p-4 lg:p-8 flex flex-col gap-2 md:gap-4 lg:gap-8 items-center">
                <Carousel/>
                <SearchBar/>
                <Trending/>
                <Upcoming/>        
            </div>  
        </QueryClientProvider>

    )
}