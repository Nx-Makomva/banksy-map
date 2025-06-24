import { useEffect, useState } from 'react';
import "../../assets/styles/BookmarksContainer.css";
import BookmarkButton from '../BookmarkButton';
import { useUser } from '../../contexts/UserContext';

const BookmarkedArtworksList = ({ setIsBookmarked }) => {

    const { user } = useUser()
    const userId = user._id
    const [bookmarkedArtworks, setBookmarkedArtworks] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBookmarks = async () => {
        try {
            const data = user.bookmarkedArtworks;
            setBookmarkedArtworks(data || []);
        } catch (err) {
            setError(err.message || "Error fetching bookmarks");
        }
        };

        if (userId) {
        fetchBookmarks();
        }
    }, [userId]);

    const handleBookmarkToggle = (newBookmarkState, artworkId) => {
        console.log('handleBookmarkToggle called with:', { newBookmarkState, artworkId });
        
        if (!newBookmarkState) {
            setBookmarkedArtworks(prev => 
            prev.filter(artwork => artwork._id !== artworkId)
            );
        };
        
        if (setIsBookmarked) {
            setIsBookmarked(newBookmarkState);
        };
    };

    if (error) return <p>Error: {error}</p>;

    return (
        <div className="tab-content-container">
        <h2>Your Bookmarked Artworks</h2>
        <ul>
            {bookmarkedArtworks.map((artwork) => (
            <li key={artwork._id}>
                <div className="artwork-header">
                    <div className="artwork-text">
                        <h3>{artwork.title}</h3>
                        <p>{artwork.description}</p>
                    </div>
                    <BookmarkButton
                    artworkId={artwork._id}
                    isBookmarked={true}
                    onToggle={handleBookmarkToggle}
                    />
                </div>
                {artwork.photos && (
                    <img
                        src={"http://localhost:3000/image/" + artwork.photos[0]}
                        alt={artwork.title}
                        style={{ width: '150px', borderRadius: '8px' }}
                    />
                )}
            </li>
            ))}
        </ul>
        </div>
    );
};

export default BookmarkedArtworksList;