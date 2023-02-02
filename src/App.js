import './App.css';
import React from "react";
import { Provider } from 'react-redux'
import { Web3ReactProvider } from "@web3-react/core";
import { ethers } from "ethers";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landlord from "./pages/Landlord";
import ListingsPage from "./pages/ListingsPage";
import Verify from "./pages/Verify";
import Details from "./pages/Details";
import store from './store'
function getLibrary(provider) {
  return new ethers.providers.Web3Provider(provider);
}

const App = () => {
  if (window.ethereum) {
    window.ethereum.on("chainChanged", () => window.location.reload());
  }
  return (
    <Provider store={store}>
      <Web3ReactProvider getLibrary={getLibrary}>
        <div>
          <Router>
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
    </Provider>
  );
};

export default App;
