import React, { useEffect, useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { ethers } from "ethers";
import ETHlogo from '../../static/eth-logo.png'
import PulseLoader from "react-spinners/PulseLoader";
import { useCookies } from 'react-cookie';
export default () => {
    const [cookies, setCookie, removeCookie] = useCookies(['kyc']);
    const [activeStep, setStep] = useState(1)
    const { active, account } = useWeb3React();
    const { error, setError } = useState(null)
    const [isLoading, setLoading] = useState(false)
    const [formData, setFormData] = useState({id_type:"1"})

    const handleChange = (e, i) => {
        setFormData({ ...formData, [i]: e.target.value })
    }

    useEffect(() => {
        if (cookies.access_token && cookies.access_token !== null) {
            setStep(2)
        }
        console.log(cookies.access_token)
    }, [])
    const handleLogin = () => {
        setLoading(true)
        const publicAddress = account
        fetch(`http://localhost/api/get_nonce?public_address=${publicAddress}`).then(response => response.text()).then(async (result) => {
            try {
                await window.ethereum.send("eth_requestAccounts")
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const signature = await signer.signMessage("nonce:" + result);
                const address = await signer.getAddress();
                const rawResponse = await fetch('http://localhost/api/authenticate', {
                    method: 'POST',
                    mode:'no-cors',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ signed_nonce: signature, public_address: address })
                });
                return rawResponse.json()
            }
            catch (err) {
                setError(err.message);
                setLoading(false)
            }
        }).then(result => {
            console.log(result)
            setCookie('access_token', result.access_token, { path: '/' });
            setStep(2)
            setLoading(false)
        })
    }
    const handleSubmit = async() => {
        console.log(formData)
        const rawResponse = await fetch('http://localhost/api/update_details  ', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ ...formData,wallet_address:account })
                });
        console.log(rawResponse.json())
    }
    return (
        <>
            {activeStep == 1 &&
                (<div className="w-3/12 mx-auto border border-2 bg-white drop-shadow-md p-8 rounded-md flex flex-col items-center mt-16 space-y-4">

                    <h3 className="font-bold text-3xl">
                        Step 1: Login
                    </h3>
                    <p className="text-center font-light text-slate-600">
                        This step is required to confirm that you are the actual owner of your ethereum wallet.
                    </p>
                    <img className=" ml-1 scale-50" src={ETHlogo} />
                    <button className="rounded-full w-80 p-4 bg-blue-600 text-white text-l font-bold hover:bg-blue-800" disabled={isLoading} onClick={handleLogin}>{isLoading ? (<PulseLoader
                        color={"#ffffff"}
                        loading={true}
                        size={8}
                        aria-label="Loading Spinner"
                        data-testid="loader"
                    />) : "Login with Metamask"}</button>

                </div>)}
            {activeStep == 2 && (<div className="w-3/12 min-w-[600px] mx-auto border border-2 bg-white drop-shadow-md p-8 rounded-md flex flex-col items-center mt-16 space-y-4">

                <h3 className="font-bold text-3xl">
                    Step 2: Enter Details
                </h3>
                <p className="text-center font-light text-slate-600">
                    Enter personal details for verification
                </p>
                <div className=" flex flex-col space-y-4 pb-6">
                    <div className=" flex justify-center space-x-6">
                        <input type="text" className="w-2/6 border rounded-md px-4 py-2" placeholder="First Name" onChange={e => handleChange(e, "first_name")} />
                        <input type="text" className="w-2/6 border rounded-md px-4 py-2" placeholder="Last Name" onChange={e => handleChange(e, "last_name")} />
                    </div>
                    <div className=" flex justify-center space-x-6">
                        <input type="number" className="w-2/6 border rounded-md px-4 py-2" placeholder="Mobile No" onChange={e => handleChange(e, "phone_number")} />
                        <input type="email" className="w-2/6 border rounded-md px-4 py-2" placeholder="Email" onChange={e => handleChange(e, "email")} />
                    </div>
                    <div className=" flex justify-center space-x-6">
                        <select value={formData.id_type} className="w-2/6 border bg-white rounded-md px-4 py-2" placeholder="Mobile No" onChange={e => handleChange(e, "id_type")}>
                            <option value="1">Passport</option>
                            <option value="2">Aadhar</option>
                            <option value="3">PAN Card</option>
                        </select>
                        <input type="text" className="w-2/6 border rounded-md px-4 py-2" placeholder="ID" onChange={e => handleChange(e, "id_number")} />
                    </div>

                </div>
                <button className="rounded-full w-80 p-4 bg-blue-600 text-white text-l font-bold hover:bg-blue-800" disabled={isLoading} onClick={handleSubmit}>{isLoading ? (<PulseLoader
                    color={"#ffffff"}
                    loading={true}
                    size={8}
                    aria-label="Loading Spinner"
                    data-testid="loader"
                />) : "Submit"}</button>

            </div>)}
        </>

    )
}