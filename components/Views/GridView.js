import Link from "next/link"
import Image from "next/image"

export default (props) => {
    return props.searchResults.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 mx-8 md:mx-40">
            {props.searchResults.map((e, i) => {
                return (
                    <div className="w-60 h-60 bg-slate-100 flex flex-col border rounded">
                        <div className="relative basis-1/2 w-full ">
                            <Image
                                src={
                                    "http://localhost/api/thumbnail/" +
                                    e.Listing.metadata_id +
                                    "?compressed=true"
                                }
                                className="object-cover rounded-md"
                                fill
                            />
                        </div>
                        <p className="text-slate-600 font-bold text-sm mx-3">
                            {e.Property.Address}
                        </p>
                        <p className="text-slate-600 text-sm mx-3">{e.Listing.bhk} BHK</p>
                        <p className="text-slate-600 text-sm mx-3">{e.Listing.deposit} ETH</p>
                        <p className="text-blue-600 text-sm mx-3">{e.Listing.eth_rent} ETH</p>
                        <Link
                            href={{
                                pathname: "/listing/" + e.Listing.metadata_id,
                            }}
                            className="text-white bg-blue-700 m-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                        >
                            View
                        </Link>
                    </div>
                )
            })}
        </div>
    ) : (
        <div className="mt-40 w-full">
            <p className="text-lg text-slate-600 text-center w-full">
                {" "}
                No search results found for the query
            </p>
        </div>
    )
}
