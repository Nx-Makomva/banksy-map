// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function createUser(data) {
  const response = await fetch(`${BACKEND_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  return await response.json();
}

export async function getUserById(id) {
  const response = await fetch(`${BACKEND_URL}/users/${id}`);

  if (!response.ok) {
    throw new Error('User not found');
  }

  return await response.json();
}

export async function addBookmarkedArtwork(userId, artworkId) {
  const response = await fetch(`${BACKEND_URL}/users/${userId}/bookmark/${artworkId}`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to add bookmark');
  }

  return await response.json();
}

export async function addVisitedArtwork(userId, artworkId) {
  const response = await fetch(`${BACKEND_URL}/users/${userId}/collected/${artworkId}`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to add visited artwork');
  }

  return await response.json();
}

export async function addBadgeToUser(userId, badgeId) {
  const response = await fetch(`$${BACKEND_URL}/users/${userId}/badges/${badgeId}`, {
    method: 'PATCH',
  });

  if (!response.ok) {
    throw new Error('Failed to add badge');
  }

  return await response.json();
}


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