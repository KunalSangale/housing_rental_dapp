import { useAccount, useBalance, useDisconnect } from "wagmi"
import { AlertCircle, User, Wallet, LogOut } from "@web3uikit/icons"

export default () => {
    const { address, isConnected } = useAccount()
    const { disconnect } = useDisconnect()
    const addressShorten = (address) => {
        return (
            address.substring(0, 6) +
            "..." +
            address.substring(address.length - 5, address.length - 1)
        )
    }
    const { data, isError, isLoading } = useBalance({ address })
    if (!isConnected) {
        return (
            <div className="flex flex-row mx-4 pl-8 px-3 items-center py-1 bg-red-200">
                <AlertCircle className="basis-1/4 mx-auto" fontSize="50px" />
                <p className="basis-3/4">Wallet Disconnected</p>
            </div>
        )
    }
    return (
        <div className="mx-2 pl-5 pr-2 py-1 bg-slate-100 border text-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:border-gray-600 rounded-full flex flex-row items-center content-around space-x-1">
            <div className="mr-2">
                <p>{}</p>
                <div className="flex flex-row items-center">
                    <User fontSize="18px" />
                    <p className="font-nunito ml-2  font-semibold text-xs">
                        {addressShorten(address)}
                    </p>
                </div>
                <div className="flex flex-row items-center">
                    <Wallet fontSize="18px" />
                    <div className=" flex flex-row items-baseline">
                        <p className="font-nunito ml-2 font-semibold text-sm">{data?.formatted}</p>
                        <p className=" ml-1.5 text-xs font-nunito font-bold">
                            {data?.symbol}
                        </p>{" "}
                    </div>
                </div>
            </div>
            <div className="border-r-2 h-4 border-slate-300 dark:border-slate-600"></div>
            <div
                className="rounded-full w-8 h-8 flex items-center justify-center cursor-pointer"
                onClick={() => disconnect()}
            >
                <LogOut fontSize="20px" />
            </div>
        </div>
    )
}
