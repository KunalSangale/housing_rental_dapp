import React, { useState } from "react";
import { useWeb3React } from "@web3-react/core";
import { useContract } from "../../hooks/useContract";
import { parseEther } from "@ethersproject/units";
import ToggleSwitch from "./ToggleSwitch";
import ToggleButton from "react-bootstrap/ToggleButton";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { Spinner } from "react-bootstrap";
import { colors } from "../../theme";
import { Button } from "../button";
import Text from "../Text";
import "../../App.css";
import "../../styling/Units.css";
import "../../styling/AddUnit.css";
import "../../styling/button.css";
import { Web3Storage } from 'web3.storage/dist/bundle.esm.min.js'

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
    unitNumber: "",
    unitAddress: "",
    rent: "",
    deposit: "",
    term: "",
    startDate: "",
    area:"",
    bhk:"",
    bathrooms:"",
    preferredTenant:"",
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
        unitNumber: "",
        unitAddress: "",
        rent: "",
        deposit: "",
        term: "",
        startDate: "",
        area:""
        // bhk:"",
        // bathrooms:"",
        // preferredTenant:""
      });
      const { unitAddress ,rent, deposit, term, startDate,area} = unit;
      const txn = await contract.addUnit(
        unitAddress,
        String(cid),
        parseEther(rent),
        parseEther(deposit),
        term,
        startDate,
        area,
        // bhk,
        // bathrooms,
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
    <div className="units">
      <div className="addunit__container">
        <h1>List Your Property</h1>
        <div className="addunit__wrapper">
          {(status === LOADING ||
            status === WAITING) && (
              <div className="custom-box">
                {status === LOADING && (<Text color="white" t4>
                    Uploading...
                  </Text>)}
                {status === WAITING && (
                  <Text color="white" t4>
                    The unit will be listed after {CONFIRMATION_COUNT} block
                    confirmations.
                  </Text>
                )}
              </div>
            )}
          {status === READY && (
            <form className="custom-form" onSubmit={AddUnit}>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.unitNumber.unitNumber}
                  name="unitNumber"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />

                <span className="placeholder"> Unit Number </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
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
                <input
                  type="int"
                  value={unit.term.term}
                  name="term"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Term </span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  value={unit.startDate.startDate}
                  name="startDate"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Start Date </span>
              </label>
              <input type="file" accept="image/*" name="img"/>
              <label className="custom-input">
                <input
                  type="text"
                  //value={unit.bhk.bhk}
                  name="BHK"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder"> Number of bedrooms</span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  //value={unit.bathrooms.bathrooms}
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
                  name="area"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder">Floor</span>
              </label>
              <label className="custom-input">
                <input
                  type="text"
                  //value={unit.preferredTenant.preferredTenant}
                  name="area"
                  autoComplete="off"
                  onChange={handleInputChange}
                  required
                />
                <span className="placeholder">Preferred Tenant</span>
              </label>
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
              <div className="button-container">
                <button type="submit" className="custom-button">
                  LIST PROPERTY
                </button>
              </div>
            </form>
          )}
          {status === LISTED && !!txHash && (
            <div className="custom-box">
              <Text
                t3
                color={colors.white}
                style={{ marginTop: "20px", marginBottom: "20px" }}
              >
                This unit has been listed.
              </Text>
              <Button
                style={{
                  marginLeft: "20px",
                }}
                type="button"
                buttonStyle="btn--outline"
                onClick={() => setStatus(DetailsState.READY)}
              >
                BACK
              </Button>
            </div>
          )}
          {status === ERROR && (
            <div className="custom-box">
              <Text
                style={{ marginTop: "20px", marginBottom: "20px" }}
                color={colors.red}
              >
                {mmError || "Error encountered!"}
              </Text>
              <Button
                style={{
                  marginLeft: "20px",
                }}
                type="button"
                buttonStyle="btn--outline"
                onClick={() => setStatus(DetailsState.READY)}
              >
                BACK
              </Button>
            </div>
          )}
        </div>
      </div>

      <hr />
    </div>
  );
};

export default Rentals;
