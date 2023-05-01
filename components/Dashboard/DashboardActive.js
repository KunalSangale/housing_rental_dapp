import { useAccount, useContract, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
import RentData from "./RentData"
import contractAddress from "../../hardhat.json"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import axios from "@/axiosConfig"
import ProposalContainer from "./ProposalContainer"
import ListingContainer from "../Views/ListingContainer"
export default () => {
    const { address } = useAccount()
    const { data: signer, isError } = useSigner()
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    const [isLoading, setLoading] = useState(true)
    const [userData, setData] = useState(null)
    const [modProposals, setMod] = useState(null)
    const [active, setActive] = useState(null)
    const [apiData, setApiData] = useState(null)
    const getUserData = (e) => {
        // e.preventDefault()
        if (signer && signer !== null) {
            contract.getUserData().then((result) => {
                console.log(result)
                setData(result)
                if (
                    !(
                        result.activeRentIndices.length === 0 &&
                        result.activeTenantIndices.length === 0 &&
                        result.activeResolverIndices.length === 0 &&
                        result.proposals.length == 0
                    )
                ) {
                    axios
                        .post("/getlistings", {
                            listingIndices: [
                                ...result.activeRentIndices.map((e) =>
                                    formatUnits(e.listingIndex, 0)
                                ),
                                ...result.activeTenantIndices.map((e) =>
                                    formatUnits(e.listingIndex, 0)
                                ),
                                ...result.activeResolverIndices.map((e) =>
                                    formatUnits(e.listingIndex, 0)
                                ),
                                ...result.proposals.map((e) => formatUnits(e.listingIndex, 0)),
                            ],
                        })
                        .then((response) => {
                            setApiData(response.data)
                            let newProp = {}
                            for (let x of response.data) {
                                newProp[x.Listing.listing_index] = {
                                    listing: x,
                                    props: [],
                                }
                                for (let j of result.proposals) {
                                    console.log(
                                        formatUnits(j.listingIndex, 0),
                                        x.Listing.listing_index
                                    )
                                    if (
                                        parseInt(formatUnits(j.listingIndex, 0)) ===
                                        x.Listing.listing_index
                                    ) {
                                        let k = formatUnits(j.listingIndex, 0)
                                        newProp[k].props.push(j)
                                    }
                                }
                            }
                            setMod(newProp)

                            setLoading(false)
                        })
                } else {
                    setLoading(false)
                }
            })
        }
        // alert(transactionRes)
    }
    useEffect(getUserData, [signer])
    return (
        <div className="w-full flex flex-col mt-24 px-12 overflow-y-auto">
            {isLoading ? (
                <PulseLoader className="mx-auto" />
            ) : active === null ? (
                <>
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        My Proposals
                    </p>

                    {userData.proposals.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-6 justify-items-start gap-x-4 gap-y-4 p-4">
                            {Object.keys(modProposals).map((e, i) => {
                                return (
                                    <div className="border rounded-lg">
                                        <ListingContainer e={modProposals[e].listing} />
                                        {modProposals[e].props.map((prop, i) => {
                                            return (
                                                <p className="mx-4 my-2 bg-slate-100 border px-2 py-1 font-bold rounded-md text-xs block uppercase ">
                                                    {formatUnits(prop.rentAmount, 18)} ETH |{" "}
                                                    {prop.months} months
                                                </p>
                                            )
                                        })}
                                    </div>
                                )
                            })}
                        </div>
                    ) : (
                        <p className="mx-auto text-center">No proposals found</p>
                    )}
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        My Properties
                    </p>
                    {userData.activeRentIndices.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-6 justify-items-start gap-x-4 gap-y-4 p-4">
                            {userData.activeRentIndices.map((e, i) => {
                                return (
                                    <ListingContainer
                                        e={modProposals[e.listingIndex].listing}
                                        overwriteEth={e.rent}
                                        overwriteLink={(e) =>
                                            setActive({ ...e, asLandlord: true })
                                        }
                                    />
                                )
                            })}
                        </div>
                    ) : (
                        <p className="mx-auto text-center">No properties found</p>
                    )}
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        Rented Properties
                    </p>
                    {userData.activeTenantIndices.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-6 justify-items-start gap-x-4 gap-y-4 p-4">
                            {userData.activeTenantIndices.map((e, i) => {
                                return (
                                    <ListingContainer
                                        e={modProposals[e.listingIndex].listing}
                                        overwriteEth={e.rent}
                                        overwriteLink={(e) => setActive({ ...e, asTenant: true })}
                                    />
                                )
                            })}
                        </div>
                    ) : (
                        <p className="mx-auto text-center">No properties found</p>
                    )}
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        Dispute Resolution Properties
                    </p>
                    {userData.activeResolverIndices.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-6 justify-items-start gap-x-4 gap-y-4 p-4">
                            {userData.activeResolverIndices.map((e, i) => {
                                return (
                                    <ListingContainer
                                        e={modProposals[e.listingIndex].listing}
                                        overwriteEth={e.rent}
                                        overwriteLink={(e) =>
                                            setActive({ ...e, asResolver: true })
                                        }
                                    />
                                )
                            })}
                        </div>
                    ) : (
                        <p className="mx-auto text-center">No properties found</p>
                    )}
                </>
            ) : (
                active && <RentData active={active} setActive={setActive} />
            )}
        </div>
    )
}
