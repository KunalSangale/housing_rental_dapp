import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import useEth from "../../hooks/useEth";
import "../../styling/BalanceCard.css";

const BalanceCard = () => {
  const { active, account } = useWeb3React();
  const { fetchEthBalance, ethBalance } = useEth();
  const addressShorten = address =>{
    return address.substring(0,6)+"..."+address.substring(address.length - 5,address.length - 1)
  }
  useEffect(() => {
    if (account) {
      fetchEthBalance();
    }
  }, [account, fetchEthBalance]);

  if (!active) {
    return <p>{""}</p>;
  }

  return (
    <div className="balance-container">
      <div className="balance-column1">
        <p >Address: </p>
        <p block>
          ETH Balance:
        </p>
      </div>
      <div className="balance-column2">
        <p >{addressShorten(account)}</p>
        <p >
        <i className="fab fa-ethereum"></i>{" "}{ethBalance} 
        </p>
      </div>
    </div>
  );
};

export default BalanceCard;
