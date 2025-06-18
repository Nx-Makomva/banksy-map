//import User from "../../../../api/models/user";
import { useUser } from "../../contexts/UserContext";
import { Link, useNavigate } from "react-router-dom";


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
            <div className="home">
                <h1>Welcome to the Banksy Map!</h1>
                {loggedIn ? (
                    <button onClick={handleLogout} className="logout-button">
                        Logout
                    </button>
                ) : (
                    <div className="auth-links">
                        <Link to="/signup">Sign Up</Link>
                        <br />
                        <Link to="/login">Log In</Link>
                    </div>
                )}

            </div>
        </>
    )
}