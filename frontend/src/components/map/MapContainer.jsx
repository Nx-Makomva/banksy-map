import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';

const MapContainer = ({artworks, onArtworkSelect}) => {

    const location = { lat: 51.5074, lng: -0.1278 }; // 📍 Central London

    const handleMarkerClick = (artwork) => {
        console.log('Marker clicked:', artwork.title);
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
                const [lng, lat] = artwork.location.coordinates;
                console.log("FROM MAP CONTAINER:", artworks)
                return (
                <AdvancedMarker
                    key={artwork.id}
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
        })}
        </Map>
    );
}

export default MapContainer;