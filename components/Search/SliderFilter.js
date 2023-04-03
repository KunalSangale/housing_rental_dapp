import Slider from "@mui/joy/Slider"
import { Input } from "@mui/joy"
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

function valueText(value) {
    return `${value} ETH`
}

export default (props) => {
    return (
        <>
            <p className="font-semibold text-xs text-slate-600 mx-8 tracking-wider mt-4">
                {props.title}
            </p>
            <div className="flex items-center mx-8 justify-center">
                <Input
                    color="neutral"
                    variant="outlined"
                    size="sm"
                    onChange={(e) => props.handleInputChange(e, 0)}
                    className="basis-1/6"
                    placeholder="Min"
                    value={props.sliderVal[0]}
                />
                <div className="basis-1/2 mx-auto">
                    <Slider
                        step={0.01}
                        valueLabelDisplay="auto"
                        value={props.sliderVal}
                        onChange={props.handleSliderChange}
                        min={0}
                        marks={marks}
                        max={5}
                        getAriaValueText={valueText}
                    />
                </div>
                <Input
                    color="neutral"
                    variant="outlined"
                    size="sm"
                    onChange={(e) => props.handleInputChange(e, 1)}
                    className="basis-1/6"
                    placeholder="Max"
                    value={props.sliderVal[1]}
                />
            </div>
        </>
    )
}
