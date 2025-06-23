import { useUser } from "../../contexts/UserContext";
// import "../../assets/styles/ProfileSideBar.css";
import BadgesButton from "./BadgesButton"

export function ProfileSideBar() {
    const { user } = useUser();

    const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    const fullName = `${user.firstName} ${user.lastName}`;
    const email = user.email;
    const bookmarkedCount = user.bookmarkedArtworks.length;
    const visitedCount = user.visitedArtworks.length;
    const badgesCount = user.badges.length;

    return (
        <div className="profileSideBar">
            <img src="/subwaysurfer.jpg" alt="Profile" className="profileImage"/>
            <div className="initials">{initials}</div>
            <div className="fullName">{fullName}</div>
            <div className="email">{email}</div>
            <hr />
            <div className="stat">Bookmarked Artworks: {bookmarkedCount}</div>
            <div className="stat">Visited Artworks: {visitedCount}</div>
            <div className="stat">Badges: {badgesCount}</div>
            <BadgesButton />
        </div>
    );
}