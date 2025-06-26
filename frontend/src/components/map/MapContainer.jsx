import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const MapContainer = ({artworks, onArtworkSelect}) => {

    const location = { lat: 51.5074, lng: -0.1278 }; // 📍 Central London

    const handleMarkerClick = (artwork) => {
        onArtworkSelect(artwork);
    }

    return (

        <Map
            mapId="789d31d06ebabc6f5c31282b"
            defaultCenter={location}
            defaultZoom={13}
            gestureHandling={'greedy'}
            disableDefaultUI={false}
            mapTypeControl={false}
            streetViewControl={false}
            fullscreenControl={false}
            style={{
                width: "100%",
                height: "1200px",
                borderRadius: "8px",
            }}
        >
            {/* Render markers for each artwork */}
            {Array.isArray(artworks) && artworks?.map(artwork => {
                try {
                    const [lng, lat] = artwork.location.coordinates;
                    // console.log("FROM MAP CONTAINER:", artwork)
                    console.log("Marker clicked:", artwork.title)
                    return (
                    <AdvancedMarker
                        key={artwork._id}
                        position={{ lat, lng }}
                        title={artwork.title}
                        onClick={(event) => handleMarkerClick(artwork, event)}
                    >
                        <Pin
                        background={'#ff51b0'}
                        borderColor={'#B6F6EA'}
                        glyphColor={'#B6F6EA'}
                        />
                    </AdvancedMarker>
                );
            } catch (error) {
                    console.warn(`Invalid coordinates for artwork ${artwork._id}:`, error);
                    return null; // Don't render this marker
            }
        })}
        </Map>
    );
}

export default MapContainer;