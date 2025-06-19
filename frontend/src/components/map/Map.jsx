import React, { useEffect, useRef } from "react";
import { Loader } from "@googlemaps/js-api-loader";

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const Map = () => {
    const mapRef = useRef(null);

    useEffect(() => {
        const loader = new Loader({
        apiKey: API_KEY, // 🔁 Replace with your actual key
        version: "weekly",
        });

        loader.load().then(() => {
        const location = { lat: 51.5074, lng: -0.1278 }; // 📍 Central London

        const map = new window.google.maps.Map(mapRef.current, {
            center: location,
            zoom: 13,
            mapId: '789d31d06ebabc6f5c31282b',
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
            height: "1200px", // 💡 Must be set!
            borderRadius: "8px",
        }}
        />
    );
};

export default Map;