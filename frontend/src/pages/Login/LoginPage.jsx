import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { login } from "../../services/authentication";
import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import "../../assets/styles/LoginPage.css"

export function LoginPage() {
    const { refreshUser } = useUser();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
        const token = await login(email, password);
        localStorage.setItem("token", token);
        await refreshUser();
        navigate("/");
        } catch (err) {
        alert("Invalid credentials")
        console.error(err);
        navigate("/login");
        }
    }

    // const handleClick = () =>{
    //     navigate("/signup")
    // } 

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    return (
        <>
        <Navbar />
            <form className="login-form" onSubmit={handleSubmit}>
                <label htmlFor="email">Email:</label>
                <input
                id="email"
                placeholder="Enter your email address..."
                type="text"
                value={email}
                onChange={handleEmailChange}
                />
                <label htmlFor="password">Password:</label>
                <input
                id="password"
                type="password"
                placeholder="Enter your password..."
                value={password}
                onChange={handlePasswordChange}
                />
                <input role="submit-button" id="submit" type="submit" value="Submit" />
                <p className="signup-link">
                Need an account? <Link to="/signup">Sign Up!</Link>
                </p>
            </form>
        
        </>
    );
}
