import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MetamaskConnectButton from "./Metamask/MetamaskConnectButton";
import BalancesCard from "./Metamask/BalancesCard";
import "../styling/Navbar.css";

function Navbar() {
  // const [click, setClick] = useState(false);
  // const handleClick = () => setClick(!click);

  // const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo">
            Rental
          </Link>
          
          <ul className={ "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links">
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/landlord"
                className="nav-links"

              >
                LANDLORD
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/listingsPage"
                className="nav-links"
              >
                LISTINGS
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/verify"
                className="nav-links"
              >
                KYC
              </Link>
            </li>
          </ul>
          <div>
            <BalancesCard />
          </div>
            {/* <MetamaskConnectButton className="navbar-connect">
              {" "}
            </MetamaskConnectButton> */}

        </div>
      </nav>
    </>
  );
}

export default Navbar;
