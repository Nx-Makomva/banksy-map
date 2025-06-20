import { useEffect, useState } from "react";
import "./Badge.css"; // create this for styling

const BadgeModal = ({ onClose }) => {
    const [badges, setBadges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
    const fetchBadges = async () => {
        try {
            const res = await fetch('http://localhost:3000/api/badges'); // 🔁 update if needed
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || "Failed to fetch badges");
            setBadges(data.badge || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    fetchBadges();
}, []);

return (
    <div className="badge-overlay">
        <div className="badge-modal">
            <button className="close-button" onClick={onClose}>❌</button>
            <h2>My Badges</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="error-text">{error}</p>}

            <div className="badge-grid">
                {badges.map(badge => (
                    <div key={badge._id} className="badge-item" title={badge.description}>
                        {badge.icon ? (
                            <img src={badge.icon} alt={badge.name} className="badge-icon" />
                        ) : (
                            <div className="default-icon">🏅</div>
                        )}
                        <span className="badge-name">{badge.name}</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
    );
};

export default BadgeModal;
