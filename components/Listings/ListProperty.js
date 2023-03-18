import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import PropertyView from "./PropertyView"
import { useState } from "react"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import { watchContractEvent } from "@wagmi/core"
export default (props) => {
    // const [fileList, setFileList] = useState(null)
    // const handleFileChange = (e) => {
    //     setFileList(e.target.files)
    // }
    const { address, isConnected } = useAccount()
    const [listenData, setListenData] = useState(null)
    const { data: signer, isError, isLoading } = useSigner()
    const contract = useContract({
        address: contractAddress.deployed_at,
        abi: housingConfig.abi,
        signerOrProvider: signer,
    })
    const [files, setFile] = useState([]);
    const [message, setMessage] = useState();
    const handleFile = (e) => {
        setMessage("");
        let file = e.target.files;

        for (let i = 0; i < file.length; i++) {
            const fileType = file[i]['type'];
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
            if (validImageTypes.includes(fileType)) {
                setFile([...files, file[i]]);
            } else {
                setMessage("only images accepted");
            }

        }
        //setFileList(e.target.files);
    }; 

    const removeImage = (i) => {
        setFile(files.filter(x => x.name !== i));
     }
   
    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData(e.target)
        try{
        files.forEach((file, i) => {
            data.append(`uploaded_files`, file, "x1")
        })
        
          data.append("property_id", props.active.SaleDeedNumber)
          data.append("eth_rent", data.get("eth_rent").toString())
          data.append("deposit", data.get("eth_deposit").toString())
        }
        catch(e){
          console.log(e);
        }
        data.append("latitude", "0.534234")
        data.append("longitude", "0.521312")
        data.append("details", "test 123")
        console.log("Stage 1... Uploading data to db")
        // 👇 Uploading the files using the fetch API to the server
        fetch("http://localhost/api/create_listing", {
            method: "POST",
            body: data,
        })
            .then((res) => res.json())
            .then(async (data) => {
                if (!data.error) {
                    console.log("Stage 2... Creating Listing in blockchain")
                    const transactionRes = await contract.createListing({
                        index: 0,
                        metadataID: data.metadata_id,
                        metadataHash: "has456456h",
                        landlord: address,
                    })
                    var unwatch
                    unwatch = watchContractEvent(
                        {
                            address: contractAddress.deployed_at,
                            abi: housingConfig.abi,
                            eventName: "ListingCreated",
                        },
                        (id, newListing, sender) => {
                            console.log(id, newListing, sender)
                            setListenData(id)
                            fetch("http://localhost/api/update_index", {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    wallet_address: address,
                                    property_id: props.active.SaleDeedNumber,
                                    index: parseInt(id.toString()),
                                }),
                            })
                                .then((r) => r.json())
                                .then((data) => {
                                    console.log("Stage 5: Done")
                                    console.log(data)
                                })
                                .catch((e) => console.log)
                            unwatch()
                        }
                    )
                    console.log("Stage 3... Waiting for block confirmations")
                    return transactionRes.wait(1)
                } else {
                    console.log("error")
                    throw new Error("listing already exists")
                }
            })
            .then((r) => {
                console.log("Stage 4... Confirmed")

                console.log(r)
            })
    }
    //const files = fileList ? [...fileList] : []
    return (
        <form class="flex flex-col w-full md:px-32 mt-32" onSubmit={handleSubmit}>
        <div class="flex flex-wrap -mx-3 mb-6 mt-100px">
          <div class="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-first-name">
              Property ID
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" type="text" name="propertyID" value={props.active.SaleDeedNumber} readOnly/>
          </div>
          <div class="w-full md:w-1/5 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-last-name">
              Area
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"  name="area" value={props.active.Area} readOnly/>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/2 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Address
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none  focus:border-gray-500"  name="address" value={props.active.Address} readOnly/>
          </div>
          <div class="w-full md:w-1/5 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-password">
              Pincode
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500"  name="pincode" value={props.active.Pincode} readOnly/>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
              Rent
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="eth_rent" type="number" min="0"step=".01"placeholder="Enter rent in ETH"/>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-city">
              Deposit
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="eth_deposit" type="number" min="0"step=".01"placeholder="Enter deposit in ETH"/>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
              Number of bedrooms
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="bhk">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
              Number of bathrooms
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="bathrooms">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-2">
           <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-state">
              Furnishing Status
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="furnish_status">
                <option>Fully Furnished</option>
                <option>Semi Furnished</option>
                <option>Not Furnished</option>
              </select>
              <div class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg class="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-2">
            <div class="w-full md:w-full px-3 mt-3 mb-6 md:mb-0">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                Other Amenities (Check all that apply)
              </label>
              <ul class="items-center w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg sm:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li class="w-full border-b border-gray-200  dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="vue-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="vue-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Parking</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="react-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="react-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Gym</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="angular-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="angular-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Balcony</label>
                      </div>
                  </li>
                  <li class="w-full dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="laravel-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Swimming Pool</label>
                      </div>
                  </li>
                  <li class="w-full dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="laravel-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Playground/Park</label>
                      </div>
                  </li>
                  <li class="w-full dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="laravel-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pet Friendly</label>
                      </div>
                  </li>
                  <li class="w-full dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="laravel-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Surviellance Cameras</label>
                      </div>
                  </li>
                  <li class="w-full dark:border-gray-600">
                      <div class="flex items-center pl-6">
                          <input id="laravel-checkbox-list" type="checkbox" value="" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Smart Home</label>
                      </div>
                  </li>
              </ul>
              
            </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-2">
                {/* <div class="rounded-lg shadow-xl bg-gray-50 md:w-1/2 w-[360px]"> */}
                    <div class="m-4">
                    <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2" for="grid-zip">
                      Upload Images
                    </label>
                        <div class="flex items-center justify-center w-full">
                            <label class="flex cursor-pointer flex-col w-full h-32 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
                                <div class="flex flex-col items-center justify-center pt-7">
                                    <svg xmlns="http://www.w3.org/2000/svg"
                                        class="w-12 h-12 text-gray-400 group-hover:text-gray-600" viewBox="0 0 20 20"
                                        fill="currentColor">
                                        <path fill-rule="evenodd"
                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            clip-rule="evenodd" />
                                    </svg>
                                    <p class="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                        Select a photo</p>
                                </div>
                                <input type="file" onChange={handleFile} class="opacity-0" multiple="multiple" name="files[]" />
                            </label>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {files.map((file, key) => {
                                return (
                                    <div key={key} className=" relative">
                                        <i onClick={() => { removeImage(file.name) }} className="h-2 w-2  absolute right-1 hover:text-white cursor-pointer">
                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 15 15"><path fill="currentColor" fill-rule="evenodd" d="M12.854 2.854a.5.5 0 0 0-.708-.708L7.5 6.793L2.854 2.146a.5.5 0 1 0-.708.708L6.793 7.5l-4.647 4.646a.5.5 0 0 0 .708.708L7.5 8.207l4.646 4.647a.5.5 0 0 0 .708-.708L8.207 7.5l4.647-4.646Z" clip-rule="evenodd"/></svg>
                                        </i>
                                        <img className="h-30 w-40 rounded-md" src={URL.createObjectURL(file)} />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
          </div>
          <div class="md:flex md:items-center">
    <div class="md:w-2/3">
      <button class="bg-blue-500 h-fit px-8 py-2 text-sm text-white font-nunito rounded-md font-bold" type="submit">
        Submit
      </button>
    </div>
  </div>
      </form> 
       
    );
    
}

