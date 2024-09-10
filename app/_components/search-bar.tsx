import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export default function SearchBar() {
    return(
        <div className="relative w-4/5 md:w-2/3 my-2">
            <p className="absolute text-eventr-main top-1/2 -translate-y-1/2 right-2"><FontAwesomeIcon icon={faSearch}/></p>
            <input type="text" placeholder="Search for events, venues, artists, etc." className="w-full h-full outline-none focus:ring-2 ring-gray-500 rounded-md text-black lg:rounded-md p-2 pr-8 bg-white"/>
        </div>
    )
}