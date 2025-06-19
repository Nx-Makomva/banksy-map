import MapSideBar from "./map/MapSideBar";
import { ProfileSideBar } from "./profile/ProfileSideBar";

function Sidebar({activeView}) {
    return (
        <div className="sidebar">
            {activeView === 'map' && <MapSideBar />}
            {activeView === 'account' && <ProfileSideBar />}
        </div>
    );
}

export default Sidebar;