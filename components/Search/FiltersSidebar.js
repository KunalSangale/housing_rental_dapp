import Slider from "@mui/joy/Slider"
import { useState } from "react"

function valueText(value) {
    return `${value} ETH`
}

const marks = [
    {
        value: 0,
        label: "0 ETH",
    },
    {
        value: 5,
        label: "5 ETH",
    },
]

export default () => {
    const [rentVal, setRentVal] = useState([0, 5])
    const handleChange = (event, newValue) => {
        setRentVal(newValue)
    }
    return (
        <div className="h-full bg-slate-50 border-r md:basis-1/5 pt-24">
            <p className="font-bold text-slate-600 mx-8 tracking-wider ">FILTERS</p>
            <div>
                <div className="w-2/5 mx-auto">
                    <Slider
                        step={0.01}
                        valueLabelDisplay="auto"
                        value={rentVal}
                        onChange={handleChange}
                        min={0}
                        marks={marks}
                        max={5}
                        getAriaValueText={valueText}
                    />
                </div>
            </div>
        </div>
    )
}
