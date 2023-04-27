import Map from "react-map-gl"
import { Marker } from "react-map-gl"

// eslint-disable-next-line
const TOKEN = process.env.MapboxAccessToken // Set your mapbox token here

export default (props) => {
    return (
        <>
            <Map
                initialViewState={{
                    longitude: props.lng,
                    latitude: props.lat,
                    zoom: 13,
                }}
                mapStyle="mapbox://styles/mapbox/streets-v9"
                mapboxAccessToken={TOKEN}
            >
                <Marker longitude={props.lng} latitude={props.lat} />
            </Map>
        </>
    )
}
