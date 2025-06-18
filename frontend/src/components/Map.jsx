import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        const loader = new Loader({
        apiKey: "", // 🔁 Replace with your actual key
        version: "weekly",
        });

        loader.load().then(() => {
        const location = { lat: 51.5074, lng: -0.1278 }; // 📍 Central London

        const map = new window.google.maps.Map(mapRef.current, {
            center: location,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });

        });
    }, []);

    return (
        <div
        ref={mapRef}
        style={{
            width: "100%",
            height: "800px", // 💡 Must be set!
            borderRadius: "8px",
        }}
        />
    );
};

export default Map;