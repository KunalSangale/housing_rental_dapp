import React from "react";
import { useWeb3React } from "@web3-react/core";
import "../App.css";
import Navbar from '../components/Navbar'
const pageState = {
  LOADING: "LOADING",
  READY: "READY",
};
const Home = () => {
  return (
    <>
      <Navbar />
    </>
  );
};

export default Home;
