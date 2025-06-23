const GEOCODE_API_KEY = import.meta.env.VITE_GOOGLE_GEOCODE_API_KEY;

export async function geocodeAddress(artworkAddress) {
  const encodedAddress = encodeURIComponent(artworkAddress);

  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}&key=${GEOCODE_API_KEY}`

  const response = await fetch(url);
  const data = await response.json();

  if (data.status !== "OK") {
    console.error(data.status);
    throw new Error("Error geocoding address. Could not retrieve coordinates.");
  }

  const { lat, lng } = data.results[0].geometry.location
  return { lat, lng }
}