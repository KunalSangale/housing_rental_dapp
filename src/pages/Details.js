import React from "react";
import ListingItem from "../components/Listings/ListingItem"
import { useLocation } from "react-router-dom";
import {Link} from "react-router-dom";
import { formatEther } from "@ethersproject/units";
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
        <div>
            <h1>{parseInt(data.unitNumber._hex,16)}</h1>
        </div>
    )
}
export default Details;