import { useEffect, useState } from "react";
import BadgeCard from "./BadgeCard";
import './MyBadgesModal.css';

function MyBadgesModal({ onClose, earnedBadgeIds = [] }) {
    const [badges, setBadges] = useState([]);

    useEffect(() => {
        async function fetchBadges() { //define fetch as function  look at atwork.jsx
            const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/badges`);
            const data = await res.json();
            const withEarned = data.badge.map((badge) => ({
                ...badge,
                isEarned: earnedBadgeIds.includes(badge._id)
            }));
            setBadges(withEarned);
        }
        fetchBadges();
    }, [earnedBadgeIds]);

    return (
        <div className='modal-overlay'>
            <div className='modal-content'>
                <div className='modal-header'>
                    <button className='close-button' onClick={onClose}>
                        <span>✖</span>
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