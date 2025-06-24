// ArtworkFullPopup.jsx
import '../assets/styles/ArtworkFullPopup.css';
import BookmarkButton from './BookmarkButton';
import { useUser } from '../contexts/UserContext';
const ArtworkFullPopup = ({ artwork, onClose, isBookmarked, setIsBookmarked }) => {
    const { user } = useUser();
    const artworkId = artwork._id;

    return (
        <div className="artwork-full-popup artwork-popup">
        <div className="full-popup-header">
            <h2>{artwork.title}</h2>
            <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="full-popup-content">
            {artwork.photos && (
            <img 
                src={artwork.imageUrl}
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
            {user._id && (
                <BookmarkButton
                artworkId={artworkId}
                isBookmarked={isBookmarked}
                onToggle={setIsBookmarked}
                />
            )}
        </div>
        </div>
    );
};

export default ArtworkFullPopup;