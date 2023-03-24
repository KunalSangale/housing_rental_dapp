import React from "react";
import FeatureCard from "../components/Listings/FeatureCard.js"
import { useState } from "react";
import {ImCross} from 'react-icons/im'
import {AiFillCheckCircle} from 'react-icons/ai'
import { BsChevronCompactLeft, BsChevronCompactRight } from 'react-icons/bs';
import { RxDotFilled } from 'react-icons/rx';
import { useRouter } from 'next/router'
import Head from "next/head"
import Navbar from "@/components/Navbar/Navbar"

const Details=({item})=>{
    const router=useRouter();
    const data=router.query;
    var furnish_status="";
    switch(data.furnish_status){
        case "1":
            furnish_status="Fully Furnished"
            break;
        case "2":
            furnish_status="Semi Furnished"
            break;
        case "3":
            furnish_status="Not Furnished"
            break;
        default:
            break;
            
    }
    const slides = [
        {
          url: '/apt2.jpeg',
        },
        {
          url: '/apt4.jpeg',
        },
        {
          url: 'https://images.unsplash.com/photo-1661961112951-f2bfd1f253ce?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2672&q=80',
        },
    
        {
          url: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2253&q=80',
        },
        {
          url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2671&q=80',
        },
      ];
    
      const [currentIndex, setCurrentIndex] = useState(0);
    
      const prevSlide = () => {
        const isFirstSlide = currentIndex === 0;
        const newIndex = isFirstSlide ? slides.length - 1 : currentIndex - 1;
        setCurrentIndex(newIndex);
      };
    
      const nextSlide = () => {
        const isLastSlide = currentIndex === slides.length - 1;
        const newIndex = isLastSlide ? 0 : currentIndex + 1;
        setCurrentIndex(newIndex);
      };
    
      const goToSlide = (slideIndex) => {
        setCurrentIndex(slideIndex);
      };
  
    return (
        <>
        <Head>
        <title>Rento</title>
        <meta name="description" content="Decentralized Housing Rental Platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <Navbar />
    <div className="home-container">
      <div className="home-container2">
      <div className='max-w-[1400px] h-[500px] w-full m-auto  relative group'>
      <div
        style={{ backgroundImage: `url(${slides[currentIndex].url})` }}
        className='w-full h-full rounded-2xl bg-center bg-cover duration-500'
      ></div>
      {/* Left Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] left-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactLeft onClick={prevSlide} size={30} />
      </div>
      {/* Right Arrow */}
      <div className='hidden group-hover:block absolute top-[50%] -translate-x-0 translate-y-[-50%] right-5 text-2xl rounded-full p-2 bg-black/20 text-white cursor-pointer'>
        <BsChevronCompactRight onClick={nextSlide} size={30} />
      </div>
      <div className='flex top-4 justify-center py-2'>
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            onClick={() => goToSlide(slideIndex)}
            className='text-2xl cursor-pointer'
          >
            <RxDotFilled />
          </div>
        ))}
      </div>
    </div>
        {/* <img
          src="/apt2.jpeg"
          alt="image"
          className="home-image"
        />  */}
        <div className="home-container3">
          <div className="home-features">
          <h1 className="home-text">Overview</h1>
            <div className="home-container4">
            <FeatureCard title={data.eth_rent +" ETH/month"} description={"Rent"}></FeatureCard>
            <FeatureCard title={data.deposit+" ETH"} description={"Deposit"}></FeatureCard>
            <FeatureCard title={(data.bhk)} description={"Number of Bedrooms"}></FeatureCard>
                <FeatureCard title={(data.bathrooms)} description={"Number of Bathrooms"}></FeatureCard>
                <FeatureCard title={"Address"} description={"Address"}></FeatureCard>
                <FeatureCard title={"Family"} description={"Preferred Tenant"}></FeatureCard>
                <FeatureCard title={data.property_id} description={"Property ID"}></FeatureCard>
                <FeatureCard title={furnish_status} description={"Furnishing Status"}></FeatureCard>
                <FeatureCard title={(data.area)+ " sqft"} description={"Area"}></FeatureCard>
            </div>
          </div>
        </div>
      </div>
            <div className="home-features1">
                <h1 className="home-text">Amenities</h1>
                <div className="home-container1">
                <ul class="flex flex-col sm:flex-row">
{data.hasGym=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Gym <AiFillCheckCircle/>
  </li>:<></>}
  {data.hasParking=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Parking <AiFillCheckCircle/>
  </li>:<></>}
  {data.hasBalcony=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Balcony <AiFillCheckCircle/>
  </li>:<></>}
  {data.hasPool=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Pool <AiFillCheckCircle/>
  </li>:<></>}
  {data.hasPark=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Park <AiFillCheckCircle/>
  </li>:<></>}
  {data.hasCameras=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Surviellance Cameras <AiFillCheckCircle/>
  </li>:<></>}
  {data.isPetFriendly=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Pet Friendly <AiFillCheckCircle/>
  </li>:<></>}
  {data.isSmartHome=="true"? <li class="inline-flex items-center gap-x-2.5 py-3 px-4 text-md font-medium bg-white border text-gray-800 -mt-px first:rounded-t-lg first:mt-0 last:rounded-b-lg sm:-ml-px sm:mt-0 sm:first:rounded-tr-none sm:first:rounded-bl-lg sm:last:rounded-bl-none sm:last:rounded-tr-lg dark:bg-gray-800 dark:border-gray-700 dark:text-white">Smart Home <AiFillCheckCircle/>
  </li>:<></>}
</ul>
                {/* <FeatureCard title={"Unit Number"} description={(data.property_id)}></FeatureCard>
                <FeatureCard title={"Unit Address"} description={data.address}></FeatureCard>
                <FeatureCard title={"Rent"} description={data.eth_rent} ></FeatureCard>
                <FeatureCard title={"Deposit"} description={data.deposit}></FeatureCard>
                <FeatureCard title={"Water Supply"} description={"Corporation"}></FeatureCard>
                <FeatureCard title={"Gated Security"} description={"Yes"}></FeatureCard>
                <FeatureCard title={"Floor"} description={"6"}></FeatureCard>
                <FeatureCard title={"Furnishing Status"} description={data.furnish_status}></FeatureCard> */}
                {/* // <div className="feature-card">Unit Number:{parseInt(data.unitNumber._hex,16)}</div>
                // <div className="feature-card">Unit Address:{(data.unitAddress)}</div>
                // <div className="feature-card">Rent:{formatEther(BigNumber.from(parseInt(data.rent._hex,16).toString()))} ETH per month</div>
                // <div className="feature-card">Deposit:{formatEther(BigNumber.from(parseInt(data.deposit._hex,16).toString()))} ETH</div> */}
                </div>
                </div>
            </div>
            </>
    );
};
export default Details;