import { useState } from "react"
import AdvancedOptions from "../HeroSection.js/AdvancedOptions"

import SliderFilter from "./SliderFilter"

export default (props) => {
    const [rentVal, setRentVal] = useState([0, 5])
    // const [active, setActive] = useState({})
    const [depositVal, setDepositVal] = useState([0, 5])
    const handleChange = (event, newValue, isDeposit) => {
        isDeposit
            ? (props.setDep(newValue), setDepositVal(newValue))
            : (props.setRent(newValue), setRentVal(newValue))
    }
    const handleInputChange = (newVal, arrPos, isDeposit) => {
        let newRent = isDeposit ? [...depositVal] : [...rentVal]
        newRent[arrPos] = newVal.target.value
        if (parseFloat(newRent[0]) > parseFloat(newRent[1])) {
            if (arrPos === 0) newRent[1] = parseFloat(newVal.target.value) + 0.5
            else newRent[0] = parseFloat(newVal.target.value) - 0.5
        }
        isDeposit ? props.setDepMax(newRent) : props.setRentMax(newRent)
    }
    //props.setQuery({ rent_max: rentVal, dep_max: depositVal })
    return (
        <div className="h-full  border-r md:basis-1/6 pt-24">
            <p className="font-bold text-slate-600 mx-8 tracking-wider border-b">FILTERS</p>
            <SliderFilter
                handleSliderChange={(n, p) => handleChange(n, p, false)}
                title={"RENT"}
                handleInputChange={(n, p) => handleInputChange(n, p, false)}
                sliderVal={rentVal}
            />
            <SliderFilter
                handleSliderChange={(n, p) => handleChange(n, p, true)}
                title={"DEPOSIT"}
                handleInputChange={(n, p) => handleInputChange(n, p, true)}
                sliderVal={depositVal}
            />
            <hr className="mx-8 mt-8" />
            <p className="font-semibold text-xs text-slate-600 mx-8 tracking-wider mt-4">
                AMENITIES
            </p>
            <div className="mx-8 ">
                <AdvancedOptions setActive={props.setActive} active={props.active} />
            </div>
        </div>
    )
}
