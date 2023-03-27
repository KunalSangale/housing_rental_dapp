var config = [
    {
        label: "Park",
        prop: "hasPark",
    },
    {
        label: "Parking",
        prop: "hasParking",
    },
    {
        label: "CCTV Survellaince",
        prop: "hasCameras",
    },
    {
        label: "Pool",
        prop: "hasPool",
    },
    {
        label: "Balcony",
        prop: "hasBalcony",
    },
    {
        label: "Smart Home",
        prop: "isSmartHome",
    },
    {
        label: "Gymmnassium",
        prop: "hasGymn",
    },
    {
        label: "Pet Friendly",
        prop: "isPetFriendly",
    },
]
var defaultBg = "bg-slate-200 "
var activeBg = "bg-emerald-200 "
var disabledBg = "bg-red-200 "

var defaultTxt = "text-slate-600 "
var activeTxt = "text-emerald-600 "
var disabledTxt = "text-red-600 "
export default (props) => {
    const handleClick = (i) => {
        if (props.active.hasOwnProperty(config[i].prop)) {
            if (props.active[config[i].prop]) {
                props.setActive({ ...props.active, [config[i].prop]: false })
            } else {
                var newObj = { ...props.active }
                delete newObj[config[i].prop]
                props.setActive(newObj)
            }
        } else {
            props.setActive({ ...props.active, [config[i].prop]: true })
        }
    }

    const getString = (prop, txt) => {
        if (props.active.hasOwnProperty(prop)) {
            if (props.active[prop]) {
                return txt ? activeTxt : activeBg
            } else {
                return txt ? disabledTxt : disabledBg
            }
        } else {
            return txt ? defaultTxt : defaultBg
        }
    }
    return (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 justify-items-center gap-y-4">
            {config.map((e, i) => {
                return (
                    <div
                        className={
                            "flex justify-center items-center rounded  h-20 w-36 cursor-pointer " +
                            getString(e.prop, false)
                        }
                        onClick={() => handleClick(i)}
                    >
                        <p
                            className={
                                "text-lg select-none text-center " + getString(e.prop, true)
                            }
                        >
                            {e.label}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}
