const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { getImageUrl } from "../utils/s3url";

export async function createArtwork(formData) {
  const requestOptions = {
    method: "POST",
    body: formData
  };

  try {
    const response = await fetch(`${BACKEND_URL}/artworks`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to create artwork");
    }

    const createdArtwork = await response.json();
    
    // Adding full image URL to response
    if (createdArtwork.artwork?.photos?.[0]) {
      createdArtwork.artwork.imageUrl = getImageUrl(createdArtwork.artwork.photos[0]);
    }

    return createdArtwork;
    
  } catch (error) {
    console.error('Error creating artwork:', error);
    throw error;
  }
}

export async function getAllArtworks(queryParams = {}) {
  const token = localStorage.getItem("token");

  const requestOptions = {
      method: "GET",
      ...token && ( { headers: {"Authorization": `Bearer ${token}` } } ) 
      // token only necessary when user logged in and filtering according to their visited or bookmarked artworks
      // otherwise headers should be empty
  };
  try {
    // Build query string from parameters - so if a query is present it appends it to url
    // this function allows for filtering but default behaviour is - returns all artworks if no filter present.
    const searchParams = new URLSearchParams();
    
    Object.entries(queryParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v));
        } else {
          searchParams.append(key, value);
        }
      }
    });

    const queryString = searchParams.toString();
    const url = `${BACKEND_URL}/artworks${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch artworks");
    }
    
    const data = await response.json();
    
    // adds image urls to artwork
    if (data.allArtworks) {
      data.allArtworks = data.allArtworks.map(artwork => ({
        ...artwork,
        imageUrl: artwork.photos?.[0] ? getImageUrl(artwork.photos[0]) : null
      }));
    }
    
    return data;
    
  } catch (error) {
    console.error('Error fetching artworks:', error);
    throw error;
  }
}

export async function getSingleArtwork(id) {
  try {
    const response = await fetch(`${BACKEND_URL}/artworks/${id}`);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch artwork");
    }
    
    const data = await response.json();
    
    if (data.artwork?.photos?.[0]) {
      data.artwork.imageUrl = getImageUrl(data.artwork.photos[0]);
    }
    
    return data;
    
  } catch (error) {
    console.error('Error fetching single artwork:', error);
    throw error;
  }
}

export async function updateArtwork(id, updateData) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(updateData)
  };

  try {
    const response = await fetch(`${BACKEND_URL}/artworks/${id}`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update artwork");
    }
    
    const data = await response.json();

    if (data.updatedArtwork?.photos?.[0]) {
      data.updatedArtwork.imageUrl = getImageUrl(data.updatedArtwork.photos[0]);
    }
    
    return data;
    
  } catch (error) {
    console.error('Error updating artwork:', error);
    throw error;
  }
}

export async function deleteArtwork(id) {
  const requestOptions = {
    method: "DELETE"
  };

  try {
    const response = await fetch(`${BACKEND_URL}/artworks/${id}`, requestOptions);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to delete artwork");
    }
    
    const data = await response.json();
    
    return data;
    
  } catch (error) {
    console.error('Error deleting artwork:', error);
    throw error;
  }
}