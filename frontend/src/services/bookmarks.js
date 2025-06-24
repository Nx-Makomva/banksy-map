const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function addBookmark(artworkId) {
    const token = localStorage.getItem("token");

    const requestOptions = {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ artwork_id: artworkId }) 
    };

    try {
        const response = await fetch(`${BACKEND_URL}/bookmarks`, requestOptions);

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add bookmark");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding bookmark:", error);
        throw error;
    }
}

export async function removeBookmark(artworkId) {
    const token = localStorage.getItem("token");
    const requestOptions = {
        method: "DELETE",
        headers: {
        "Authorization": `Bearer ${token}` 
        } 
    };

    try {
        const response = await fetch(`${BACKEND_URL}/bookmarks/${artworkId}`, requestOptions);

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove bookmark");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error removing bookmark:", error);
        throw error;
    }
}