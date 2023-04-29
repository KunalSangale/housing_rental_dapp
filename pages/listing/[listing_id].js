import React, { useEffect } from "react"
import FeatureCard from "@/components/Listings/FeatureCard.js"
import { Input } from "@mui/joy"
import { addressShorten } from "@/utils"
import { EyeIcon } from "@heroicons/react/24/outline"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { ImCross } from "react-icons/im"
import Link from "next/link"
import { AiFillCheckCircle } from "react-icons/ai"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
import { BsChevronCompactLeft, BsChevronCompactRight } from "react-icons/bs"
import { RxDotFilled } from "react-icons/rx"
import { useRouter } from "next/router"
import Head from "next/head"
import Navbar from "@/components/Navbar/Navbar"
import axios from "@/axiosConfig"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import { watchContractEvent } from "@wagmi/core"
import { PulseLoader } from "react-spinners"
import FixedLocation from "@/components/MapPicker/FixedLocation"
import Image from "next/image"
var furnish_config = ["Not Furnished", "Semi-Furnished", "Fully Furnished"]
const Details = ({ item }) => {
    const { address, isConnected } = useAccount()
    const { data: signer, isError } = useSigner()
    const [proposalData, setProposalData] = useState({ rent: 0, months: 1 })
    const [index, setIndex] = useState(null)

    const handleProposalChange = (e, i) => {
        setProposalData({ ...proposalData, [i]: e.target.value })
    }

    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    const router = useRouter()
    const [currentIndex, setCurrentIndex] = useState(0)
    // var index
    const { listing_id } = router.query
    const [listing, setListing] = useState(null)
    const [isLoading, setLoading] = useState(true)
    const [proposals, setProposals] = useState(null)
    const [count, setCount] = useState(0)
    const [slides, setSlides] = useState([])
    // var slides = []
    useEffect(() => {
        if (listing_id == null) return
        if (!isLoading) setLoading(true)
        Promise.all([
            axios.get("/listing?metadata=" + listing_id),
            axios.get("/totalimages/" + listing_id),
        ]).then((responses) => {
            setListing(responses[0].data)
            setCount(responses[1].data)
            let newSlides = []
            for (let i = 0; i < responses[1].data; i++) {
                newSlides.push({
                    url: "http://localhost/api/images/" + listing_id + "?id=" + (i + 1),
                })
            }
            setSlides(newSlides)
            setLoading(false)
        })
    }, [listing_id])
    console.log(listing)
    var data = listing && listing !== undefined && listing.Listings
    // console.log("m",listing.Listings.listing_index)
    console.log("index", index)

    const [isGetCalled, setGetCalled] = useState(false)

    const createProposal = async (e) => {
        // e.preventDefault()
        console.log(listing.Listings.listing_index)
        const transactionRes = await contract.createProposal({
            listingIndex: listing.Listings.listing_index,
            rentAmount: parseEther(proposalData.rent),
            sender: address,
            months: proposalData.months,
        })

        return transactionRes.wait(1)
    }
    console.log(proposals)
    const getProposals = async (e) => {
        // e.preventDefault()
        const transactionRes = await contract.getProposals(listing.Listings.listing_index)
        // alert(transactionRes)
        setProposals(transactionRes)
        setGetCalled(true)
    }
    var propData = listing && listing !== undefined && listing.PropertyOwnership
    if (isLoading) {
        return (
            <div>
                <PulseLoader color={"#475569"} className="m-auto mt-40 w-40 " size={16} />
            </div>
        )
    }
    if (listing == null) {
        return (
            <div>
                <p className="text-center text-slate-600 ">Listing does not exist</p>
            </div>
        )
    }

    // const slides = [
    //     {
    //         url: "http://localhost/api/images/" + listing_id + "?id=1",
    //     },
    //     {
    //         url: "http://localhost/api/images/" + listing_id + "?id=3",
    //     },
    //     {
    //         url: "https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80",
    //     },

    //     {
    //         url: "https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80",
    //     },
    //     {
    //         url: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80",
    //     },
    // ]

    const prevSlide = () => {
        const isFirstSlide = currentIndex === 0
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1
        setCurrentIndex(newIndex)
    }

    const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1
        const newIndex = isLastSlide ? 0 : currentIndex + 1
        setCurrentIndex(newIndex)
    }

    const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex)
    }

    return (
        <>
            <Head>
                <title>Rento</title>
                <meta name="description" content="Decentralized Housing Rental Platform" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Navbar />
            <div className="home-container w-full px-20 pb-8">
                <div className="home-container2">
                    <div className="max-w-[1400px] h-[500px] w-full m-auto  relative group">
                        <div
                            style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
                            className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                        ></div>
                        {/* <Image
                            src={"http://localhost/api/images/" + listing_id + "?compressed=true"}
                            className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                            fill
                        /> */}
                        {/* <image
                            src={src}
                            className="w-full h-full rounded-2xl bg-center bg-cover duration-500"
                        ></image> */}
                        {/* Left Arrow */}
                        <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                            <BsChevronCompactLeft onClick={prevSlide} size={30} />
                        </div>
                        {/* Right Arrow */}
                        <div className="hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer">
                            <BsChevronCompactRight onClick={nextSlide} size={30} />
                        </div>
                        <div className="flex top-4 justify-center py-2">
                            {slides.map((slide, slideIndex) => (
                                <div
                                    key={slideIndex}
                                    onClick={() => goToSlide(slideIndex)}
                                    className="text-2xl cursor-pointer"
                                >
                                    <RxDotFilled />
                                </div>
                            ))}
                        </div>
                    </div>
                    {/* <img
          src="/apt2.jpeg"
          alt="image"
          className="home-image"
        />  */}
                    <div className="home-container3">
                        <div className="home-features">
                            <h1 className="home-text">Overview</h1>
                            <div className="home-container4">
                                <FeatureCard
                                    title={data.eth_rent + " ETH/month"}
                                    description={"Rent"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={data.deposit + " ETH"}
                                    description={"Deposit"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={data.bhk}
                                    description={"Number of Bedrooms"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={data.bathrooms}
                                    description={"Number of Bathrooms"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={propData.Address}
                                    description={"Address"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={"Family"}
                                    description={"Preferred Tenant"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={data.property_id}
                                    description={"Property ID"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={furnish_config[data.furnish_status - 1]}
                                    title={furnish_config[data.furnish_status - 1]}
                                    description={"Furnishing Status"}
                                ></FeatureCard>
                                <FeatureCard
                                    title={propData.Area}
                                    description={"Area"}
                                ></FeatureCard>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="home-features1">
                    <h1 className="home-text">Amenities</h1>
                    <div className="home-container1">
                        <ul className="flex flex-col sm:flex-row">
                            {data.hasGym ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Gym <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.hasParking ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Parking <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.hasBalcony ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Balcony <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.hasPool ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Pool <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.hasPark ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Park <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.hasCameras ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Surviellance Cameras <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.isPetFriendly ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Pet Friendly <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                            {data.isSmartHome ? (
                                <li className="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">
                                    Smart Home <AiFillCheckCircle />
                                </li>
                            ) : (
                                <></>
                            )}
                        </ul>
                        {/* <FeatureCard title={"Unit Number"} description={(data.property_id)}></FeatureCard>
                <FeatureCard title={"Unit Address"} description={data.address}></FeatureCard>
                <FeatureCard title={"Rent"} description={data.eth_rent} ></FeatureCard>
                <FeatureCard title={"Deposit"} description={data.deposit}></FeatureCard>
                <FeatureCard title={"Water Supply"} description={"Corporation"}></FeatureCard>
                <FeatureCard title={"Gated Security"} description={"Yes"}></FeatureCard>
                <FeatureCard title={"Floor"} description={"6"}></FeatureCard>
            <FeatureCard title={"Furnishing Status"} description={data.furnish_status}></FeatureCard> */}
                        {/* // <div className="feature-card">Unit Number:{parseInt(data.unitNumber._hex,16)}</div>
                // <div className="feature-card">Unit Address:{(data.unitAddress)}</div>
                // <div className="feature-card">Rent:{formatEther(BigNumber.from(parseInt(data.rent._hex,16).toString()))} ETH per month</div>
            // <div className="feature-card">Deposit:{formatEther(BigNumber.from(parseInt(data.deposit._hex,16).toString()))} ETH</div> */}
                    </div>
                </div>
                <div className="flex flex-col h-[32rem] w-full p-3">
                    <h1 className="home-text">Map Location</h1>
                    <div className="w-full h-full px-4 mb-10">
                        <FixedLocation lat={data.latitude} lng={data.longitude} />
                    </div>
                </div>
                <div className="flex flex-col w-full p-3 items-stretch space-y-4">
                    <h1 className="home-text">Proposals</h1>
                    {!isGetCalled && (
                        <button
                            className="block flex flex-col items-center justify-center uppercase tracking-wide text-gray-700 text-xs font-bold bg-slate-50 w-60 h-40 flex rounded-lg border hover:bg-slate-100"
                            onClick={getProposals}
                        >
                            {" "}
                            <EyeIcon className="h-12 w-12 text-gray-700" />
                            view Proposals
                        </button>
                    )}
                    {isGetCalled && proposals === null && (
                        <PulseLoader color={"#475569"} className="m-auto mt-40 w-40 " size={16} />
                    )}
                    {isGetCalled && proposals !== null && (
                        <div className="grid grid-cols-2 md:grid-cols-6 justify-items-start gap-x-4 gap-y-4">
                            {proposals.map((e, i) => {
                                return (
                                    <div className="border rounded-lg flex flex-col space-y-2 w-60 ">
                                        <div className="pt-8">
                                            <p className="text-xs font-bold text-gray-700 tracking-wide block p-3 pb-0">
                                                ETH
                                            </p>
                                            <p className="text-6xl font-bold text-gray-700 tracking-wide block p-3 pt-0 pr-1 inline truncate    ">
                                                {formatUnits(e.rentAmount, 18)}
                                            </p>
                                            <p className="inline text-sm text-gray-600 block font-bold uppercase tracking-wider">
                                                /pm
                                            </p>
                                        </div>
                                        <div className="w-full h-16 bg-slate-100 rouned-lg flex flex-col p-3">
                                            <p className="text-sm font-bold text-gray-600 tracking-wide block">
                                                BY {addressShorten(e.sender)}
                                            </p>
                                            <p className="text-sm font-bold text-gray-600 tracking-wide block">
                                                {formatUnits(e.months, 0)} months
                                            </p>
                                        </div>
                                    </div>
                                )
                            })}
                            <button
                                className="block space-y-2 flex flex-col items-center justify-center uppercase tracking-wide text-gray-700 text-xs font-bold bg-slate-50 w-60 h-48 rounded-lg border hover:bg-slate-100"
                                onClick={getProposals}
                            >
                                <ArrowPathIcon className="h-12 w-12 text-gray-700" />
                                <p>Refresh Proposals</p>
                            </button>
                        </div>
                    )}
                    <div className="border-b mx-12"></div>
                    <div className="flex flex-col space-y-2 w-60 p-3 border rounded-lg pb-4">
                        <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                            Create proposal
                        </p>
                        <Input
                            color="neutral"
                            variant="outlined"
                            size="sm"
                            onChange={(e) => handleProposalChange(e, "rent")}
                            // className="basis-1/6"
                            placeholder="Proposed Rent"
                            value={proposalData.rent}
                        />
                        <Input
                            color="neutral"
                            variant="outlined"
                            size="sm"
                            onChange={(e) => handleProposalChange(e, "months")}
                            // className="basis-1/6"
                            placeholder="Tenure"
                            value={proposalData.months}
                        />
                        <button
                            className="text-white bg-blue-700 hover:bg-blue-800  focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            onClick={() => createProposal(event)}
                        >
                            Create Proposal
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Details
