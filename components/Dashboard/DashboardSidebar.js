const tabs = [
    { label: "Active", value: 0 },
    { label: "Listings & Properties", value: 1 },
]
const activeCss = "bg-blue-50 text-blue-500"
const inactiveCss = "text-slate-600 hover:bg-slate-100 "
export default (props) => {
    return (
        <div className="h-full flex flex-col border-r md:basis-1/6 pt-24">
            {tabs.map((e, i) => {
                return (
                    <div
                        className={
                            "w-full rounded-r-full h-12 flex flex-col cursor-pointer justify-center px-8 uppercase tracking-wide text-xs font-bold select-none " +
                            (props.active === e.value ? activeCss : inactiveCss)
                        }
                        onClick={() => props.setActive(e.value)}
                    >
                        <p>{e.label}</p>
                    </div>
                )
            })}
        </div>
    )
}
