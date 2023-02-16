import { useAccount, useBalance, useDisconnect } from "wagmi"
import { addressShorten } from "@/utils"
import { useEffect, useState } from "react"
export default (props) => {
    const { address, isConnected } = useAccount()
    const { data, isError, isLoading } = useBalance({ address })
    const [loading, setLoading] = useState(true)
    const [personalData, setPersonalData] = useState({ connected: false })
    useEffect(() => {
        fetch("http://localhost/is_connnected?wallet_address=" + address)
            .then((r) => {
                setLoading(false)
                console.log(r)
                if (r.body.found) {
                    setPersonalData({ connected: true, ...r.body })
                }
            })
            .catch((e) => console.log(e))
    }, [])
    return (
        <div className="mt-24 p-4">
            {isConnected ? (
                <>
                    {!personalData.connected && (
                        <div>
                            <p>{addressShorten(address)}</p>
                            <p className="font-nunito ml-2 font-semibold text-sm">
                                {data?.formatted}
                            </p>
                            <p className=" ml-1.5 text-xs font-nunito font-bold">{data?.symbol}</p>
                            <button onClick={() => props.handleStage(true)}>Connect Aadhar</button>
                        </div>
                    )}
                    {personalData.connected && (
                        <div>
                            <p>
                                {personalData.firstname} {personalData.lastname}
                            </p>
                            <p className="font-nunito ml-2 font-semibold text-sm">
                                {data?.formatted}
                            </p>
                            <p className=" ml-1.5 text-xs font-nunito font-bold">{data?.symbol}</p>
                        </div>
                    )}
                </>
            ) : (
                <div>
                    <p>Please connect wallet to start KYC</p>
                    {/* <button>Connect</button> */}
                </div>
            )}
        </div>
    )
}
