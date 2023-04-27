import React from 'react';
import { useEffect, useState } from "react"
import { useAccount, useContract, useSigner  } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import {useCollapse} from 'react-collapsed';
import AgrementForm from './AgreementForm';
export default (props) => {


    const [isOpen, setIsOpen] = useState(false);
 
  const togglePopup = () => {
    setIsOpen(!isOpen);
  }
    
    const { address, isConnected } = useAccount()
    const { data: signer, isError } = useSigner()
    const [index,setIndex]=useState(null)
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    // const [dataLists, setData] = useState({ properties: [], listings: [] })
    const [properties, setProperties] = useState([])
    const [listings, setListings] = useState([])

    const unlistProperty = (property_id) => {
        // console.log(property_id)
        fetch("http://localhost/api/unlist", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ wallet_address: address, property_id: property_id }),
        })
            .then((r) => r.json())
            .then((data) => {
                console.log(data)
                if (data.found) {
                    let newListings = [...listings]
                    newListings = newListings.filter((obj) => obj.property_id !== property_id)
                    setListings(newListings)
                }
            })
            .catch((e) => console.log)
    }

    useEffect(() => {
        if (isConnected) {
            fetch("http://localhost/api/get_properties", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wallet_address: address,
                }),
            })
                .then((r) => r.json())
                .then((r) => {
                    setProperties(r)
                })
                .catch((e) => console.log)
            fetch("http://localhost/api/get_listings", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    wallet_address: address,
                }),
            })
                .then((r) => r.json())
                .then((r) => {
                    setListings(r)
                    console.log(r)
                })
                .catch((e) => console.log)
        }
    }, [])
    const [trnx,setTrnx]=useState([])
    const getProposals=async (index)=>{
        //e.preventDefault()
        setTrnx(await contract.getProposals(index))
        console.log(trnx)
        return trnx
    }
    
    //const [ isExpanded, setExpanded ] = useState();
    const { getCollapseProps, getToggleProps ,isExpanded} = useCollapse();
    const handleOnClick=(index)=>{
        //setExpanded(!isExpanded);
    }
    if (!isConnected) {
        return <p className="mt-32">Please Connect Wallet first</p>
    }
    return (
        <div className="mt-32 w-full flex-col space-y-6 md:px-40">
            <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide">
                PROPERTY LISTINGS
            </h4>
            {listings.map((e, i) => {
                return (
                    <div className="bg-gray-50 rounded border"
                    key={i}>
                    <div
                        className="p-4 w-full  flex justify-between"     
                    >
                        <div>
                            <p>{e.Address}</p>
                            <p>{e.Area}</p>
                            <p>{e.Pincode}</p>
                            <p>{e.property_id}</p>
                        </div> 
                        <button
                            className="bg-blue-500 h-fit  px-8 py-2 text-sm text-white font-nunito rounded-md font-bold"
                            onClick={() => unlistProperty(e.property_id)}
                        >
                            UNLIST
                        </button>
                        </div>
                        <div className="" {...getToggleProps()}>
                        <button
                            className="bg-blue-500 h-fit  px-8 py-2 text-sm text-white font-nunito rounded-md font-bold"
                           
                            onClick={() => {{getProposals(e.listing_index)}}}
                        >
                            View Proposals
                        </button>
                        </div>
                        {isExpanded?
                            <div>
                        {trnx.map((x, ind) => {
                            return (
                            <div
                            key={ind}>
                            <p className='mt-8'>Proposal from: {x}
                            <button
                            className="bg-blue-500 h-fit ml-[200px] px-8 py-2 text-sm text-white font-nunito rounded-md font-bold"
                            onClick={togglePopup}>
                            Accept Proposal
                        </button></p>
                        {isOpen && <AgrementForm
                        index={e.listing_index}
                        address={x}
                            handleClose={togglePopup}
                          />}
                        </div>)})} 
                        
                        </div>:""}
                        
                        {/* <div {...getCollapseProps()}>
            <div className="padding: 6px;
    background-color: #eeeeee;">
                
                Now you can see the hidden content. <br/><br/>
                Click again to hide...
            </div>
        </div> */}
                    </div>
                )
            })}
            <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide">
                UNLISTED PROPERTIES
            </h4>
            {properties.map((e, i) => {
                return (
                    <div
                        className="py-4 px-8 w-full bg-gray-50 rounded border flex items-center justify-between"
                        key={i}
                    >
                        <div>
                            <p>{e.Address}</p>
                            <p>{e.Area}</p>
                            <p>{e.Pincode}</p>
                            <p>{e.SaleDeedNumber}</p>
                        </div>
                        <button
                            className="bg-blue-500 h-fit px-8 py-2 text-sm text-white font-nunito rounded-md font-bold"
                            onClick={() => props.changeActive(e)}
                        >
                            LIST
                        </button>
                        
                    </div>
                )
            })}
        </div>
    )
}
