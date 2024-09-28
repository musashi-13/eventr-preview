'use client'
import Carousel from "../_components/carousel";
import Categories from "../_components/categories-list";
import SearchBar from "../_components/search-bar";
import Trending from "../_components/trending";
// import Upcoming from "../_components/upcoming";
import { QueryClient, QueryClientProvider } from 'react-query';
export default function Page() {
    const queryClient = new QueryClient();
    return(
        <QueryClientProvider client={queryClient}>
            <div className="w-full md:w-[75vw] m-auto p-2 md:p-4 lg:p-8 flex flex-col gap-2 md:gap-4 lg:gap-8 items-center">
                <Carousel/>
                <SearchBar/>
                <Trending/>
                <Categories page="home"/>
                {/* <Upcoming/>   We will add this later. No need for beta*/}
            </div>  
        </QueryClientProvider>
    )
}