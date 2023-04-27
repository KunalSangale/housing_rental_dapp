import React from "react";
 
const Popup = (props) => {
    console.log(props.index)
    console.log(props.address)
  return (
    <div className="popup-box">
      <div className="box">
        <span className="close-icon" onClick={props.handleClose}>x</span>
        <div class="">
  <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
    <div class="mb-4">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Agreed Rent
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="eth_rent" type="number" min="0" step=".01" placeholder="Enter rent in ETH" required/>
    </div>
    <div class="mb-6">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Agreed Deposit
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="eth_deposit" type="number" min="0" step=".01" placeholder="Enter deposit in ETH" required/>
    </div>
    <div class="mb-8">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Start Date
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="start_date" type="date"  placeholder="Enter start date of agreement" required/>
    </div>
    <div class="mb-10">
      <label class="block text-gray-700 text-sm font-bold mb-2" for="username">
        Months
      </label>
      <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" name="eth_rent" type="number" min="1" max="12" step="1" placeholder="Enter months" required/>
    </div>
    <div class="flex items-center justify-between">
      <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">
        Submit
      </button>
      <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
        Forgot Password?
      </a>
    </div>
  </form>
</div>
      </div>
      
    </div>
  );
};
 
export default Popup;