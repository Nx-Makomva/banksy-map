import { useState } from "react";
import { TabBar } from "./TabBar";
import VisitsContainer  from "./VisitsContainer";
import BookmarksContainer from "./BookmarksContainer";
import { CommentsContainer } from "./CommentsContainer";


export function ProfileMainContainer({ isBookmarked, setIsBookmarked, isVisited, setIsVisited }) {
    const [activeTab, setActiveTab] = useState('collected'); // 'collected', 'bookmarks' or 'comments'


    return (
        <>
        <div className="profile-main-container">
        <TabBar setActiveTab={setActiveTab}/>
        {activeTab === 'collected' && <VisitsContainer setIsVisited={setIsVisited} />}
        {activeTab === 'bookmarks' && <BookmarksContainer setIsBookmarked={setIsBookmarked}/>}
        {activeTab === 'comments' && <CommentsContainer/>}
        </div>
        </>
    );
}