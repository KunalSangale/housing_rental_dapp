import axios from "../axiosConfig"
import { useEffect, useState } from "react"
import useQuery from "@/hooks/useQuery"
import { PulseLoader } from "react-spinners"
import Link from "next/link"
import Navbar from "@/components/Navbar/Navbar"
import FiltersSidebar from "@/components/Search/FiltersSidebar"
import Image from "next/image"
import CitySearch from "@/components/HeroSection.js/CitySearch"
import GridView from "@/components/Views/GridView"
import MapResults from "@/components/MapPicker/MapResults"
const activeHighlight = "bg-blue-50 text-blue-500 hover:bg-blue-100"
const inactiveText = "text-gray-700 hover:bg-gray-50"
export default () => {
    const query = useQuery()
    const [loading, setLoading] = useState(true)
    const [queryParams, setQuery] = useState(query)
    const [active, setActive] = useState({})
    const [isGrid, setView] = useState(true)
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
                    <div className="mx-auto  flex justify-center cursor-pointer items-center my-4 text-center text-xs font-bold tracking-wide uppercase  border w-fit rounded-lg">
                        <p
                            className={
                                "block w-40 px-4 py-2 " + (isGrid ? activeHighlight : inactiveText)
                            }
                            onClick={() => setView(true)}
                        >
                            Grid view
                        </p>
                        <div className="border-r h-4"></div>
                        <p
                            className={
                                "block  w-40 px-4 py-2 " +
                                (!isGrid ? activeHighlight : inactiveText)
                            }
                            onClick={() => setView(false)}
                        >
                            Map view
                        </p>
                    </div>
                    {isGrid && <GridView searchResults={searchResults} />}
                    {!isGrid && <MapResults searchResults={searchResults} />}
                </div>
            </div>
        </>
    )
}
