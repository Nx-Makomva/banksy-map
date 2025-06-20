import { useState } from "react";
import { TabBar } from "./TabBar";
import { CollectedContainer } from "./CollectedContainer";
import { BookmarksContainer } from "./BookmarksContainer";
import { CommentsContainer } from "./CommentsContainer";


export function ProfileMainContainer() {
    const [activeTab, setActiveTab] = useState('collected'); // 'collected', 'bookmarks' or 'comments'


    return (
        <>
        <div className="profile-main-container">
        <TabBar setActiveTab={setActiveTab}/>
        {activeTab === 'collected' && <CollectedContainer/>}
        {activeTab === 'bookmarks' && <BookmarksContainer/>}
        {activeTab === 'comments' && <CommentsContainer/>}
        </div>
        <div>
            <img
                src={"https://banksy-artwork-bucket.s3.eu-west-2.amazonaws.com/tesco-flag.avif"}
                alt={ "Banksy image"}
                className="artwork-image"
                width={500}
              />
        </div>
        </>
    );
}