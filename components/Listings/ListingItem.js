import React from "react";
import {Link,BrowserRouter} from "react-router-dom";
import { useState,useEffect } from "react";


const ListingItem = () => {
    const [listings, setListings] = useState([]);
useEffect(() => {
        fetch("http://localhost/api/get_all_listings", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then((r) => r.json())
            .then((r) => {
                setListings(r)
                console.log(r);
            })
            .catch((e) => console.log(e))
}, [])

  return (
    <div>
         <h4 className="text font-semibold text-slate-800 border-b w-full tracking-wide ">
                PROPERTY LISTINGS
            </h4>
            {listings.map((e, i) => {
                return (
                        <div class="pt-5 mt-10 max-w-sm rounded overflow-hidden shadow-lg" key={i}>
                        <img class="w-full" src="/img/card-top.jpg" alt="Property Image"/>
                        <div class="px-10 py-9">
                            <p class="pb-2 text-gray-700">
                            Rent:<span class="p-2 inline text-black-900 font-semibold">{e.eth_rent} ETH/mo</span>
                            </p>
                            <p class="pb-2 text-gray-700 text-base">
                            Deposit:<span class="p-2 inline text-black-900 font-semibold">{e.deposit} ETH</span>
                            </p>
                            <p class="pb-2 text-gray-700 text-base">
                            Details:<span class="p-2 inline text-black-900 font-semibold">{e.details}</span>
                            </p>
                        </div>
                        <div class="px-6 pt-4 pb-8">
                        <div className="card-actions justify-end">
                        <button className="text-white bg-blue-700 ml-3 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-3 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Get Details</button>
                        </div>
                        </div>
                        </div>
                    )
            })}
        </div>
      
  );
};

export default ListingItem;
