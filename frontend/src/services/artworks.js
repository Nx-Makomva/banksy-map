const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

// Secure URL generator (fake URL, displayed on frontend), filename encoded
const getImageUrl = (key) => {
  return `${BACKEND_URL}/api/images/${encodeURIComponent(key)}`;
};

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

    console.log('Artwork created:', createdArtwork);
    return createdArtwork;
    
  } catch (error) {
    console.error('Error creating artwork:', error);
    throw error;
  }
}