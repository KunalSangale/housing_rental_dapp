import React from "react"
import { useState, useCallback, useMemo } from "react"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import { watchContractEvent } from "@wagmi/core"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"
const Popup = (props) => {
    const crypto = require("crypto")
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
    const [files, setFile] = useState()
    const handleFileInputChange = (e) => {
        if (e.target.files.length > 0) {
            setFile(e.target.files[0])
        }
    }
    console.log(props.index, props.listing_index)
    const handleSubmit = async (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        // files.forEach((file, i) => {
        //     data.append(`uploaded_files`, file, file.name)
        // })
        data.append(`uploaded_files`, files)
        let fileContents = ""
        const reader = new FileReader()
        reader.onload = () => {
            fileContents = reader.result
            // const hash = sha256(fileContents)
            // console.log(hash.toString())
        }
        reader.readAsBinaryString(files)
        const fileHash = crypto.createHash("sha256").update(fileContents).digest("hex")
        data.append("metadata_id", props.metadata_id.toString())
        console.log("mid", props.metadata_id)
        fetch("http://localhost/api/upload_agreement", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (!data.error) {
                    console.log("Stage 2... Calling acceptProposal in blockchain")
                    const dat = new FormData(e.target)
                    const transactionRes = await contract.acceptProposal(
                        props.listing_index,
                        props.index,
                        1,
                        fileHash,
                        dat.get("dspt"),
                        Date.parse(dat.get("start_date")) / 1000,
                        dat.get("months"),
                        parseEther(dat.get("eth_rent")),
                        parseEther(dat.get("eth_deposit")),
                        "xya"
                    )
                    console.log(transactionRes)
                    return transactionRes.wait(1)
                }
            })
            .then((e) => {
                props.handleClose()
            })
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
                                name="files[]"
                                type="file"
                                multiple="multiple"
                                onChange={handleFileInputChange}
                                accept=".pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
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
