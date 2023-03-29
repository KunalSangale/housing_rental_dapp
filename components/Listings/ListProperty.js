import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import PropertyView from "./PropertyView"
import { useState } from "react"
import { useAccount, useContract, useSigner } from "wagmi"
import housingConfig from "../../../hardhat-rental/artifacts/contracts/HousingRental.sol/HousingRental.json"
import contractAddress from "../../hardhat.json"
import { watchContractEvent } from "@wagmi/core"



const DefaultLocation = { lat: 10, lng: 106 };
const DefaultZoom = 10;
export default (props) => {
  const [defaultLocation, setDefaultLocation] = useState(DefaultLocation);

  const [location, setLocation] = useState(defaultLocation);
  const [zoom, setZoom] = useState(DefaultZoom);

  function handleChangeLocation (lat, lng){
    const [show, setShow] = useState(false)

useEffect(
() => {
let timer = setTimeout(() => setShow(true), 1000);

  return () => {
    clearTimeout(timer);
  };
}, [])
    if(!show)return;
    setLocation({lat:lat, lng:lng});
  }
  
  function handleChangeZoom (newZoom){
    setZoom(newZoom);
  }

  function handleResetLocation(){
    setDefaultLocation({ ... DefaultLocation});
    setZoom(DefaultZoom);
  }
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
    const [files, setFile] = useState([])
    const [message, setMessage] = useState()
    const handleFile = (e) => {
        setMessage("")
        let file = e.target.files

        for (let i = 0; i < file.length; i++) {
            const fileType = file[i]["type"]
            const validImageTypes = ["image/gif", "image/jpeg", "image/png"]
            if (validImageTypes.includes(fileType)) {
                setFile([...files, file[i]])
            } else {
                setMessage("only images accepted")
            }
        }
        //setFileList(e.target.files);
    }

    const removeImage = (i) => {
        setFile(files.filter((x) => x.name !== i))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = new FormData(e.target)
        try{
        files.forEach((file, i) => {
            data.append(`uploaded_files`, file, "x1")
        })
        
          data.append("property_id", props.active.SaleDeedNumber)
          data.append("eth_rent", data.get("eth_rent").toString())
          data.append("deposit", data.get("eth_deposit").toString())
          data.append("bhk",data.get("bhk").toString())
          data.append("bathrooms",data.get("bathrooms"))
          data.append("furnish_status",data.get("furnish_status"))
          const hasGym=data.get("hasGym")=="TRUE"?true:false
          const isPetFriendly=data.get("isPetFriendly")=="TRUE"?true:false
          const hasPark=data.get("hasPark")=="TRUE"?true:false
          const hasParking=data.get("hasParking")=="TRUE"?true:false
          const hasPool=data.get("hasPool")=="TRUE"?true:false
          const hasBalcony=data.get("hasBalcony")=="TRUE"?true:false
          const hasCameras=data.get("hasCameras")=="TRUE"?true:false
          const isSmartHome=data.get("isSmartHome")=="TRUE"?true:false
          data.append("hasGym",hasGym)
          data.append("isPetFriendly",isPetFriendly)
          data.append("hasPark",hasPark)
          data.append("hasParking",hasParking)
          data.append("hasPool",hasPool)
          data.append("hasBalcony",hasBalcony)
          data.append("hasCameras",hasCameras)
          data.append("isSmartHome",isSmartHome)

          
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
                                    props.goBack()
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
      <div class="items-center justify-center ">
        <form class="flex flex-col w-full justify-center md:px-32 mt-28" onSubmit={handleSubmit}>
        <h4 className="text-4xl font-bold text-slate-800 mb-8 border-b w-full tracking-wide dark:text-white">
                List your property
            </h4>
        <div class="flex flex-wrap -mx-3 mb-6 mt-100px">
          <div class=" md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-first-name">
              Property ID
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-500 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500" type="text" name="propertyID" value={props.active.SaleDeedNumber} readOnly/>
          </div>
          <div class=" md:w-1/3 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-last-name">
              Area
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none  focus:border-gray-500"  name="area" value={props.active.Area} readOnly/>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-6">
          <div class="w-full md:w-1/3 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-password">
              Address
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none  focus:border-gray-500"  name="address" value={props.active.Address} readOnly/>
          </div>
          <div class="w-full md:w-1/3 px-3">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-password">
              Pincode
            </label>
            <input className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:border-gray-500"  name="pincode" value={props.active.Pincode} readOnly/>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-city">
              Rent
            </label>
            <input class="appearance-none block w-full  bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="eth_rent" type="number" min="0"step=".01"placeholder="Enter rent in ETH" required/>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-city">
              Deposit
            </label>
            <input class="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="eth_deposit" type="number" min="0"step=".01"placeholder="Enter deposit in ETH" required/>
          </div>
        </div>
        <div class="flex flex-wrap -mx-3 mb-2">
        <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-state">
              Number of bedrooms
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="bhk" required>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-zip">
              Number of bathrooms
            </label>
            <div class="relative">
              <select class="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="bathrooms" required>
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          </div>
          <div class="flex flex-wrap -mx-3 mb-2">
           <div class="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-state">
              Furnishing Status
            </label>
            <div className="relative">
              <select className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500" name="furnish_status">
                <option value={1}>Fully Furnished</option>
                <option value={2}>Semi Furnished</option>
                <option value={3}>Not Furnished</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>
          <div class="flex flex-wrap w-full -mx-3 mb-2">
            <div class="w-full md:w-2/3 pl-5 mt-3 mb-6 md:mb-0">
              <label class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white" for="grid-zip">
                Other Amenities (Check all that apply)
              </label>
              <ul class="items-center w-full md:w-full text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg md:flex dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="vue-checkbox-list" type="checkbox" name="hasParking" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="vue-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Parking</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="react-checkbox-list" type="checkbox" name="hasGym" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="react-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Gym</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="angular-checkbox-list" type="checkbox" name="hasBalcony" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="angular-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Balcony</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="laravel-checkbox-list" type="checkbox" name="hasPool" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Swimming Pool</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="laravel-checkbox-list" type="checkbox" name="hasPark" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Playground/Park</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="laravel-checkbox-list" type="checkbox" name="isPetFriendly" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Pet Friendly</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="laravel-checkbox-list" type="checkbox" name="hasCameras" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Surviellance Cameras</label>
                      </div>
                  </li>
                  <li class="w-full border-b border-gray-200 sm:border-b-0 sm:border-r dark:border-gray-600">
                      <div class="flex items-center px-2">
                          <input id="laravel-checkbox-list" type="checkbox" name="isSmartHome" value="TRUE" class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"/>
                          <label for="laravel-checkbox-list" class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300">Smart Home</label>
                      </div>
                  </li>
              </ul>
              
            </div>
          </div>
          <div class="flex flex-wrap w-full -mx-3 mb-2">
                {/* <div class="rounded-lg shadow-xl bg-gray-50 md:w-1/2 w-[360px]"> */}
                    <div class="m-4 w-full md:w-2/3 ">
                        <label
                            class="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2 dark:text-white"
                            for="grid-zip"
                        >
                            Upload Images
                        </label>
                        <div class="flex items-center justify-center w-full">
                            <label class="flex cursor-pointer flex-col w-full h-42 border-2 rounded-md border-dashed hover:bg-gray-100 hover:border-gray-300">
                                <div class="flex flex-col items-center justify-center h-42 p-7">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="w-12 h-22 text-gray-400 group-hover:text-gray-600"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fill-rule="evenodd"
                                            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                                            clip-rule="evenodd"
                                        />
                                    </svg>
                                    <p className="pt-1 text-sm tracking-wider text-gray-400 group-hover:text-gray-600">
                                        Select a photo
                                    </p>
                                </div>
                                <input
                                    type="file"
                                    onChange={handleFile}
                                    className="opacity-0"
                                    multiple="multiple"
                                    name="files[]"
                                    required
                                />
                            </label>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {files.map((file, key) => {
                                return (
                                    <div key={key} className=" relative">
                                        <i
                                            onClick={() => {
                                                removeImage(file.name)
                                            }}
                                            className="h-2 w-2  absolute right-1 hover:text-white cursor-pointer"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                width="10"
                                                height="10"
                                                viewBox="0 0 15 15"
                                            >
                                                <path
                                                    fill="currentColor"
                                                    fill-rule="evenodd"
                                                    d="M12.854 2.854a.5.5 0 0 0-.708-.708L7.5 6.793L2.854 2.146a.5.5 0 1 0-.708.708L6.793 7.5l-4.647 4.646a.5.5 0 0 0 .708.708L7.5 8.207l4.646 4.647a.5.5 0 0 0 .708-.708L8.207 7.5l4.647-4.646Z"
                                                    clip-rule="evenodd"
                                                />
                                            </svg>
                                        </i>
                                        <img
                                            className="h-30 w-40 rounded-md"
                                            src={URL.createObjectURL(file)}
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
          </div>
          <div class="md:flex  ">
          <div class="md:w-2/3  md:self-center">
            <button class="bg-blue-500 ml-[340px] mb-5  self-center px-[45px] py-[9px] text-md text-white font-nunito rounded-md font-bold" type="submit">
              Submit
            </button>
          </div>
        
        </div>
        </form>  
       </div>
       
    );
    
}
//AIzaSyAkBhTU6Tc8FNdu64ZRG4rPm2bin7H7OOI
