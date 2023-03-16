export default (e) => {
    return (
        <div className="p-4 w-full bg-gray-50 rounded border flex justify-between">
            <div>
                <p>{e.Address}</p>
                <p>{e.Area}</p>
                <p>{e.Pincode}</p>
                <p>{e.SaleDeedNumber}</p>
            </div>
            <button>{e.actionLabel}</button>
        </div>
    )
}
