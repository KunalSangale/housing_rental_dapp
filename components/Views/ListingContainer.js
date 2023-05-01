import Link from "next/link"
import Image from "next/image"
import { formatUnits } from "ethers/lib/utils.js"
export default (props) => {
    return (
        <div className="w-60 h-60 bg-slate-100 flex flex-col border rounded-md relative">
            {/* <div className="relative basis-1/2 w-full ">
                <Image
                    src={
                        "http://localhost/api/thumbnail/" +
                        props.e.Listing.metadata_id +
                        "?compressed=true"
                    }
                    className="object-cover rounded-md"
                    fill
                />
            </div>
            <p className="text-slate-600 font-bold text-sm mx-3">{props.e.Property.Address}</p>
            <p className="text-slate-600 text-sm mx-3">{props.e.Listing.bhk} BHK</p>
            <p className="text-slate-600 text-sm mx-3">{props.e.Listing.deposit} ETH</p>
            <p className="text-blue-600 text-sm mx-3">{props.e.Listing.eth_rent} ETH</p>
            <Link
                href={{
                    pathname: "/listing/" + props.e.Listing.metadata_id,
                }}
                className="text-white bg-blue-700 m-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
            >
                View
            </Link> */}
            <img
                src={
                    "http://localhost/api/thumbnail/" +
                    props.e.Listing.metadata_id +
                    "?compressed=true"
                }
                className=" object-cover h-full w-60 absolute rounded-md"
            />
            <Link
                href={{
                    pathname: "/listing/" + props.e.Listing.metadata_id,
                }}
                className="bg-gradient-to-t from-[black] from-10% to-60% to-transparent pt-32 rounded-md w-60 h-60 absolute cursor-inter hover:to-black opacity-[0.63]"
            ></Link>
            <div className="relative mt-32">
                <p className="text-5xl font-bold text-white tracking-wide block ml-4 pt-0 opacity-100 inline truncate">
                    {formatUnits(props.e.Listing.eth_rent, 0)}
                </p>
                <p className="text-white font-bold ml-1 text-xs inline">ETH</p>
                <p className="text-xs font-bold text-white tracking-wide block pt-0 ml-4 truncate ">
                    {props.e.Property.Address}
                </p>
                <p className="text-white  text-xs ml-4 mt-1">
                    {props.e.Listing.bhk} BHK | {props.e.Property.Area}
                </p>
            </div>
        </div>
    )
}
