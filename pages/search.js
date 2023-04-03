import axios from "../axiosConfig"
import { useEffect, useState } from "react"
import useQuery from "@/hooks/useQuery"
import { PulseLoader } from "react-spinners"
import Link from "next/link"
import Navbar from "@/components/Navbar/Navbar"
import FiltersSidebar from "@/components/Search/FiltersSidebar"
import Image from "next/image"
import CitySearch from "@/components/HeroSection.js/CitySearch"
export default () => {
    const query = useQuery()
    const [loading, setLoading] = useState(true)
    const [queryParams, setQuery] = useState(query)
    const [active, setActive] = useState({})
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
                <div className="w-full mt-24 ">
                    <div className="md:mx-auto w-full mx-4 md:w-96 ">
                        <CitySearch queryParams={queryParams} setQuery={setQuery} />
                    </div>
                    {searchResults.length > 0 ? (
                        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 mx-8 md:mx-40">
                            {searchResults.map((e, i) => {
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
                                        <p className="text-slate-600 text-sm mx-3">
                                            {e.Listing.bhk} BHK
                                        </p>
                                        <p className="text-slate-600 text-sm mx-3">
                                            {e.Listing.deposit} ETH
                                        </p>
                                        <p className="text-blue-600 text-sm mx-3">
                                            {e.Listing.eth_rent} ETH
                                        </p>
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
                    )}
                </div>
            </div>
        </>
    )
}
