import { useEffect, useState } from "react"
import { useContractRead, useNetwork, useProvider } from "wagmi"
import { abi, contractAddress } from "../../constants"
import Nossr from "../Nossr"
import ListingItem from "./ListingItem"
export default () => {
    // const { chain, chains } = useNetwork()
    // const provider = useProvider()
    // const { data, isError, isLoading } = useContractRead({
    //     address: contractAddress,
    //     abi: abi,
    //     functionName: "getListings",
    //     args: ["0", "5"],
    //     onSettled(data, error) {
    //         console.log("Settled", { data, error })
    //     },
    // })
    // console.log(provider.getCode(contractAddress).then((r) => console.log(r)))
    // console.log(contractAddress)
    return (
        <div className="mt-32 w-full flex-col space-y-6 md:px-40">
            <ListingItem/>
        </div>
    )
}
