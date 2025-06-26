import { useEffect, useState } from "react";
import BadgeCard from "./BadgeCard";
import { getAllBadges } from "../services/badge"; // ← NEW IMPORT
import '../assets/styles/MyBadgesModal2.css';

function MyBadgesModal({ onClose, earnedBadgeIds = [] }) {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        async function loadBadges() {
            try {
                const allBadges = await getAllBadges();
                console.log("All Badges:", allBadges);
                console.log("Earned IDs:", earnedBadgeIds);

                const withEarned = allBadges.map((badge) => ({
                    ...badge,
                    isEarned: earnedBadgeIds.map(id => id.toString()).includes(badge._id.toString())
                }));

                setBadges(withEarned);
            } catch (error) {
                console.error("Failed to load badges:", error);
            }
        }

        loadBadges();
    }, [earnedBadgeIds]);

    return (
        <div className='modal-overlay'>
            <div className='modal-content2'>
                <div className='modal-header'>
                    <button className='close-button' onClick={onClose}>
                        <span>x</span>
                    </button>
                    <div className='spray-accent'></div>
                </div>
                
                <div className='badges-title-container'>
                    <h2 className='badges-title'>My Badges</h2>
                    <div className='title-underline'></div>
                </div>
                
                <div className='badges-grid'>
                    {badges.map((badge) => (
                        <BadgeCard 
                            key={badge._id} 
                            {...badge} 
                            sprayColor={badge.isEarned ? '#ff1744' : '#666'}
                        />
                    ))}
                </div>
                
                <div className='modal-footer'>
                    <div className='graffiti-signature'>
                        {badges.filter(b => b.isEarned).length} / {badges.length} UNLOCKED
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyBadgesModal;
