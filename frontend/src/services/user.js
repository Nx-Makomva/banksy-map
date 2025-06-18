// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// get currently logged-in user
export async function getMe(token) {
    const requestOptions = {
        method: "GET",
        headers: token? {
        Authorization: `Bearer ${token}`,
        } : {}, // No auth header if no token,
    };

    const response = await fetch(`${BACKEND_URL}/users/current`, requestOptions);
    
    // if (!response.ok){
    //     throw new Error('Unauthorized')
    // }

    const currentUserData = await response.json();
    return currentUserData;
}