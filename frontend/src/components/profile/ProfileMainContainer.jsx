import { useState } from "react";
import { TabBar } from "./TabBar";
import { CollectedContainer } from "./CollectedContainer";
import { BookmarksContainer } from "./BookmarksContainer";
import { CommentsContainer } from "./CommentsContainer";


export function ProfileMainContainer() {
    const [activeTab, setActiveTab] = useState('collected'); // 'collected', 'bookmarks' or 'comments'


    return (
        <>
        <div className="profileSideBar">
        <TabBar setActiveTab={setActiveTab}/>
        {activeTab === 'collected' && <CollectedContainer/>}
        {activeTab === 'bookmarks' && <BookmarksContainer/>}
        {activeTab === 'comments' && <CommentsContainer/>}
        </div>
        </>
    );
}