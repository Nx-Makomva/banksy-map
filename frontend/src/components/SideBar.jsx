import MapSideBar from "./map/MapSideBar";
import { ProfileSideBar } from "./profile/ProfileSideBar";

const Sidebar = ({ 
    activeView, 
    loggedIn, 
    artworks, 
    filters, 
    onFiltersChange, 
    addressInput,
    onAddressInputChange,
    isSearchingAddress,
    onUseCurrentLocation,
    isGettingLocation
}) =>  {
    return (
        <div className="sidebar">
            {activeView === 'map' && <MapSideBar 
                    artworks={artworks}
                    filters={filters}
                    onFiltersChange={onFiltersChange}
                    addressInput={addressInput}
                    onAddressInputChange={onAddressInputChange}
                    isSearchingAddress={isSearchingAddress}
                    onUseCurrentLocation={onUseCurrentLocation}
                    isGettingLocation={isGettingLocation}
            />}
            {activeView === 'account' && <ProfileSideBar loggedIn={loggedIn} />}
        </div>
    );
}

export default Sidebar;