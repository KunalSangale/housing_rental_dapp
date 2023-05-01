import React from "react"
import { useState, useCallback, useMemo } from "react"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import { watchContractEvent } from "@wagmi/core"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
const Popup = (props) => {
    console.log("Listing index", props.listing_index)
    console.log("index", props.index)
    const { address, isConnected } = useAccount()
    const [listenData, setListenData] = useState(null)
    const { data: signer, isError, isLoading } = useSigner()
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        console.log("datamonths", data.get("months"))
        const transactionRes = await contract.acceptProposal(
            props.listing_index,
            props.index,
            1,
            "hash20412",
            data.get("dspt"),
            Date.parse(data.get("start_date")) / 1000,
            data.get("months"),
            parseEther(data.get("eth_rent")),
            parseInt(data.get("eth_deposit")),
            "xya"
            // (listingIndex = props.listing_index),
            // (index = props.index),
            // (docID = "1"),
            // (docHash = "9r802j3"),
            // (middleman = data.get("dspt")),
            // (startDate = data.get("start_date").toString()),
            // (months = data.get("months")),
            // (rent = parseEther(data.get("eth_rent"))),
            // (deposit = parseEther(data.get("eth_deposit"))),
            // (landlordSign = "testSign")
        )

        return transactionRes.wait(1)
    }
    return (
        <div className="popup-box">
            <div className="box">
                <span className="close-icon" onClick={props.handleClose}>
                    x
                </span>
                <div class="">
                    <form
                        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
                        onSubmit={handleSubmit}
                    >
                        <div class="mb-4">
                            <label
                                class="block text-gray-700 text-sm font-bold mb-2"
                                for="username"
                            >
                                Agreed Rent
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="eth_rent"
                                type="number"
                                min="0"
                                step=".01"
                                placeholder="Enter rent in ETH"
                                required
                            />
                        </div>
                        <div class="mb-6">
                            <label
                                class="block text-gray-700 text-sm font-bold mb-2"
                                for="username"
                            >
                                Agreed Deposit
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="eth_deposit"
                                type="number"
                                min="0"
                                step=".01"
                                placeholder="Enter deposit in ETH"
                                required
                            />
                        </div>
                        <div class="mb-8">
                            <label
                                class="block text-gray-700 text-sm font-bold mb-2"
                                for="username"
                            >
                                Start Date
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="start_date"
                                type="date"
                                placeholder="Enter start date of agreement"
                                required
                            />
                        </div>
                        <div class="mb-10">
                            <label
                                class="block text-gray-700 text-sm font-bold mb-2"
                                for="username"
                            >
                                Months
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="months"
                                type="number"
                                min="1"
                                max="12"
                                step="1"
                                placeholder="Enter months"
                                required
                            />
                        </div>
                        <div class="mb-12">
                            <label
                                class="block text-gray-700 text-sm font-bold mb-2"
                                for="username"
                            >
                                Upload Agreement
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="agrmnt"
                                type="file"
                                placeholder="Select files"
                                required
                            />
                        </div>
                        <div class="mb-14">
                            <label
                                class="block text-gray-700 text-sm font-bold mb-2"
                                for="username"
                            >
                                Dispute Resolver
                            </label>
                            <input
                                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                name="dspt"
                                type="text"
                                placeholder="Enter address"
                                required
                            />
                        </div>
                        <div class="flex items-center justify-between">
                            <button
                                class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                                type="submit"
                            >
                                Submit
                            </button>
                            <a
                                class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                                href="#"
                            >
                                Forgot Password?
                            </a>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Popup
