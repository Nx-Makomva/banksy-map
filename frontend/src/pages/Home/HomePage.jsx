import { useUser } from "../../contexts/UserContext";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {APIProvider} from '@vis.gl/react-google-maps';
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MainBar from "../../components/MainBar";
import "../../assets/styles/HomePage.css";
import { getAllArtworks } from "../../services/artworks";
import { geocodeAddress } from "../../services/geocoding";
//import { set } from "../../../../api/app";


const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

export function HomePage() {
    // this gets the user who is logged in
    const { user, logout } = useUser()
    const navigate = useNavigate();
    const loggedIn = user?._id;
    console.log(loggedIn)
    console.log(user)

    // Use single state to manage which view is active - clicks are made in navbar
    const [activeView, setActiveView] = useState('map'); // 'map' or 'account'
    // set selected artwork - for map stuff
    const [selectedArtwork, setSelectedArtwork] = useState(null);
    // set popups
    const [showFullPopup, setShowFullPopup] = useState(false);
    const [popupPosition, setPopupPosition] = useState({ x: 20, y: 20 });
    // Add artworks state
    const [allArtworks, setAllArtworks] = useState([]); 
    const [filteredArtworks, setFilteredArtworks] = useState([]);
    // Address state (for filter search)
    const [addressInput, setAddressInput] = useState("");
    const [isSearchingAddress, setIsSearchingAddress] = useState(false);
        // loading state for get current location
    const [isGettingLocation, setIsGettingLocation] = useState(false);
      // Filter state - to group filters
    const [filters, setFilters] = useState({
        themeTags: [],
        isAuthenticated: undefined,
        location: null, // lat, long, maxDistance
    });
    // set co-ords state for location filters
   // const [coordinates, setCoordinates] = useState({ lat: null, lng: null })
    console.log(filters.location)
    // Fetch ALL artworks on component mount - with no filters
    // for getting dropdowns
    useEffect(() => {
        const fetchAllArtworks = async () => {
            try {
                const allArtworksData = await getAllArtworks();
                console.log('All artworks fetched:', allArtworksData);
                setAllArtworks(allArtworksData.allArtworks);
            } catch (err) {
                console.error('Error fetching all artworks:', err);
            }
        };
        
        fetchAllArtworks();
    }, []); // Run once on mount


    useEffect(() => {
        const fetchFilteredArtworks = async () => {
        try {
            const queryParams = {};
            
            // Add theme tags if any selected
            if (filters.themeTags.length > 0) {
                queryParams.themeTags = filters.themeTags;
            }
            
            // Add authentication filter
            if (filters.isAuthenticated !== undefined) {
                queryParams.isAuthenticated = filters.isAuthenticated;
            }
            
            // Add location if set
            if (filters.location) {
                queryParams.lat = filters.location.lat;
                queryParams.lng = filters.location.lng;
                queryParams.maxDistance = filters.location.maxDistance || 1000;
            }
            
            const artworksData = await getAllArtworks(queryParams);
            console.log(artworksData)
            setFilteredArtworks(artworksData.allArtworks);
            console.log("set filtered artworks:", filteredArtworks)
        } catch (err) {
            console.error('Error fetching artworks:', err);
        } 
        };
        fetchFilteredArtworks();
  }, [filters]); // Empty dependency array - runs once on mount


    // filters- set function
    const handleFiltersChange = (newFilters) => {
        setFilters(newFilters);
    };

    // Address search handler (using Google API function)
    // search-as-you-type...
    useEffect(() => {
        const timeoutId = setTimeout(async () => {
            if (addressInput.trim() && addressInput !== "Current Location") {
                console.log("Searching for address:", addressInput);
                setIsSearchingAddress(true);
                try {
                    const coordinates = await geocodeAddress(addressInput);
                    console.log("Geocoding result:", coordinates); // Debug log
                    if (coordinates) {
                        console.log("Setting location filter:", coordinates);
                        setFilters(prev => ({
                            ...prev,
                            location: {
                                lat: coordinates.lat,
                                lng: coordinates.lng,
                                maxDistance: prev.location?.maxDistance || 10000
                            }
                        }));
                    }
                } catch (error) {
                    console.error('Error searching address:', error);
                } finally {
                    setIsSearchingAddress(false);
                }
            }
        }, 1000);

        return () => clearTimeout(timeoutId);
    }, [addressInput]);

    // Address input handler
    const handleAddressInputChange = (newAddress) => {
        setAddressInput(newAddress);
    };

    // Handle current location
    const handleUseCurrentLocation = () => {
        setIsGettingLocation(true);
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setFilters(prev => ({
                        ...prev,
                        location: {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            maxDistance: prev.location?.maxDistance || 10000
                        }
                    }));
                    setAddressInput("Current Location");
                    setIsGettingLocation(false);
                },
                (error) => {
                    console.error('Error getting location:', error);
                    setIsGettingLocation(false);
                }
            );
        } else {
            setIsGettingLocation(false); 
        }
    };

    // handle logout 
    const handleLogout = async () => {
        await logout();
        navigate("/")
    }

    // handle click on account button in navbar
    const handleAccountClick = (event) => {
        event.preventDefault();
        setSelectedArtwork(null);
        setActiveView('account');
    }

    // handle click on navbar map button
    const handleMapClick = (event) => {
        event.preventDefault();
        setSelectedArtwork(null);
        setActiveView('map');
    }

    // handles clicking on an artwork pin
    const handleArtworkSelect = (artwork, position = null) => {
        if (selectedArtwork?._id === artwork._id) {
            // Second click on same artwork - show full popup
            setShowFullPopup(true);
        } else {
            // First click or different artwork - show mini popup
            setSelectedArtwork(artwork);
            if (position) {
                setPopupPosition(position);
            }
            setShowFullPopup(false);
        }
    };
    
    // handle closing popup
    const handleClosePopup = () => {
        console.log('handleClosePopup called!'); // Add this line
        setSelectedArtwork(null);
        setShowFullPopup(false);
    };

    return (
        <>
        <APIProvider apiKey={API_KEY}>
            <Navbar 
                onLogOut={handleLogout} 
                loggedIn={loggedIn} 
                onAccountClick={handleAccountClick}
                onMapClick={handleMapClick}
            />
            <div className="pageColumnsContainer">
                <Sidebar 
                    activeView={activeView}
                    artworks={allArtworks}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                    addressInput={addressInput}
                    onAddressInputChange={handleAddressInputChange}
                    isSearchingAddress={isSearchingAddress}
                    onUseCurrentLocation={handleUseCurrentLocation}
                    isGettingLocation={isGettingLocation}
                />
                <MainBar 
                    activeView={activeView}
                    artworks={filteredArtworks}
                    onArtworkSelect={handleArtworkSelect}
                    selectedArtwork={selectedArtwork}
                    showFullPopup={showFullPopup}
                    onClosePopup={handleClosePopup}
                    popupPosition={popupPosition}
                    userLocation={filters.location}
                    searchAddress={addressInput}
                />
            </div>
        </APIProvider>
        </>
    );
}