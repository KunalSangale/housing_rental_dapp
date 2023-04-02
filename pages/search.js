import axios from "../axiosConfig"
import { useEffect, useState } from "react"
import useQuery from "@/hooks/useQuery"
import { PulseLoader } from "react-spinners"
import Link from "next/link"
import Navbar from "@/components/Navbar/Navbar"
import FiltersSidebar from "@/components/Search/FiltersSidebar"
export default () => {
    const query = useQuery()
    const [loading, setLoading] = useState(true)
    const [searchResults, setResults] = useState([])
    useEffect(() => {
        console.log(query)
        if (!query) {
            return
        }
        axios.post("/search", query).then((response) => {
            setLoading(false)
            setResults(response.data)
            console.log(response)
        })
    }, [query])
    if (loading) {
        return (
            <>
                <Navbar />
                <PulseLoader color={"#475569"} className="m-auto mt-40 w-40 " size={16} />
            </>
        )
    }

    return (
        <>
            <Navbar />
            <div className="w-full h-screen flex ">
                <FiltersSidebar />
                {searchResults.length > 0 ? (
                    <div className="mt-24 grid grid-cols-2 md:grid-cols-4 mx-8 md:mx-40">
                        {searchResults.map((e, i) => {
                            return (
                                <div className="w-60 h-60 bg-slate-100 border rounded p-3 ">
                                    <p className="text-slate-600 font-bold text-sm">
                                        {e.Property.Address}
                                    </p>
                                    <p className="text-slate-600 text-sm">{e.Listing.bhk} BHK</p>
                                    <p className="text-slate-600 text-sm">
                                        {e.Listing.deposit} ETH
                                    </p>
                                    <p className="text-blue-600 text-sm">
                                        {e.Listing.eth_rent} ETH
                                    </p>
                                    <Link
                                        href={{
                                            pathname: "/listing/" + e.Listing.metadata_id,
                                        }}
                                        className="text-white bg-blue-700  hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 "
                                    >
                                        View
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="mt-40">
                        <p className="text-lg text-slate-600 text-center">
                            {" "}
                            No search results found for the query
                        </p>
                    </div>
                )}
            </div>
        </>
    )
}
