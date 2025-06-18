import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useState, useEffect } from 'react';
import { HomePage } from "./pages/Home/HomePage";
import { LoginPage } from "./pages/Login/LoginPage";
import { SignupPage } from "./pages/Signup/SignupPage";
import { getMe } from "./services/user";
import { UserContext } from './contexts/UserContext';
import './App.css'


// docs: https://reactrouter.com/en/main/start/overview

// creates routes
const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/signup",
    element: <SignupPage />,
  }
]);

// app func
function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

    // Function to get current user from backend
  const getCurrentUser = async () => {
    const token = localStorage.getItem('token');
    
    try {
      const userData = await getMe(token);
      console.log("getMe returned:", userData);
      setUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user:', error);
      localStorage.removeItem('token');
      setUser({ isLoggedIn: false, id: null });
    } finally {
      setLoading(false);
    }
  };

  // Check for existing session on app load
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Function to refresh user data (can be called after login from other components)
  const refreshUser = async () => {
    await getCurrentUser();
  };

  // Logout function
  const logout = async () => {
    localStorage.removeItem('token');
    const userData = await getMe(); // Call without token to get anonymous user
    setUser(userData);
  };

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh' 
      }}>
        Loading...
      </div>
    );
  }

  return (
    <UserContext.Provider value={{ user, setUser, getCurrentUser, refreshUser, logout }}>
      <RouterProvider router={router} />
    </UserContext.Provider>

  );
}

export default App;