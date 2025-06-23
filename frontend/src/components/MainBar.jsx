import MapContainer from "./map/MapContainer";
import { ProfileMainContainer } from "./profile/ProfileMainContainer";
import ArtworkMiniPopup from "./map/ArtworkMiniPopup";
import ArtworkFullPopup from "./ArtworkFullPopup";
import { useUser } from '../contexts/UserContext';
import { useEffect, useState } from 'react';
import { getAllUserBookmarks } from '../services/bookmarks';

const MainBar = ({
      activeView, 
      artworks, 
      onArtworkSelect, 
      selectedArtwork,
      showFullPopup, 
      onClosePopup 
  }) => {

    const { user } = useUser();
    const userId = user?.id || user?._id;
    const artworkId = selectedArtwork?._id || selectedArtwork?.id;
    const [isBookmarked, setIsBookmarked] = useState(false);

    useEffect(() => {
      const checkBookmark = async () => {
        if (!userId || !artworkId) return;

        try {
          const data = await getAllUserBookmarks(userId);
          const alreadyBookmarked = data.bookmarks.some(b => b._id === artworkId);
          setIsBookmarked(alreadyBookmarked);
        } catch (err) {
          console.error("Failed to check if bookmarked", err);
        }
      };

      checkBookmark();
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
                userId={userId}
                isBookmarked={isBookmarked}
                setIsBookmarked={setIsBookmarked}
              />
            )}
          </>
        )}
          {activeView === 'account' && <ProfileMainContainer userId={userId} isBookmarked={true} setIsBookmarked={setIsBookmarked} />}
                {/* Full popup overlay - covers entire MainBar */}
          {selectedArtwork && showFullPopup && (
            <ArtworkFullPopup
              artwork={selectedArtwork}
              onClose={onClosePopup}
              userId={userId}
              isBookmarked={isBookmarked}
              setIsBookmarked={setIsBookmarked}
            />
          )}
        </div>
    );
}

export default MainBar;