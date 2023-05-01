import { useAccount, useContract, useSigner } from "wagmi"
import { useEffect, useState } from "react"
import { PulseLoader } from "react-spinners"
import contractAddress from "../../hardhat.json"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"

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

    const getUserData = (e) => {
        // e.preventDefault()
        if (signer && signer !== null) {
            contract.getUserData().then((result) => {
                console.log(result)
                setData(result)
                setLoading(false)
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
                        As Tenant
                    </p>
                    <p className="text-3xl uppercase tracking-wide  font-bold select-none text-gray-700">
                        As Landlord
                    </p>
                </>
            )}
        </div>
    )
}
