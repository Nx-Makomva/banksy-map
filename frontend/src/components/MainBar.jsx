import Map from "./map/Map";
import { ProfileMainContainer } from "./profile/ProfileMainContainer";

function MainBar({activeView}) {
    return (
        <div className="main-content">
          {activeView === 'map' && <Map />}
          {activeView === 'account' && <ProfileMainContainer />}
        </div>
    );
}

export default MainBar;