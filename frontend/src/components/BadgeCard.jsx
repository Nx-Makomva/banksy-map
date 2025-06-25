import './BadgeCard.css';

function BadgeCard({ name, description, icon, isEarned, style = 'classic', sprayColor = '#ff1744' }) {
    return (
        <div className={`badge-card ${isEarned ? 'earned' : 'locked'} ${style}`}>
            <div className="badge-card-inner">
                <div className="spray-effect" style={{ '--spray-color': sprayColor }}></div>
                <div className="stencil-border"></div>
                
                <div className="badge-icon-container">
                    <div className="icon-stencil">
                        <img
                            src={icon || '/default-badge.png'}
                            alt={name}
                            className="badge-icon"
                        />
                    </div>
                    {!isEarned && <div className="lock-overlay">🔒</div>}
                </div>
                
                <div className="badge-content">
                    <h4 className="badge-name">{name}</h4>
                    <p className="badge-description">{description}</p>
                </div>
                
                {isEarned && (
                    <div className="earned-tag">
                        <span>UNLOCKED</span>
                    </div>
                )}
                
                <div className="graffiti-dots">
                    <span className="dot"></span>
                    <span className="dot"></span>
                    <span className="dot"></span>
                </div>
            </div>
        </div>
    );
}

export default BadgeCard;