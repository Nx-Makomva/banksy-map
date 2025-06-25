import { useState } from "react";
import ReportButton from "../ReportButton";
import ArtworkForm from "../ArtworkForm";
// import { getCurrentPosition } from "../../services/geocoding";
import "../../assets/styles/MapSideBar.css"
import { useUser } from "../../contexts/UserContext";

const MapSideBar = ({
    artworks = [],
    filters,
    onFiltersChange,
    addressInput,
    onAddressInputChange,
    isSearchingAddress,
    onUseCurrentLocation,
    isGettingLocation,
    refreshTrigger
}) => {
    
    const [showArtworkForm, setShowArtworkForm] = useState(false);
    const { user } = useUser();
    



    // Extract unique theme tags from current artworks
    const availableThemes = [...new Set(
        artworks.flatMap(artwork => artwork.themeTags || [])
        )].sort();

    const handleOpenArtworkForm = () => {
        setShowArtworkForm(true);
    };

    const handleCloseArtworkForm = () => {
        setShowArtworkForm(false);
    };

        // Handle theme tag selection
    const handleThemeChange = (selectedOptions) => {
        const selectedThemes = Array.from(selectedOptions, option => option.value);
        
        // If "All" is selected, clear all theme filters
        if (selectedThemes.includes("All")) {
            onFiltersChange({
                ...filters,
                themeTags: []
            });
        } else {
            onFiltersChange({
                ...filters,
                themeTags: selectedThemes
            });
        }
    };

    // Handle authentication filter
    const handleAuthChange = (authValue) => {
        onFiltersChange({
        ...filters,
        isAuthenticated: authValue
        });
    };

    // Handle distance slider
    const handleDistanceChange = (distance) => {
        if (filters.location) {
        onFiltersChange({
            ...filters,
            location: {
            ...filters.location,
            maxDistance: parseInt(distance)
            }
        });
        }
    };

    const handleBookmarkedChange = (isBookmarked) => {
        onFiltersChange({
            ...filters, 
            bookmarked: isBookmarked
        });
    }

    const handleVisitedChange = (isVisited) => {
        onFiltersChange({
            ...filters, 
            visited: isVisited
        });
    }

    // Clear location filter
    const handleClearLocation = () => {
        onFiltersChange({
        ...filters,
        location: null
        });
        onAddressInputChange("");
    };

    

    // Handle clearing all set filters
    const handleClearAllFilters = () => {
        onFiltersChange({
            themeTags: [],
            isAuthenticated: undefined,
            location: null,
            bookmarked: false,
            visited: false
        });
        onAddressInputChange(""); // Clear address input too
    };


    return (
        <>
        <div className="map-sidebar">
            <div className="sidebar-section">
                <ReportButton
                src="/REPORT.png"
                onClick={handleOpenArtworkForm}
                />
            </div>

            {showArtworkForm && <ArtworkForm onClose={handleCloseArtworkForm} refreshTrigger={refreshTrigger} />}

            <div className="sidebar-section filters-section">
                <h3>Filter Banksy by:</h3>

                <fieldset className="filter-group">
                    <label htmlFor="theme-select">Tags:</label>
                    <select
                    id="theme-select"
                    multiple
                    value={filters.themeTags.length === 0 ? ["All"] : filters.themeTags}
                    onChange={(e) => handleThemeChange(e.target.selectedOptions)}
                    className="theme-select"
                    >
                    <option value="All">All</option>
                    {availableThemes.map(theme => (
                        <option key={theme} value={theme}>
                        {theme}
                        </option>
                    ))}
                    </select>
                    <small>Hold Ctrl/Cmd to select multiple themes</small>
                </fieldset>

                {/* Authentication Filter */}
                <fieldset className="filter-group">
                    <label>Authenticity:</label>
                    <div className="radio-group">
                        <label className="radio-label">
                        <input
                            type="radio"
                            name="auth-filter"
                            checked={filters.isAuthenticated === undefined}
                            onChange={() => handleAuthChange(undefined)}
                            />
                            All
                        </label>
                        <label className="radio-label">
                            <input
                            type="radio"
                            name="auth-filter"
                            checked={filters.isAuthenticated === true}
                            onChange={() => handleAuthChange(true)}
                            />
                            Certified Banksy only
                        </label>
                        <label className="radio-label">
                            <input
                            type="radio"
                            name="auth-filter"
                            checked={filters.isAuthenticated === false}
                            onChange={() => handleAuthChange(false)}
                            />
                            Pending authentication
                        </label>
                    </div>
                </fieldset>
                {user._id && (
                    <fieldset className="filter-group">
                    <label>My Collection:</label>
                    <div className="checkbox-group">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.bookmarked || false}
                                onChange={(e) => handleBookmarkedChange(e.target.checked)}
                            />
                            Show only bookmarked
                        </label>
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                checked={filters.visited || false}
                                onChange={(e) => handleVisitedChange(e.target.checked)}
                            />
                            Show only visited
                        </label>
                    </div>
                    {(filters.bookmarked && filters.visited) && (
                        <small>Showing artworks that are both bookmarked AND visited</small>
                    )}
                </fieldset>
                )}

                <fieldset className="filter-group">
                    <label htmlFor="address-input">Find a Banksy near me:</label>
                    <div className="location-input-group">
                        <input
                            id="address-input"
                            type="text"
                            value={addressInput}
                            onChange={(e) => onAddressInputChange(e.target.value)}
                            placeholder="Type an address to search..."
                            className="address-input"
                        />
                        {isSearchingAddress && (
                            <div className="search-indicator">Searching...</div>
                        )}
                    </div>

                <button
                    onClick={onUseCurrentLocation}
                    className="current-location-button"
                    disabled={isGettingLocation}
                >
                    {isGettingLocation ? 'Getting Location...' : 'Use Current Location'}
                </button>

                {filters.location && (
                <div className="distance-control">
                        <label htmlFor="distance-slider">
                        Max Distance: {(filters.location.maxDistance / 1000).toFixed(1)}km
                        </label>
                        <input
                        id="distance-slider"
                        type="range"
                        min="100"
                        max="10000"
                        step="100"
                        value={filters.location.maxDistance}
                        onChange={(e) => handleDistanceChange(e.target.value)}
                        className="distance-slider"
                        />
                        <div className="distance-labels">
                        <span>0.1km</span>
                        <span>10km</span>
                        </div>
                        
                        <button
                        onClick={handleClearLocation}
                        className="clear-location-button"
                        >
                        Clear Location Filter
                        </button>
                    </div>
                )}
                </fieldset>

                <fieldset className="filter-group">
                    <button
                        onClick={handleClearAllFilters}
                        className="clear-all-filters-button"
                    >
                        Clear All Filters
                    </button>
                </fieldset>

            </div>
        </div>
        </>

    );
};

export default MapSideBar;