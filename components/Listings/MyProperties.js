import React from "react"
import { useEffect, useState } from "react"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import { ArrowPathIcon } from "@heroicons/react/24/outline"
import { formatUnits } from "@ethersproject/units"
import { addressShorten } from "@/utils"
import { useRouter } from "next/navigation"
import AgrementForm from "./AgreementForm"
import Link from "next/link"
export default (props) => {
    const [isOpen, setIsOpen] = useState(false)

    const togglePopup = () => {
        setIsOpen(!isOpen)
    }
    const { push } = useRouter()
    const { address, isConnected } = useAccount()
    const { data: signer, isError } = useSigner()
    const [index, setIndex] = useState(null)
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    // const [dataLists, setData] = useState({ properties: [], listings: [] })
    const [properties, setProperties] = useState([])
    const [listings, setListings] = useState([])
    const [trnx, setTrnx] = useState({})
    const unlistProperty = (metadata_id) => {
        // console.log(property_id)
        fetch("http://localhost/api/unlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ wallet_address: address, metadata_id: metadata_id }),
        })
            .then((r) => r.json())
            .then((data) => {
                console.log(data)
                if (data.found) {
                    let newListings = [...listings]
                    newListings = newListings.filter((obj) => obj.metadata_id !== metadata_id)
                    setListings(newListings)
                }
            })
            .catch((e) => console.log)
    }

    useEffect(() => {
        if (isConnected) {
            fetch("http://localhost/api/get_properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wallet_address: address,
                }),
            })
                .then((r) => r.json())
                .then((r) => {
                    setProperties(r)
                })
                .catch((e) => console.log)
            fetch("http://localhost/api/get_listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wallet_address: address,
                }),
            })
                .then((r) => r.json())
                .then((r) => {
                    setListings(r)
                    console.log(r)
                })
                .catch((e) => console.log)
        }
    }, [])

    const handleExpand = (listingIndex, index, toShow) => {
        if (trnx[index] === undefined) {
            getProposals(listingIndex, index)
        }
        setExpanded({ ...isExpanded, [index]: toShow })
    }

    const getProposals = async (index, listIndex) => {
        //e.preventDefault()
        setTrnx({ ...trnx, [listIndex]: await contract.getProposals(index) })
        console.log(trnx)
        return trnx
    }

    //const [ isExpanded, setExpanded ] = useState();
    const [isExpanded, setExpanded] = useState({})
    const handleOnClick = (index) => {
        //setExpanded(!isExpanded);
    }
    if (!isConnected) {
        return <p className="mt-32">Please Connect Wallet first</p>
    }
    return (
        <div className="mt-32 w-full flex-col space-y-6 md:px-40">
            <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide">
                PROPERTY LISTINGS
            </h4>
            {listings.map((e, i) => {
                return (
                    <div className="bg-gray-50 rounded border cursor-pointer" key={i}>
                        <div className="py-4 px-8 w-full  flex justify-between">
                            <div>
                                <p>{e.Address}</p>
                                <p>{e.Area}</p>
                                <p>{e.Pincode}</p>
                                <p>{e.property_id}</p>
                            </div>

                            <div className="flex flex-col space-y-2">
                                <button
                                    className="bg-blue-500 h-fit  px-8 py-2 text-white rounded-md font-bold uppercase tracking-wide text-xs w-48"
                                    onClick={() => push("/listing/" + e.metadata_id)}
                                >
                                    VIEW
                                </button>
                                <button
                                    className="bg-blue-500 h-fit  px-8 py-2 text-white rounded-md font-bold uppercase tracking-wide text-xs w-48"
                                    onClick={() => unlistProperty(e.metadata_id)}
                                >
                                    UNLIST
                                </button>

                                <button
                                    className="bg-blue-500 h-fit  px-8 py-2  text-white rounded-md font-bold uppercase tracking-wide text-xs w-48"
                                    onClick={() => {
                                        {
                                            handleExpand(e.listing_index, i, !isExpanded[i])
                                        }
                                    }}
                                >
                                    {isExpanded[i] ? "Hide" : "View"} Proposals
                                </button>
                            </div>
                        </div>

                        {isExpanded[i] && trnx[i] !== undefined ? (
                            <div className=" mx-8 mb-8">
                                <p className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">
                                    proposals
                                </p>
                                <div className="grid grid-cols-2 md:grid-cols-4 justify-items-start gap-x-4 gap-y-4">
                                    {trnx[i].map((proposal, index1) => {
                                        return (
                                            <>
                                                {isOpen && (
                                                    <AgrementForm
                                                        listing_index={e.listing_index}
                                                        index={i}
                                                        metadata_id={e.metadata_id}
                                                        property_id={e.property_id}
                                                        address={e.sender}
                                                        unlist={() =>
                                                            unlistProperty(e.metadata_id)
                                                        }
                                                        handleClose={togglePopup}
                                                    />
                                                )}
                                                <div
                                                    className="border rounded-lg flex flex-col space-y-2 w-60 "
                                                    onClick={togglePopup}
                                                    key={index1}
                                                >
                                                    <div className="pt-8">
                                                        <p className="text-xs font-bold text-gray-700 tracking-wide block p-3 pb-0">
                                                            ETH
                                                        </p>
                                                        <p className="text-6xl font-bold text-gray-700 tracking-wide block p-3 pt-0 pr-1 inline">
                                                            {formatUnits(proposal.rentAmount, 18)}
                                                        </p>
                                                        <p className="inline text-sm text-gray-600 block font-bold uppercase tracking-wider">
                                                            /pm
                                                        </p>
                                                    </div>
                                                    <div className="w-full h-16 bg-slate-100 rouned-lg flex flex-col p-4">
                                                        <p className="text-sm font-bold text-gray-600 tracking-wide block">
                                                            BY {addressShorten(proposal.sender)}
                                                        </p>
                                                        <p className="text-sm font-bold text-gray-600 tracking-wide block">
                                                            {formatUnits(proposal.months, 0)}{" "}
                                                            months
                                                        </p>
                                                        <Link
                                                            href="https://chat.blockscan.com/start"
                                                            rel="noopener noreferrer"
                                                            target="_blank"
                                                            className="bg-blue-500 h-fit px-8 py-2 mt-2 text-white rounded-md font-bold uppercase tracking-wide text-xs"
                                                        >
                                                            Chat on Blockscan
                                                        </Link>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                    })}
                                    <button
                                        className="block space-y-2 flex flex-col items-center justify-center uppercase tracking-wide text-gray-700 text-xs font-bold bg-slate-50 w-60 h-60 flex rounded-lg border hover:bg-slate-100"
                                        onClick={() => getProposals(e.listing_index, i)}
                                    >
                                        <ArrowPathIcon className="h-12 w-12 text-gray-700" />
                                        <p>Refresh Proposals</p>
                                    </button>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}

                        {/* <div {...getCollapseProps()}>
            <div className="padding: 6px;
    background-color: #eeeeee;">
                
                Now you can see the hidden content. <br/><br/>
                Click again to hide...
            </div>
        </div> */}
                    </div>
                )
            })}
            <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide">
                ALL PROPERTIES
            </h4>
            {properties.map((e, i) => {
                return (
                    <div
                        className="py-4 px-8 w-full bg-gray-50 rounded border flex items-center justify-between"
                        key={i}
                    >
                        <div>
                            <p>{e.Address}</p>
                            <p>{e.Area}</p>
                            <p>{e.Pincode}</p>
                            <p>{e.SaleDeedNumber}</p>
                        </div>
                        <button
                            className="bg-blue-500 h-fit px-8 py-2 text-sm text-white rounded-md font-bold uppercase tracking-wide text-xs w-48"
                            onClick={() => props.changeActive(e)}
                        >
                            LIST
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
