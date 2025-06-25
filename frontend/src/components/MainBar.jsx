import MapContainer from "./map/MapContainer";
import { ProfileMainContainer } from "./profile/ProfileMainContainer";
import ArtworkMiniPopup from "./map/ArtworkMiniPopup";
import ArtworkFullPopup from "./ArtworkFullPopup";
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';

const MainBar = ({
      activeView, 
      artworks, 
      onArtworkSelect, 
      selectedArtwork,
      showFullPopup, 
      onClosePopup 
  }) => {

    const { user } = useUser();
    const userId = user?._id;
    const artworkId = selectedArtwork?._id
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isVisited, setIsVisited] = useState(false);

    useEffect(() => {
      const fetchStatus = async () => {
        if (!userId || !artworkId) return;

        try {
          const alreadyBookmarked = user.bookmarkedArtworks?.some(b => b._id === artworkId);
          const alreadyVisited = user.visitedArtworks?.some(v => v._id === artworkId);
          setIsBookmarked(alreadyBookmarked);
          setIsVisited(alreadyVisited);
        } catch (err) {
          console.error("Failed to check if bookmarked", err);
        }
      };

      fetchStatus();
    }, [userId, artworkId]);

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
                isBookmarked={isBookmarked}
                setIsBookmarked={setIsBookmarked}
                isVisited={isVisited}
                setIsVisited={setIsVisited}
              />
            )}
          </>
        )}
          {activeView === 'account' && <ProfileMainContainer setIsBookmarked={setIsBookmarked} setIsVisited={setIsVisited} onArtworkSelect={onArtworkSelect} />}
                {/* Full popup overlay - covers entire MainBar */}
          {selectedArtwork && showFullPopup && (
            <ArtworkFullPopup
              artwork={selectedArtwork}
              onClose={onClosePopup}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
              isVisited={isVisited}
              setIsVisited={setIsVisited}
            />
          )}
        </div>
    );
}

export default MainBar;