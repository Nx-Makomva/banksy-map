import React, { useState } from 'react';
import './Navbar.css';
import { FaMapMarkedAlt } from "react-icons/fa";
import { MdAccountBox } from "react-icons/md";
import { PiSignOutBold } from "react-icons/pi";
import { FiLogIn } from "react-icons/fi";
import { SiGnuprivacyguard } from "react-icons/si";

function Navbar() {
    // Replace this with your real auth state
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    return (
        <header>
        <div className="navbar-container">
            <a className="logo">
            <img src="/banksymap.png" alt="Logo" />
            </a>
            <nav className="navbar">
            <a href="/" title="Map"><FaMapMarkedAlt /></a>

            {isLoggedIn ? (
                <>
                <a href="/account" title="My Account"><MdAccountBox /></a>
                <a href="/logout" title="Logout"><PiSignOutBold /></a>
                </>
            ) : (
                <>
                <a href="/login" title="Login"><FiLogIn /></a>
                <a href="/signup" title="Sign Up"><SiGnuprivacyguard /></a>
                </>
            )}
            </nav>
        </div>
        </header>
    );
}

export default Navbar;