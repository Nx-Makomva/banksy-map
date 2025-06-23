// ArtworkFullPopup.jsx
import '../assets/styles/ArtworkFullPopup.css';
import BookmarkButton from './BookmarkButton';


const ArtworkFullPopup = ({ artwork, onClose, userId, isBookmarked, setIsBookmarked }) => {
    
    const artworkId = artwork._id || artwork.id;

    return (
        <div className="artwork-full-popup artwork-popup">
        <div className="full-popup-header">
            <h2>{artwork.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="full-popup-content">
            {artwork.photos && (
            <img 
                src={artwork.photos} 
                alt={artwork.title}
                className="artwork-full-image"
            />
            )}
            
            <div className="artwork-full-details">
            {artwork.discoveryYear && <p><strong>Discovered:</strong> {artwork.discoveryYear}</p>}
            {artwork.description && <p>{artwork.description}</p>}
            {artwork?.address && (
                <p><strong>Location:</strong> {artwork.address}</p>
            )}
            </div>
            {userId && artworkId && (
                <BookmarkButton
                artworkId={artwork._id || artwork.id}
                userId={userId}
                isBookmarked={isBookmarked}
                onToggle={setIsBookmarked}
                />
            )}
        </div>
        </div>
    );
};

export default ArtworkFullPopup;