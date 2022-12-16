import React from "react";
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import "./App.css";
import "./index.css";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landlord from "./pages/Landlord";
import ListingsPage from "./pages/ListingsPage";
import Verify from "./pages/Verify";
import { AppContextProvider } from "./AppContext";
import Details from "./pages/Details";
function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  if (window.ethereum) {
    window.ethereum.on("chainChanged", () => window.location.reload());
  }
  return (
    <AppContextProvider>
      <Web3ReactProvider getLibrary={getLibrary}>
        <div>
          <Router>
            <Navbar />
            <Routes>
              <Route path="/" exact element={<Home />} />
              <Route path="/landlord" element={<Landlord />} />
              <Route path="/details" element={<Details />} />
              <Route path="/listingsPage" element={<ListingsPage />} />
              <Route path="/verify" element={<Verify />} />
            </Routes>
          </Router>
        </div>
      </Web3ReactProvider>
    </AppContextProvider>
  );
};

export default App;
