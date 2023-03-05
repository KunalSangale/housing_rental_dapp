import { useState } from "react"
import PulseLoader from "react-spinners/PulseLoader"
import { InputNew } from "@web3uikit/core"
import { useNotification } from "@web3uikit/core"
export default (props) => {
    const [isLoading, setLoading] = useState(false)
    const dispatch = useNotification()
    // const [props.aadhar, setAadhar] = useState("")
    const handleSubmit = async () => {
        setLoading(true)
        const result = await fetch("http://localhost/api/get_otp", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ aadharno: props.aadhar.replaceAll(" ", "") }),
        })
        console.log(result)
        let data = await result.json()
        console.log(data)
        setLoading(false)
        if (data.otp) {
            dispatch({
                type: "info",
                message: "Your Aadhar login OTP is " + data.otp,
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

    const handleChange = (e) => {
        let formattedText = e.target.value.replace(" ", "")
        if (formattedText.length > 0) {
            formattedText = formattedText.match(new RegExp(".{1,4}", "g")).join(" ")
        }
        // console.log(formattedText)
        props.setAadhar(formattedText)
    }
    return (
        <div className="w-3/12 mx-auto border border-2 bg-white drop-shadow-md p-8 rounded-md flex flex-col items-center mt-32 space-y-4">
            <h3 className="font-bold text-3xl">Step 1: Login</h3>
            <p className="text-center font-light text-slate-600">
                This step is required to confirm that you are the actual owner of your ethereum
                wallet.
            </p>
            {/* <img className=" ml-1 scale-50" src={ETHlogo} />
             */}
            <InputNew
                label="Aadhar Number"
                placeholder="XXXX XXXX XXXX"
                value={props.aadhar}
                onChange={(e) => handleChange(e)}
            />
            <button
                className="rounded-full w-80 p-4 bg-blue-600 text-white text-l font-bold hover:bg-blue-800"
                disabled={isLoading}
                onClick={handleSubmit}
            >
                {isLoading ? (
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
