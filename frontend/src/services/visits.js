const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function addVisit(artworkId) {
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
        const response = await fetch(`${BACKEND_URL}/visits`, requestOptions);

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to add visit");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error adding visit:", error);
        throw error;
    }
}

    export async function removeVisit(artworkId) {
    const token = localStorage.getItem("token");
    const requestOptions = {
        method: "DELETE",
        headers: {
        "Authorization": `Bearer ${token}` 
        } 
    };

    try {
        const response = await fetch(`${BACKEND_URL}/visits/${artworkId}`, requestOptions);

        if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to remove visit");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error removing visit:", error);
        throw error;
    }
    }
