import "../assets/styles/NavBar.css"
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { FiLogIn } from "react-icons/fi";
import { SiGnuprivacyguard } from "react-icons/si";
import { Link, useLocation } from "react-router-dom";

function Navbar({ loggedIn, onLogOut, onMapClick, onAccountClick }) {
    //check if we are on homepage for map button
    const location = useLocation();
    const isHomePage = location.pathname === '/';

    return (
        <header>
        <div className="navbar-container" data-testid="navbar">
            <a className="logo">
            <img src="/banksymap.png" alt="Logo" />
            </a>
            <nav className="navbar" role="navigation" aria-label="Main Navigation"> 
            <a href={isHomePage ? "#" : "/"}  onClick={onMapClick} title="Map" data-testid="map-button"><FaMapMarkedAlt /></a>

            {loggedIn ? (
                <>
                <a href="#"  onClick={onAccountClick} title="My Account" data-testid="account-button"><MdAccountBox /></a>
                <a href="/" onClick={onLogOut} title="Logout" data-testid="logout-button"><PiSignOutBold /></a>
                </>
            ) : (
                <>
                <Link to="/login" title="Login" data-testid="login-button"><FiLogIn /></Link>
                <Link to="/signup" title="Sign Up" data-testid="signup-button"><SiGnuprivacyguard /></Link>
                </>
            )}
            </nav>
        </div>
        </header>
    );
}

export default Navbar;