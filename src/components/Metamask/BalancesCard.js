import React, { useEffect } from "react";
import { useWeb3React } from "@web3-react/core";

import useEth from "../../hooks/useEth";
import Text from "../Text";
import "../../styling/BalanceCard.css";

const BalanceCard = () => {
  const { active, account } = useWeb3React();
  const { fetchEthBalance, ethBalance } = useEth();

  useEffect(() => {
    if (account) {
      fetchEthBalance();
    }
  }, [account, fetchEthBalance]);

  if (!active) {
    return <Text>{""}</Text>;
  }

  return (
    <div className="balance-container">
      <div className="balance-column1">
        <Text >Address: </Text>
        <Text block>
          ETH Balance:
        </Text>
      </div>
      <div className="balance-column2">
        <Text >{account}</Text>
        <Text >
        <i className="fab fa-ethereum"></i>{" "}{ethBalance} 
        </Text>
      </div>
    </div>
  );
};

export default BalanceCard;
