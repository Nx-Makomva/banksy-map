import { TabButton } from "./TabButton"

export const TabBar = ({ setActiveTab }) => {



    return (
        <div className="tab-bar">
            <TabButton name="collected" value="Collected" setActiveTab={setActiveTab}/>
            <TabButton name="bookmarks" value="Bookmarks" setActiveTab={setActiveTab}/>
            <TabButton name="comments" value="Comments" setActiveTab={setActiveTab}/>
        </div>
    )
}