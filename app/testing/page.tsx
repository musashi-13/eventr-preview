import { API_ENDPOINTS } from "@/server/endpoints"

export default function Page() {
    return (
        <div>
            <div className="bg-black border-2 border-zinc-500/20 rounded-lg h-96 w-[540px] flex flex-col relative">
            <div className="h-max p-4 flex flex-col gap-2 items-center justify-center">
                <h1 className="text-2xl tracking-widest font-gothic">EVENTR</h1>
                <h2 className="text-3xl mb-4">OTP Verification</h2>
            </div>
            <div className="bg-eventr-gray h-full p-4">
                <p>Dear Username,</p>
                <p>Your OTP is <span>543 329</span></p>
            </div>
            </div>
        </div>
    )
}