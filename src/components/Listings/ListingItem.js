import React from "react";
import { useLocation } from "react-router-dom";
import { formatEther } from "@ethersproject/units";
import "../../styling/Cards.css";
import "../../styling/UnitCard.css";
import {Link} from "react-router-dom";
import apt1 from "../../images/apts/apt3.jpeg";
import apt2 from "../../images/apts/apt4.jpeg";
import apt3 from "../../images/apts/apt1.jpeg";
import apt4 from "../../images/apts/apt2.jpeg";
import apt5 from "../../images/apts/apt5.jpeg";
import apt6 from "../../images/apts/apt6.jpeg";

import { UnitContext } from "../../hooks/useUnitInfo";

const image = [apt1, apt2, apt3, apt4, apt5, apt6];

const ListingItem = ({ item }) => {
  const {
    unitNumber,
    unitAddress,
    cid,
    rent,
    deposit,
    term,
    startDate,
    //area,
    // bhk,
    // bathrooms,
    // preferredTenant,
_,
    state,
  } = item;

  return (
    <UnitContext.Provider value={item}>
      <Link to= "/details"
          state={{data:item}}
        >
      <li className="cards__item">
        <div className="cards__item__link">
          <figure className="cards__item__pic-wrap" data-category="For Rent">
            <img
              className="cards__item__img"
              alt="Property Image"
              src={"https://"+cid+".ipfs.dweb.link"}
            />
          </figure>

          <div className="cards__item__info">
            <div className="cards__item__text">
              <h5>Unit Number: </h5>
              <h5>Unit Address: </h5>
              <h5>Rent: </h5>
              <h5>Deposit: </h5>
              <h5>Lease Term: </h5>
              <h5>Start Date: </h5>
            </div>
            <div className="cards__item__values">
              <h5>{unitNumber.toNumber()}</h5>
              <h5> {unitAddress}</h5>
              <h5>{formatEther(rent)} ETH/mo</h5>
              <h5>{formatEther(deposit)} ETH</h5>
              <h5>{term.toNumber()} Months</h5>
              <h5> {startDate}</h5>
            </div>
          </div>
        </div>{" "}
      </li>
      </Link>
    </UnitContext.Provider>
  );
};

export default ListingItem;
