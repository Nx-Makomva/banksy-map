import { useState } from "react";
import { TabBar } from "./TabBar";
import { CollectedContainer } from "./CollectedContainer";
import BookmarksContainer from "./BookmarksContainer";
import { CommentsContainer } from "./CommentsContainer";


export function ProfileMainContainer({ userId , isBookmarked, setIsBookmarked }) {
    const [activeTab, setActiveTab] = useState('collected'); // 'collected', 'bookmarks' or 'comments'


    return (
        <>
        <div className="profile-main-container">
        <TabBar setActiveTab={setActiveTab}/>
        {activeTab === 'collected' && <CollectedContainer/>}
        {activeTab === 'bookmarks' && <BookmarksContainer userId={userId} isBookmarked={isBookmarked} setIsBookmarked={setIsBookmarked}/>}
        {activeTab === 'comments' && <CommentsContainer/>}
        </div>
        </>
    );
}