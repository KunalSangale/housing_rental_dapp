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
    <div className="mx-4 pl-8 px-3 py-1 bg-slate-800 text-white rounded-full flex flex-row items-center content-around space-x-6">
      <div className="">
        <p >{}</p>
        <div className="flex flex-row items-center">
        <span class="material-symbols-outlined">
account_circle
</span><p className="font-nunito ml-2 font-semibold text-sm">{addressShorten(account)}</p>
</div>
        <div className="flex flex-row items-center">
        <span class="material-symbols-outlined">
account_balance_wallet
</span><div className=" flex flex-row items-baseline"><p className="font-nunito ml-2 font-semibold">{ethBalance}</p><p className="text-sm ml-1.5 font-nunito font-bold">ETH</p> </div>
</div>
      </div>
      <div className="rounded-full bg-white w-10 h-10 text-center text-slate-800">
      <span className="material-symbols-outlined mt-2">
logout
</span>
      </div>
    </div>
  );
};

export default BalanceCard;
