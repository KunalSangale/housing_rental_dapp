import Link from "next/link"
import Image from "next/image"
import ListingContainer from "./ListingContainer"

export default (props) => {
    return props.searchResults.length > 0 ? (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 mx-8 md:mx-40">
            {props.searchResults.map((e, i) => {
                return <ListingContainer e={e} />
            })}
        </div>
    ) : (
        <div className="mt-40 w-full">
            <p className="text-lg text-slate-600 text-center w-full">
                {" "}
                No search results found for the query
            </p>
        </div>
    )
}
