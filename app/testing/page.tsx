import { API_ENDPOINTS } from "@/server/endpoints"

export default function Page() {
    return (
        <div>
            <div className="bg-black border-2 border-zinc-500/20 rounded-lg h-96 w-[540px] flex flex-col relative">
            <div className="h-max p-4 flex flex-col gap-2 items-center justify-center">
                <h1 className="text-2xl tracking-widest font-gothic">EVENTR</h1>
                <h2 className="text-3xl">OTP Verification</h2>
            </div>
            <div className="bg-eventr-gray h-full p-4">
                <p className="mb-4">Dear Username,</p>
                <p className="mb-4">Your OTP is <span className="font-bold text-xl">543 329</span></p>
                <p>Thank you for registering to Eventr, where every ticket tells a story!</p>
                <p className="mb-4">We are excited to have you on board.</p>
                <p className="text-sm">Do not share this OTP with anyone.</p>
                <p className="mb-4 text-sm">If this wasn't you, please ignore this message.</p>
                <p className="text-sm w-full text-center">&copy; Eventr Co. 2024</p>
            </div>
            </div>
        </div>
    )
}