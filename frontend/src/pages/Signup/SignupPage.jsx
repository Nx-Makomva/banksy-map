import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Navbar from "../../components/NavBar";
import { signup } from "../../services/authentication";
import "../../assets/styles/SignupPage.css"

export function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
        await signup(email, password, firstName, lastName);
        navigate("/login");
        } catch (err) {
        console.error(err);
        navigate("/signup");
        }
    }

    return (
        <>
        <Navbar />
            <form onSubmit={handleSubmit} className="signup-form" aria-label="Submit form">
                <label htmlFor="firstname">First Name:</label>
                <input
                placeholder="Enter your first name..."
                id="firstname"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                />
                <label htmlFor="lastname">Last Name:</label>
                <input
                placeholder="Enter your last name..."
                id="lastname"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                />
                <label htmlFor="email">Email:</label>
                <input
                placeholder="Enter your email address..."
                id="email"
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="password">Password:</label>
                <input
                placeholder="Choose a password..."
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                />
                <input id="submit" type="submit" value="Submit" aria-label="Submit signup form"/>
                <p className="signup-link">
                Already have an account? <Link to="/login">Log In!</Link>
                </p>
            </form>
        </>
    );
}