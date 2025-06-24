const BACKEND_URL = import.meta.env.VITE_BACKEND_URL; 

export const getImageUrl = (key) => {
  console.log("WE HIT URL ENCRYPTOR:", key)
  const encryptedUrl = `${BACKEND_URL}/image/${encodeURIComponent(key)}`;
  console.log("URL", encryptedUrl);
  return encryptedUrl
};