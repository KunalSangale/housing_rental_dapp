import { addressShorten } from "@/utils"
import { formatUnits, parseEther, parseUnits } from "@ethersproject/units"

export default (props) => {
    return (
        <div className="border rounded-lg flex flex-col space-y-2 w-60 ">
            <div className="pt-8">
                <p className="text-xs font-bold text-gray-700 tracking-wide block p-3 pb-0">ETH</p>
                <p className="text-6xl font-bold text-gray-700 tracking-wide block p-3 pt-0 pr-1 inline truncate    ">
                    {formatUnits(props.e.rentAmount, 18)}
                </p>
                <p className="inline text-sm text-gray-600 block font-bold uppercase tracking-wider">
                    /pm
                </p>
            </div>
            <div className="w-full h-16 bg-slate-100 rouned-lg flex flex-col p-3">
                <p className="text-sm font-bold text-gray-600 tracking-wide block">
                    BY {addressShorten(props.e.sender)}
                </p>
                <p className="text-sm font-bold text-gray-600 tracking-wide block">
                    {formatUnits(props.e.months, 0)} months
                </p>
            </div>
        </div>
    )
}
