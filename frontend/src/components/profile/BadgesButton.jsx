import { useState } from "react";
import { useUser } from "../../contexts/UserContext"; 
import MyBadgesModal from "../MyBadgesModal.jsx";
import "../../assets/styles/BadgesButton.css";

const BadgesButton = () => {
    const [showModal, setShowModal] = useState(false);
    const { user } = useUser(); 

    return (
        <>
            <button className="badges-button" onClick={() => setShowModal(true)}>
                <img src="/VIEW BADGES.png" alt="View Badges" />
            </button>
            {showModal && (
                <MyBadgesModal
                    onClose={() => setShowModal(false)}
                    earnedBadgeIds={user.badges.map(b => b._id)} 
                />
            )}
        </>
    );
};

export default BadgesButton;
