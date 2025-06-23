import { addBookmark, removeBookmark } from '../services/bookmarks';
import { FaRegBookmark } from "react-icons/fa";
import { FaBookmark } from "react-icons/fa";
import "../assets/styles/BookmarkButton.css"

const BookmarkButton = ({ artworkId, userId, isBookmarked, onToggle }) => {
    const handleClick = async () => {
        try {
        if (isBookmarked) {
            await removeBookmark(userId, artworkId);
        } else {
            await addBookmark(userId, artworkId);
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
