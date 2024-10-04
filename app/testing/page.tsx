import { API_ENDPOINTS } from "@/server/endpoints"
import Loader from "../_components/loading"

export default function Page() {
    console.log(API_ENDPOINTS)
    return (
        <Loader />
    )
}