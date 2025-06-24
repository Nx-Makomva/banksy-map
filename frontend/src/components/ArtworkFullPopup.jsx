// ArtworkFullPopup.jsx
import '../assets/styles/ArtworkFullPopup.css';
import BookmarkButton from './BookmarkButton';
import { getImageUrl } from '../utils/s3url';
import VisitButton from './VisitButton';

const ArtworkFullPopup = ({ artwork, onClose, isBookmarked, setIsBookmarked, isVisited, setIsVisited }) => {
    
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
            {artworkId && (
                <BookmarkButton
                artworkId={artwork._id}
                isBookmarked={isBookmarked}
                onToggle={setIsBookmarked}
                />
            )}
            <VisitButton
            artworkId={artwork._id}
            isVisited={isVisited}
            onToggle={setIsVisited}
            />
        </div>
        <button className='collected-button'>I collected it</button>
        <button className='bookmarked-button'>Collect it later</button>
        <button className='comment-button'>Leave a comment</button>
        </div>
    );
};

export default ArtworkFullPopup;