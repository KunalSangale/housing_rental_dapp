import React from "react";
import FeatureCard from "../components/Listings/FeatureCard.js"
import "../styling/Details.css";
import { useLocation } from "react-router-dom";
import {Link} from "react-router-dom";
import { formatEther } from "@ethersproject/units";
import {BigNumber} from "@ethersproject/bignumber";
import { UnitContext } from "../hooks/useUnitInfo";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
const Details=({item})=>{
   const location=useLocation();
   //const cid='bafybeibrt6umyur25f3enyzjylfeqzj2p45n3wxlbwcwobighcg34iqds4';
   const data=location.state?.data;
  //  function getAccessToken () {
  //   return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU5RUE0MmEzMTdjMDg0RDgxRDFhZmJmNjI4YzY0QkRlMDM3NDA2OTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njk4MTU0NTE5NTgsIm5hbWUiOiJyZW50YWxfZGFwcCJ9.hMgHoqG5eQzAUI_Rfuu8bkGaVo7kXMKUWgBNoSIYa6I"
  // }
  //  function makeStorageClient () {
  //   return new Web3Storage({ token: getAccessToken() })
  // }
  //  async function retrieve (cid) {
  //   const client = makeStorageClient()
  //   const res = await client.get(cid)
  //   console.log(`Got a response! [${res.status}] ${res.statusText}`)
  //   if (!res.ok) {
  //     throw new Error(`failed to get ${cid}`)
  //   }
  //console.log(retrieve(cid))
   console.log(data,"data");
    return (
    <div className="home-container">
      <div className="home-container2">
        <img
          src={"https://"+data.cid+".ipfs.dweb.link"}
          alt="image"
          className="home-image"
        />
        <div className="home-container3">
          <div className="home-features">
            <div className="home-container4">
            <FeatureCard title={"1 Bedroom"} description={"Number of Bedrooms"}></FeatureCard>
                <FeatureCard title={"1 Bathroom"} description={"Number of Bathrooms"}></FeatureCard>
                <FeatureCard title={"Immediately"} description={"Possession"}></FeatureCard>
                <FeatureCard title={"Family"} description={"Preferred Tenant"}></FeatureCard>
                <FeatureCard title={"Dec 6 2022"} description={"Posted On"}></FeatureCard>
                <FeatureCard title={"Yes"} description={"Balcony"}></FeatureCard>
                <FeatureCard title={"<10"} description={"Age of Building"}></FeatureCard>
                <FeatureCard title={"Area"} description={"500 sqft"}></FeatureCard>
            </div>
          </div>
        </div>
      </div>
            <div className="home-features1">
                <h1 className="home-text">Overview</h1>
                <div className="home-container1">
                <FeatureCard title={"Unit Number"} description={parseInt(data.unitNumber._hex,16)}></FeatureCard>
                <FeatureCard title={"Unit Address"} description={data.unitAddress}></FeatureCard>
                <FeatureCard title={"Rent"} description={formatEther(BigNumber.from(parseInt(data.rent._hex,16).toString()))}></FeatureCard>
                <FeatureCard title={"Deposit"} description={formatEther(BigNumber.from(parseInt(data.deposit._hex,16).toString()))}></FeatureCard>
                <FeatureCard title={"Water Supply"} description={"Corporation"}></FeatureCard>
                <FeatureCard title={"Gated Security"} description={"Yes"}></FeatureCard>
                <FeatureCard title={"Floor"} description={"6"}></FeatureCard>
                <FeatureCard title={"Furnishing Status"} description={"Furnished"}></FeatureCard>
                {/* // <div className="feature-card">Unit Number:{parseInt(data.unitNumber._hex,16)}</div>
                // <div className="feature-card">Unit Address:{(data.unitAddress)}</div>
                // <div className="feature-card">Rent:{formatEther(BigNumber.from(parseInt(data.rent._hex,16).toString()))} ETH per month</div>
                // <div className="feature-card">Deposit:{formatEther(BigNumber.from(parseInt(data.deposit._hex,16).toString()))} ETH</div> */}
                </div>
                </div>
            </div>
    );
};
export default Details;