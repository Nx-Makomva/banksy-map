import React from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import MainBar from "../components/MainBar";
import "./HomePage.css";

function HomePage() {
    return (
        <>
        <Navbar />
        <div className="pageColumnsContainer">
            <Sidebar />
            <MainBar />
        </div>
        </>
    );
}

export default HomePage;