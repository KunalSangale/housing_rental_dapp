import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import MetamaskConnectButton from "./Metamask/MetamaskConnectButton";
import BalancesCard from "./Metamask/BalancesCard";
import "../styling/Navbar.css";

function Navbar() {
  const [click, setClick] = useState(false);
  const [button, setButton] = useState(true);

  const handleClick = () => setClick(!click);

  const closeMobileMenu = () => setClick(false);

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="navbar-container">
          <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
            Rental
          </Link>
          <div>
            <BalancesCard />
          </div>
          <ul className={click ? "nav-menu active" : "nav-menu"}>
            <li className="nav-item">
              <Link to="/" className="nav-links" onClick={closeMobileMenu}>
                HOME
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/landlord"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                LANDLORD
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/listingsPage"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                LISTINGS
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/verify"
                className="nav-links"
                onClick={closeMobileMenu}
              >
                KYC
              </Link>
            </li>
          </ul>
          {button && (
            <MetamaskConnectButton className="navbar-connect">
              {" "}
            </MetamaskConnectButton>
          )}
        </div>
      </nav>
    </>
  );
}

export default Navbar;
