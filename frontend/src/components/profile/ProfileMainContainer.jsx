import { useState } from "react";
import { TabBar } from "./TabBar";
import VisitsContainer  from "./VisitsContainer";
import BookmarksContainer from "./BookmarksContainer";
import CommentsContainer from "./CommentsContainer";


export function ProfileMainContainer({ setIsBookmarked, setIsVisited, onArtworkSelect }) {
    const [activeTab, setActiveTab] = useState('collected'); // 'collected', 'bookmarks' or 'comments'


    return (
        <>
        <div className="profile-main-container">
        <TabBar setActiveTab={setActiveTab}/>
        {activeTab === 'collected' && <VisitsContainer setIsVisited={setIsVisited} onArtworkSelect={onArtworkSelect} />}
        {activeTab === 'bookmarks' && <BookmarksContainer setIsBookmarked={setIsBookmarked} onArtworkSelect={onArtworkSelect}/>}
        {activeTab === 'comments' && <CommentsContainer onArtworkSelect={onArtworkSelect} />}
        </div>
        </>
    );
}