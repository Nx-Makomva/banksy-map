import { addBookmark, removeBookmark } from '../services/bookmarks';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import "../assets/styles/BookmarkButton.css";
import { useUser } from "../contexts/UserContext";

const BookmarkButton = ({ artworkId, isBookmarked, onToggle }) => {

    const { refreshUser } = useUser();

    const handleClick = async () => {
        try {
        if (isBookmarked) {
            await removeBookmark(artworkId);
            await refreshUser();
        } else {
            await addBookmark(artworkId);
            await refreshUser();
        }
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
