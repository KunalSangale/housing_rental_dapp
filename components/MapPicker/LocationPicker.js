import { useState } from "react"
import Map from "react-map-gl"
import { Marker } from "react-map-gl"
import GeocoderControl from "./GeocoderControl"

// eslint-disable-next-line
const TOKEN = process.env.MapboxAccessToken // Set your mapbox token here

export default (props) => {
    // console.log("Token = ", TOKEN)
    const [marker, setMarker] = useState(null)

    const createMarker = (e) => {
        setMarker(
            <Marker {...props.marker} longitude={e.lngLat.lng} latitude={e.lngLat.lat} draggable />
        )
        props.setLocation(e.lngLat)
    }

    return (
        <>
            <Map
                initialViewState={{
                    longitude: 72.8777,
                    latitude: 19.076,
                    zoom: 13,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={TOKEN}
                onContextMenu={createMarker}
            >
                <GeocoderControl
                    mapboxAccessToken={TOKEN}
                    selectedLocation={props.selectedLocation}
                    setSelectedLocation={props.setLocation}
                    locMarker={marker}
                    setLocMarker={setMarker}
                    position="top-left"
                />
                {marker}
            </Map>
        </>
    )
}
