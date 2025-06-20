// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// get currently logged-in user
export async function getAllArtworks() {
    const requestOptions = {
        method: "GET"
    };

    const response = await fetch(`${BACKEND_URL}/artworks`, requestOptions);
    
    if (!response.ok){
        throw new Error('Error fetching artworks')
    }

    const artworksData = await response.json();
    return artworksData;
}