import MapSideBar from "./map/MapSideBar";
import { ProfileSideBar } from "./profile/ProfileSideBar";

function Sidebar({ activeView, loggedIn }) {
    return (
        <div className="sidebar">
            {activeView === 'map' && <MapSideBar />}
            {activeView === 'account' && <ProfileSideBar loggedIn={loggedIn} />}
        </div>
    );
}

export default Sidebar;