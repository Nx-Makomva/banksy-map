// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createArtwork(uploadData) {
    const requestOptions = {
        method: "POST",
        body: uploadData
    };

    const response = await fetch(`${BACKEND_URL}/artworks`, requestOptions);

    if (response.status !== 201) {
        throw new Error("Unable to fetch posts");
    }  

    const createdArtwork = await response.json();
    console.log('Artwork created:', createdArtwork);
    return 
}