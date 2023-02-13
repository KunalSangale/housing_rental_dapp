import { useEffect, useState } from "react"
import { useContractRead, useNetwork, useProvider } from "wagmi"
import { abi, contractAddress } from "../../constants"
import Nossr from "../Nossr"
export default () => {
    const { chain, chains } = useNetwork()
    const provider = useProvider()
    const { data, isError, isLoading } = useContractRead({
        address: contractAddress,
        abi: abi,
        functionName: "getListings",
        args: ["0", "5"],
        onSettled(data, error) {
            console.log("Settled", { data, error })
        },
    })
    // console.log(provider.getCode(contractAddress).then((r) => console.log(r)))
    // console.log(contractAddress)
    return (
        <Nossr>
            <div className="grid grid-cols-2 md:grid-cols-4 mt-36">{chain && chain.name}</div>
        </Nossr>
    )
}
