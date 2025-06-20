import MapContainer from "./map/MapContainer";
import { ProfileMainContainer } from "./profile/ProfileMainContainer";
import ArtworkMiniPopup from "./map/ArtworkMiniPopup";
import ArtworkFullPopup from "./ArtworkFullPopup";

const MainBar = ({
      activeView, 
      artworks, 
      onArtworkSelect, 
      selectedArtwork,
      showFullPopup, 
      onClosePopup 
  }) => {

    return (
        <div className="main-content" style={{ position: 'relative' }}>
        {activeView === 'map' && (
          <>
            <MapContainer 
              artworks={artworks} 
              onArtworkSelect={onArtworkSelect}
              selectedArtwork={selectedArtwork} // Pass for marker highlighting
            />
            {/* Mini popup - positioned near marker */}
            {selectedArtwork && !showFullPopup && (
              <ArtworkMiniPopup
                artwork={selectedArtwork}
                onClose={onClosePopup}
                onArtworkSelect={onArtworkSelect} 
              />
            )}
          </>
        )}
          {activeView === 'account' && <ProfileMainContainer />}
                {/* Full popup overlay - covers entire MainBar */}
          {selectedArtwork && showFullPopup && (
            <ArtworkFullPopup
              artwork={selectedArtwork}
              onClose={onClosePopup}
            />
          )}
        </div>
    );
}

export default MainBar;