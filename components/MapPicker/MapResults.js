import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    GeolocateControl,
    ScaleControl,
} from "react-map-gl"
import Image from "next/image"
import Link from "next/link"

import Pin from "./Pin"
import { useState, useMemo } from "react"
const TOKEN = process.env.MapboxAccessToken // Set your mapbox token here

export default (props) => {
    const [popupInfo, setPopupInfo] = useState(null)
    const ogLng =
        props.searchResults.length > 0 ? props.searchResults[0].Listing.longitude : 72.8777
    const ogLat = props.searchResults.length > 0 ? props.searchResults[0].Listing.latitude : 19.076
    const pins = useMemo(() => {
        return props.searchResults.map((result, index) => (
            <Marker
                key={`marker-${index}`}
                longitude={result.Listing.longitude}
                latitude={result.Listing.latitude}
                anchor="bottom"
                onClick={(e) => {
                    e.originalEvent.stopPropagation()
                    setPopupInfo(result)
                }}
            >
                <Pin />
            </Marker>
        ))
    }, [props.searchResults])

    console.log(props.searchResults)
    return (
        <Map
            initialViewState={{
                latitude: ogLat,
                longitude: ogLng,
                zoom: 10,
                bearing: 0,
                pitch: 0,
            }}
            mapStyle="mapbox://styles/mapbox/streets-v9"
            mapboxAccessToken={TOKEN}
        >
            <GeolocateControl position="top-left" />
            <FullscreenControl position="top-left" />
            <NavigationControl position="top-left" />
            <ScaleControl />

            {pins}

            {popupInfo && (
                <Popup
                    anchor="top"
                    longitude={Number(popupInfo.Listing.longitude)}
                    latitude={Number(popupInfo.Listing.latitude)}
                    onClose={() => setPopupInfo(null)}
                >
                    <div className="flex flex-col h-40">
                        <div className="relative basis-1/2 w-full">
                            <Image
                                src={
                                    "http://localhost/api/thumbnail/" +
                                    popupInfo.Listing.metadata_id +
                                    "?compressed=true"
                                }
                                className="object-cover rounded-md"
                                fill
                            />
                        </div>
                        <p>{popupInfo.Property.Address}</p>
                        <p>{popupInfo.Listing.bhk} BHK</p>
                        <p className="text-blue-500 font-bold text-md">
                            ETH {popupInfo.Listing.eth_rent}/pm
                        </p>
                        <Link
                            href={{
                                pathname: "/listing/" + popupInfo.Listing.metadata_id,
                            }}
                        >
                            <button className="text-white w-full uppercase bg-blue-600 hover:bg-blue-800 font-bold rounded-lg text-sm px-5 py-1 text-center dark:bg-blue-600 dark:hover:bg-blue-700">
                                View
                            </button>
                        </Link>
                    </div>
                    <img width="100%" src={popupInfo.image} />
                </Popup>
            )}
        </Map>
    )
}
