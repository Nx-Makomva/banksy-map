// ArtworkMiniPopup.jsx
import '../../assets/styles/ArtworkMiniPopup.css'
import BookmarkButton from '../BookmarkButton';

const ArtworkMiniPopup = ({ artwork, onClose, onArtworkSelect, userId, isBookmarked, setIsBookmarked }) => {


    return (
        <div 
            className="artwork-mini-popup"
            onClick={(e) => e.stopPropagation()}
        >
            <button className="close-btn" onClick={onClose}>×</button>
            <div className="mini-content">
                {artwork.photos && (
                    <img 
                    src={artwork.photos} 
                    alt={artwork.title}
                    className="artwork-mini-image"
                    />
                )}
                
                <div className="artwork-mini-details">
                    <h2>{artwork.title}</h2>
                    {artwork.discoveryYear && <p><strong>Discovered:</strong> {artwork.discoveryYear}</p>}
                    {artwork.description && <p>{artwork.description}</p>}
                    {artwork?.address && (
                    <p><strong>Location:</strong> {artwork.address}</p>
                    )}
                </div>
                <BookmarkButton
                artworkId={artwork._id || artwork.id}
                userId={userId}
                isBookmarked={isBookmarked}
                onToggle={setIsBookmarked}
                />
                <button 
                    className="expand-btn"
                    onClick={() => onArtworkSelect(artwork)}
                >
                    View Big →
                </button>
            </div>
        </div>
    );
};

export default ArtworkMiniPopup;