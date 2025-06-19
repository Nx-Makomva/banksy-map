//import User from "../../../../api/models/user";
import { useUser } from "../../contexts/UserContext";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MainBar from "../../components/MainBar";
import "../../assets/styles/HomePage.css";


export function HomePage() {
    // this gets the user who is logged in
    const { user, logout } = useUser()
    const navigate = useNavigate();
    const loggedIn = user?._id;
    console.log(loggedIn)
    console.log(user)

    // Use single state to manage which view is active - clicks are made in navbar
    const [activeView, setActiveView] = useState('map'); // 'map' or 'account'

    const handleLogout = async () => {
        await logout();
        navigate("/")
    }

    const handleAccountClick = (event) => {
        event.preventDefault();
        setActiveView('account');
    }

    const handleMapClick = (event) => {
        event.preventDefault();
        setActiveView('map');
    }

    return (
        <>
        <Navbar 
            onLogOut={handleLogout} 
            loggedIn={loggedIn} 
            onAccountClick={handleAccountClick}
            onMapClick={handleMapClick}
        />
        <div className="pageColumnsContainer">
            <Sidebar 
                activeView={activeView}
            />
            <MainBar 
                activeView={activeView}
            />
        </div>
        </>
    );
}