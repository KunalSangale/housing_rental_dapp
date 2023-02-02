import { useWeb3React } from "@web3-react/core";
import { formatEther } from "@ethersproject/units";
// import { useAppContext } from "../AppContext";
import { useDispatch, useSelector } from "react-redux";
import {set} from '../slice/ethSlice'
const useEth = () => {
  const { active, library, account } = useWeb3React();
  // const { ethBalance, setEthBalance } = useAppContext();
  const dispatch = useDispatch()
  const ethBalance = useSelector(s=>s.eth)
  const fetchEthBalance = async () => {
    if (library && active && account) {
      const balance = await library.getBalance(account);
      dispatch(set({balance: balance,account: account}))
    //   // better to do safe math operations
    //   setEthBalance(parseFloat(formatEther(balance)).toPrecision(4));
    } else {
        dispatch(set({balance: '--'}))
    }
  };
  return { ethBalance: ethBalance.balance, fetchEthBalance };
};

export default useEth;
