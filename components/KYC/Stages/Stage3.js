import { useState } from "react"
import PulseLoader from "react-spinners/PulseLoader"
import { VerifyCode } from "@web3uikit/core"
import { useAccount, useSignMessage } from "wagmi"
import { useNotification } from "@web3uikit/core"
export default (props) => {
    const [loading, setLoading] = useState(false)
    const { address, isConnected } = useAccount()
    const { signMessageAsync } = useSignMessage()
    const dispatch = useNotification()
    const handleSubmit = async (OTPCode) => {
        setLoading(true)
        const signature = await signMessageAsync({
            message: "nonce:" + OTPCode,
        })
        const result = await fetch("http://localhost/api/authenticate_user", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                public_address: address,
                aadharno: props.aadhar.replaceAll(" ", ""),
                signed_nonce: signature,
            }),
        })
        console.log(result)
        let data1 = await result.json()
        console.log(data1)
        setLoading(false)
        if (data1.access_token) {
            dispatch({
                type: "info",
                message: "Your Aadhar login OTP is " + data1.access_token,
                title: "Aadhar Login OTP",
                position: "topR",
            })
            props.handleStage(true)
        } else {
            dispatch({
                type: "error",
                message: "Couldn't find the specified aadhar in the database",
                title: "Invalid Aadhar ID",
                position: "topR",
            })
        }
    }

    return (
        <div className="w-5/12 mx-auto border border-2 bg-white drop-shadow-md p-8 rounded-md flex flex-col items-center mt-24 space-y-4">
            <h3 className="font-bold text-3xl">Step 2: Enter OTP</h3>
            <p className="text-center font-light text-slate-600">
                This step is required to confirm that you are the actual owner of your aadhar ID
                and ethereum wallet.
            </p>
            {/* <img className=" ml-1 scale-50" src={ETHlogo} />
             */}
            <VerifyCode
                length={6}
                placeholder="X"
                autoFocus
                label="Enter OTP"
                onCompleted={handleSubmit}
            />
            <button
                className="rounded-full w-80 p-4 bg-blue-600 text-white text-l font-bold hover:bg-blue-800"
                disabled={loading}
                onClick={handleSubmit}
            >
                {loading ? (
                    <PulseLoader
                        color={"#ffffff"}
                        loading={true}
                        size={8}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />
                ) : (
                    "Login with Metamask"
                )}
            </button>
        </div>
    )
}
