const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

export const getImageUrl = (key) => {
  const encryptedUrl = `${BACKEND_URL}/image/${encodeURIComponent(key)}`;
  return encryptedUrl
};