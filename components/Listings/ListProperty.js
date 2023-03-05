import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import PropertyView from "./PropertyView"
import { useState } from "react"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
export default (props) => {
    const [fileList, setFileList] = useState(null)
    const handleFileChange = (e) => {
        setFileList(e.target.files)
    }
    const { address, isConnected } = useAccount()

    const { data: signer, isError, isLoading } = useSigner()
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })

    const handleUploadClick = () => {
        if (!fileList) {
            return
        }

        // 👇 Create new FormData object and append files
        const data = new FormData()
        files.forEach((file, i) => {
            data.append(`uploaded_files`, file, file.name)
        })
        data.append("property_id", props.active.SaleDeedNumber)
        data.append("eth_rent", "0.1")
        data.append("deposit", "0.5")
        data.append("latitude", "0.534234")
        data.append("longitude", "0.521312")
        data.append("details", "test 123")
        // 👇 Uploading the files using the fetch API to the server
        fetch("http://localhost/api/create_listing", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then((data) => {
                if (!data.error)
                    return contract.createListing({
                        index: 0,
                        metadataID: data.metadata_id,
                        metadataHash: "has456456h",
                        landlord: address,
                    })
                else {
                    console.log("error")
                    throw new Error("listing already exists")
                }
            })
            .then((response) => {
                return response.wait(1)
            })
            .then((data) => {
                console.log(data)
                fetch("http://localhost/api/update_index", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        wallet_address: address,
                        property_id: property_id,
                        index: data,
                    }),
                })
                    .then((r) => r.json())
                    .then((data) => {
                        console.log(data)
                    })
                    .catch((e) => console.log)
            })
            .catch((err) => console.error(err))
    }
    const files = fileList ? [...fileList] : []
    return (
        <div className="flex flex-col w-full md:px-32 mt-32">
            <ArrowLeftIcon className="h-6 w-6 text-gray-700" />
            <h3>Create Listing</h3>
            <PropertyView {...props.active} />
            <p>Add Photos or Videos</p>
            <input type="file" onChange={handleFileChange} multiple />
            <ul>
                {files.map((file, i) => (
                    <li key={i}>
                        {file.name} - {file.type}
                    </li>
                ))}
            </ul>
            <button onClick={handleUploadClick}>Upload</button>
        </div>
    )
}
