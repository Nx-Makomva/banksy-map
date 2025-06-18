//import User from "../../../../api/models/user";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar";
import Sidebar from "../../components/Sidebar";
import MainBar from "../../components/MainBar";
import "../../assets/styles/HomePage.css";


export function HomePage() {
    // this gets the user who is logged in
    const { user, logout } = useUser()
    const navigate = useNavigate();
    const loggedIn = user?.isLoggedIn;
    console.log(user)

    const handleLogout = async () => {
        await logout();
        navigate("/")
    }

    return (
        <>
        <Navbar onLogOut={handleLogout} loggedIn={loggedIn}/>
        <div className="pageColumnsContainer">
            <Sidebar />
            <MainBar />
        </div>
        </>
    );
}