import { useAccount, useContract, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"

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
                        result.proposals.length == 0
                    )
                ) {
                    axios
                        .post("/getlistings", {
                            listingIndices: [
                                ...result.activeRentIndices,
                                ...result.activeTenantIndices,
                                ...result.proposals.map((e) => formatUnits(e.listingIndex, 0)),
                            ],
                        })
                        .then((response) => {
                            setApiData(response.data)
                            let newProp = {}
                            for (let x of response.data) {
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
                                        if (newProp[k] === undefined) {
                                            newProp[k] = {
                                                listing: x,
                                                props: [j],
                                            }
                                        } else {
                                            newProp[k].props.push(j)
                                        }
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
        <div className="w-full flex flex-col mt-24 px-12">
            {isLoading ? (
                <PulseLoader className="mx-auto" />
            ) : (
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
                        <p></p>
                    )}
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        My Properties
                    </p>
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        Rented Properties
                    </p>
                </>
            )}
        </div>
    )
}
