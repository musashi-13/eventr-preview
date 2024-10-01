export default function Page() {
    return (
        <div className="h-screen p-4 md:p-0 w-screen flex items-center justify-center">
            <div className="bg-eventr-gray/60 border border-zinc-600/50 flex flex-col gap-6 -translate-y-16 p-8 rounded-lg">
                <h1 className="text-2xl text-center md:text-4xl">Thank you for registering!</h1>
                <p className="text-wrap w-72 text-xs md:text-lg md:w-96 text-center">We're excited to announce that our launch is approaching! We'll keep you informed via email.</p>
            </div> 
        </div>
    )
}