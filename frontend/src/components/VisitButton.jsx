// import { addVisit, removeVisit } from '../services/visits';
import { TiTick } from "react-icons/ti";
import { TiTickOutline } from "react-icons/ti";
import "../assets/styles/VisitButton.css";
import { useUser } from "../contexts/UserContext";
import { addVisitedArtwork } from '../services/user';

const VisitButton = ({ artworkId, isVisited, onToggle }) => {

    const { user, refreshUser } = useUser();

    const handleClick = async () => {
        try {
            await addVisitedArtwork(user._id, artworkId);
            await refreshUser();
            onToggle(!isVisited, artworkId);
        } catch (error) {
            console.error('Visit error:', error);
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
