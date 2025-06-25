import { addVisit, removeVisit } from '../services/visits';
import { TiTick } from "react-icons/ti";
import { TiTickOutline } from "react-icons/ti";
import "../assets/styles/VisitButton.css";
import { useUser } from "../contexts/UserContext";

const VisitButton = ({ artworkId, isVisited, onToggle }) => {

    const { refreshUser } = useUser();

    const handleClick = async () => {
        try {
        if (isVisited) {
            await removeVisit(artworkId);
            await refreshUser();
        } else {
            await addVisit(artworkId);
            await refreshUser();
        }
        onToggle(!isVisited, artworkId);
        } catch (error) {
        console.error('Bookmark error:', error);
        }
    };

    return (
        <button
        className='visit-button'
        onClick={handleClick}
        aria-pressed={isVisited}
        title={isVisited ? 'Remove visit' : 'Add visit'}
        >
        {isVisited ? <TiTick /> : <TiTickOutline />}
        </button>
    );
};

export default VisitButton;