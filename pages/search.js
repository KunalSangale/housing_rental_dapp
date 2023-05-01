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
    const [rentVal, setRentVal] = useState([0, 5])
    // const [active, setActive] = useState({})
    const [depVal, setDepVal] = useState([0, 5])
    // const getInitialState = () => {
    //     const value = "2.0"
    //     return value
    // }
    // const [rent_max, setRentMax] = useState(getInitialState)
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
                <FiltersSidebar
                    setActive={setActive}
                    active={active}
                    setRent={setRentVal}
                    setDep={setDepVal}
                />
                <div className="w-full mt-24 ">
                    <div className="md:mx-auto w-full mx-4 md:w-96 ">
                        <div className="flex flex-row">
                            <CitySearch queryParams={queryParams} setQuery={setQuery} />
                            <Link
                                href={{
                                    pathname: "/search",
                                    query: {
                                        ...queryParams,
                                        ...active,
                                        rent_min: rentVal[0],
                                        rent_max: rentVal[1],
                                        dep_min: depVal[0],
                                        dep_max: depVal[1],
                                    },
                                }}
                                className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                                Search
                            </Link>
                        </div>
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
