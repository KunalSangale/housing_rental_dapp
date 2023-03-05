import { useAccount, useBalance, useDisconnect, useSignMessage } from "wagmi"
import { addressShorten } from "@/utils"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"
import { useNotification } from "@web3uikit/core"
import { PuffLoader } from "react-spinners"
export default (props) => {
    const { address, isConnected } = useAccount()
    const { data, isError, isLoading } = useBalance({ address })
    const { signMessageAsync } = useSignMessage()
    const [cookies, setCookie, removeCookie] = useCookies(["access-token"])
    const [loading, setLoading] = useState(true)
    const [personalData, setPersonalData] = useState({ connected: false })
    const dispatch = useNotification()

    const signWithEth = async() =>{
        setLoading(true)
        const nonce = await fetch("http://localhost/api/get_nonce?public_address="+address).then(r=>r.json()).catch(e=>console.log)
        console.log(nonce)
        const signature = await signMessageAsync({
            message: "nonce:" + nonce,
        })
        const result = await fetch("http://localhost/api/authenticate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                public_address: address,
                signed_nonce: signature,
            }),
        }).then(r=>r.json()
        ).catch(e=>console.log)
        setLoading(false)
        console.log(result)
        if (result.access_token) {
            dispatch({
                type: "success",
                message: "Login Successful",
                title: "Success",
                position: "topR",
            })
            setCookie("jwt", result)
        } else {
            dispatch({
                type: "error",
                message: "Invalid Signature or address",
                title: "Invalid Signature",
                position: "topR",
            })
        }
    }

    const logoutEth = async() =>{
        removeCookie("jwt")
    }

    const disconnectAadhar = async () => {
        const result = await fetch("http://localhost/api/disconnect_aadhar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ wallet_address: address }),
        })
            .then((r) => r.json())
            .catch((e) => console.log)
        console.log(result)
    }

    useEffect(() => {
        fetch("http://localhost/api/is_connnected?wallet_address=" + address)
            .then(async (r) => {
                let result = await r.json()
                setLoading(false)
                console.log(result)
                if (result.found) {
                    setPersonalData({ connected: true, ...result })
                }
            })
            .catch((e) => console.log(e))
    }, [])
    // if (cookies["jwt"] && cookies["jwt"].access_token) {
    //     return (
    //         <div className="mt-40">
    //             <p>Welcome</p>
    //         </div>
    //     )
    // }
    if (loading) {
        console.log("sss")
        return(
        <div className="mt-40">
            <PuffLoader color="#36d7b7" />
        </div>
        )
    }
    return (
        <div className="mt-32 p-4">
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
                            {(cookies["jwt"] && cookies["jwt"].access_token) ? <><p>Signed in with ETH</p> <button onClick={logoutEth}>Logout</button></>:<button onClick={signWithEth}>Sign in with eth</button>}

                        </div>
                    )}
                    {personalData.connected && (
                        <div>
                            <p>
                                {personalData.firstName} {personalData.lastName}
                            </p>
                            <p>**** **** {personalData.endsWith}</p>
                            <p className="font-nunito ml-2 font-semibold text-sm">
                                {data?.formatted}
                            </p>
                            <p className=" ml-1.5 text-xs font-nunito font-bold">{data?.symbol}</p>
                            <button onClick={disconnectAadhar}>Disconnect</button>
                            {(cookies["jwt"] && cookies["jwt"].access_token) ? <><p>Signed in with ETH</p> <button onClick={logoutEth}>Logout</button></>:<button onClick={signWithEth}>Sign in with eth</button>}
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
