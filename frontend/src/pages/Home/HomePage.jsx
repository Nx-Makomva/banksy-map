//import User from "../../../../api/models/user";
import { useUser } from "../../contexts/UserContext";
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom";
import {APIProvider} from '@vis.gl/react-google-maps';
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MainBar from "../../components/MainBar";
import "../../assets/styles/HomePage.css";
import { getAllArtworks } from "../../services/artworks";
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
    const [artworks, setArtworks] = useState([]);
      // Filter state
    const [filters, setFilters] = useState({
        themeTags: [],
        isAuthenticated: undefined,
        location: null, // lat, long, maxDistance
    });

    
  // Fetch artworks on component mount
    useEffect(() => {
        const fetchArtworks = async () => {
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
            setArtworks(artworksData.allArtworks);
            console.log("set artworks:", artworks)
        } catch (err) {
            console.error('Error fetching artworks:', err);
        } 
        };
        fetchArtworks();
  }, [filters]); // Empty dependency array - runs once on mount

    console.log('artworks:', artworks, 'type:', typeof artworks, 'isArray:', Array.isArray(artworks));

    const handleLogout = async () => {
        await logout();
        navigate("/")
    }

    const handleAccountClick = (event) => {
        event.preventDefault();
        setSelectedArtwork(null);
        setActiveView('account');
    }

    const handleMapClick = (event) => {
        event.preventDefault();
        setSelectedArtwork(null);
        setActiveView('map');
    }

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
                />
                <MainBar 
                    activeView={activeView}
                    artworks={artworks}
                    onArtworkSelect={handleArtworkSelect}
                    selectedArtwork={selectedArtwork}
                    showFullPopup={showFullPopup}
                    onClosePopup={handleClosePopup}
                    popupPosition={popupPosition}
                />
            </div>
        </APIProvider>
        </>
    );
}