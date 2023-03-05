import Navbar from "@/components/Navbar/Navbar"
export default ()=>{
    return (
        <>
        <Navbar />
        <div className="mt-32 w-full flex-col space-y-6 md:px-40">
            <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide">PROPERTY LISTINGS</h4>
            <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide">UNLISTED PROPERTIES</h4>
        </div>
        </>
    )
}