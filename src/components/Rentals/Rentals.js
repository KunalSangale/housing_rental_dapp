import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";
import { parseEther } from "@ethersproject/units";
import { colors } from "../../theme";
// import { Button } from "../button";
// import p from "../p";
// import "../../App.css";
import "../../styling/Units.css";
import "../../styling/AddUnit.css";
import "../../styling/button.css";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'
import Navbar from '../Navbar'

import RentalsABI from "../../contracts/Rentals.json";

const CONFIRMATION_COUNT = 1;

const DetailsState = {
  LOADING: "LOADING",
  WAITING: "WAITING_CONFIRMATIONS",
  READY: "READY",
  ERROR: "ERROR",
  LISTED: "LISTED",
};

const Rentals = () => {
  const [status, setStatus] = useState(DetailsState.READY);
  const [unit, setUnit] = useState({
    unitAddress: "",
    rent: "",
    deposit: "",
    term: "",
    startDate: "",
    area:"",
    bhk: "",
    bathrooms: "",
    reraNumber: ""
  });
  const [mmError, setMmError] = useState(null);
  const [txHash, setTxHash] = useState(null);
  const { active, account, chainId } = useWeb3React();
  const rentalsAddress = RentalsABI.networks[1337].address;
  const contract = new useContract(rentalsAddress, RentalsABI.abi);
  const [radioValue, setRadioValue] = useState('1');

  const radios = [
    { name: 'Yes', value: '1' },
    { name: 'No', value: '0' },
  ];
  const handleInputChange = (event) => {
    setUnit({ ...unit, [event.target.name]: event.target.value });
  };


function getAccessToken () {
  // If you're just testing, you can paste in a token
  // and uncomment the following line:
  // return 'paste-your-token-here'

  // In a real app, it's better to read an access token from an
  // environement variable or other configuration that's kept outside of
  // your code base. For this to work, you need to set the
  // WEB3STORAGE_TOKEN environment variable before you run your code.
  return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGU5RUE0MmEzMTdjMDg0RDgxRDFhZmJmNjI4YzY0QkRlMDM3NDA2OTkiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2Njk4MTU0NTE5NTgsIm5hbWUiOiJyZW50YWxfZGFwcCJ9.hMgHoqG5eQzAUI_Rfuu8bkGaVo7kXMKUWgBNoSIYa6I"
}

function makeStorageClient () {
  return new Web3Storage({ token: getAccessToken() })
}
function getFiles () {
  const fileInput = document.querySelector('input[type="file"]')
  return fileInput.files
}
async function storeFiles () {
  const files=getFiles()
  const client = makeStorageClient()
  const cid = await client.put(files,{wrapWithDirectory:false})
  console.log('stored files with cid:', cid)
  return cid
}

  const AddUnit = async (event) => {
    setStatus(DetailsState.LOADING);
    
    try {
      const cid=await storeFiles()
      setStatus(DetailsState.WAITING);
      event.preventDefault();
      setUnit({
        unitAddress: "",
        rent: "",
        deposit: "",
        area:"",
        bhk:"",
        bathrooms:"",
        reraNumber: ""
        // preferredTenant:""
      });
      const { unitAddress ,rent, deposit,area,bhk,bathrooms,reraNumber} = unit;
      const txn = await contract.addUnit(
        unitAddress,
        String(cid),
        parseEther(rent),
        parseEther(deposit),
        area,
        bhk,
        bathrooms,
        reraNumber,
        // preferredTenant,
        {
          from: account,
        }
      );

      const confirmations = chainId === 1337 ? 1 : CONFIRMATION_COUNT;
      await txn.wait(confirmations);
      setTxHash(txn.hash);
      console.log("Hash of the transaction: " + { txHash });
      setStatus(DetailsState.LISTED);
    } catch (error) {
      setStatus(DetailsState.ERROR);
      console.log("An error occured: ", error);
      if (error.code && typeof error.code === "number") {
        setMmError(error.message);
      }
    }
  };

  const { LOADING, WAITING, READY, LISTED, ERROR } = DetailsState;

  return (
    <>
    <Navbar />
    <div className="mt-10 m-auto w-fit border rounded-xl py-8 px-16  shadow-xl">
      <h3 className="font-nunito text-2xl font-bold">LIST PROPERTY</h3>
      <div className="flex flex-row items-start">
        <div className="mt-8 ">
          <div className="bg-slate-100 min-w-fit text-slate-600 font-bold font-nunito h-80 w-[36rem] text-center rounded border"> 
          <span class="material-symbols-outlined text-5xl mt-32">
add_a_photo
</span>
          </div>
        </div>

      <div className="">
        <div className="addunit__wrapper">
          {(status === LOADING ||
            status === WAITING) && (
              <div className="custom-box">
                {status === LOADING && (<p color="white" t4>
                    Uploading...
                  </p>)}
                {status === WAITING && (
                  <p color="white" t4>
                    The unit will be listed after {CONFIRMATION_COUNT} block
                    confirmations.
                  </p>
                )}
              </div>
            )}
          {status === READY && (
            <form className="custom-form" onSubmit={AddUnit}>
              <label className="custom-input wide-input">
                <input
                  type="p"
                  value={unit.unitAddress.unitAddress}
                  name="unitAddress"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Address </span>
              </label>
              <label className="custom-input">
                <input
                  type="p"
                  value={unit.reraNumber.reraNumber}
                  name="reraNumber"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder">RERA Number</span>
              </label>
              <label className="custom-input">
                <input
                  type="int"
                  value={unit.rent.rent}
                  name="rent"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Rent </span>
              </label>
              <label className="custom-input">
                <input
                  type="int"
                  value={unit.deposit.deposit}
                  name="deposit"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Deposit </span>
              </label>
              
              <label className="custom-input">
              <input type="file" accept="image/*" name="img"/>
              <span className="placeholder">Choose Image</span>
              </label>
              <label className="custom-input">
                <input
                  type="p"
                  value={unit.bhk.bhk}
                  name="bhk"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Number of bedrooms</span>
              </label>
              <label className="custom-input">
                <input
                  type="p"
                  value={unit.bathrooms.bathrooms}
                  name="bathrooms"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Number of bathrooms</span>
              </label>
              <label className="custom-input">
                <input
                  type="int"
                  value={unit.area.area}
                  name="area"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder">Area (sqft)</span>
              </label>
              <label className="custom-input">
                <input
                  type="int"
                  // value={unit.floor.floor}
                  name="floor"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder">Floor</span>
              </label>
              {/* <label className="custom-input">
                <input
                  type="radio"
                  // value={unit.floor.floor}
                  name="furnished"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder">Furnishing Status</span>
              </label> */}
              {/* <label>
              <ButtonGroup>
              <span className="placeholder">Balcony?</span>
        {radios.map((radio, idx) => (
          <ToggleButton
            key={idx}
            id={`radio-${idx}`}
            type="radio"
            variant={idx % 2 ? 'outline-danger' : 'outline-success'}
            name="radio"
            value={radio.value}
            checked={radioValue === radio.value}
            onChange={(e) => setRadioValue(e.currentTarget.value)}
          >
            {radio.name}
          </ToggleButton>
        ))}
      </ButtonGroup>
      
      </label> */}
              <div className="">
                <button type="submit" className=" font-nunito font-bold py-4 px-16 bg-blue-600 rounded-full text-white hover:bg-blue-800">
                  LIST PROPERTY
                </button>
              </div>
            </form>
          )}
          {status === LISTED && !!txHash && (
            <div className="custom-box">
              <p
                t3
                color={colors.white}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                This unit has been listed.
              </p>
              <div
                style={{
                  marginLeft: "20px",
                }}

                onClick={() => setStatus(DetailsState.READY)}
              >
                BACK
              </div>
            </div>
          )}
          {status === ERROR && (
            <div className="custom-box">
              <p
                style={{ marginTop: "20px", marginBottom: "20px" }}
                color={colors.red}
              >
                {mmError || "Error encountered!"}
              </p>
              <div
                style={{
                  marginLeft: "20px",
                }}
                onClick={() => setStatus(DetailsState.READY)}
              >
                BACK
              </div>
            </div>
          )}
        </div>
      </div>
      </div>

      {/* <hr /> */}
    </div>
    </>

  );
};

export default Rentals;
