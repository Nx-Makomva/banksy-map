import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { signup } from "../../services/authentication";

export function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleSubmit(event) {
        event.preventDefault();
        try {
        await signup(email, password);
        navigate("/login");
        } catch (err) {
        console.error(err);
        navigate("/signup");
        }
    }

    function handleEmailChange(event) {
        setEmail(event.target.value);
    }

    function handlePasswordChange(event) {
        setPassword(event.target.value);
    }

    return (
        <>
        <h2>Signup</h2>
        <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email:</label>
            <input
            id="email"
            type="text"
            value={email}
            onChange={handleEmailChange}
            />
            <label htmlFor="password">Password:</label>
            <input
            placeholder="Password"
            id="password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            />
            <input role="submit-button" id="submit" type="submit" value="Submit" />
        </form>
        </>
    );
}