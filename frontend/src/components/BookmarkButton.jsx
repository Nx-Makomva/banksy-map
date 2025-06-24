// import { addBookmark, removeBookmark } from '../services/bookmarks';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import "../assets/styles/BookmarkButton.css";
import { useUser } from "../contexts/UserContext";
import { addBookmarkedArtwork } from '../services/user';

const BookmarkButton = ({ artworkId, isBookmarked, onToggle }) => {

    const { user, refreshUser } = useUser();

    const handleClick = async () => {
        try {
            await addBookmarkedArtwork(user._id, artworkId);
            await refreshUser();
            onToggle(!isBookmarked, artworkId);
        } catch (error) {
            console.error('Bookmark error:', error);
        }
    };

    return (
        <button
        className='bookmark-button'
        onClick={handleClick}
        aria-pressed={isBookmarked}
        title={isBookmarked ? 'Remove bookmark' : 'Add bookmark'}
        >
        {isBookmarked ? <FaBookmark /> : <FaRegBookmark />}
        </button>
    );
};

export default BookmarkButton;
