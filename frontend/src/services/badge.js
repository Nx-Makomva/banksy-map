// frontend/src/services/badge.js
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export async function getAllBadges() {
    const res = await fetch(`${BASE_URL}/badges`);
    if (!res.ok) throw new Error('Failed to fetch badges');
    const data = await res.json();
    return data.badge; // controller returns { badge: [...] }
}

export async function getBadgeById(id) {
    const res = await fetch(`${BASE_URL}/badges/${id}`);
    if (!res.ok) throw new Error('Failed to fetch badge');
    const data = await res.json();
    return data.badge; // controller returns { badge: {...} }
}

export async function getBadgesByCriteria(type) {
    const res = await fetch(`${BASE_URL}/badges/criteria/${type}`);
    if (!res.ok) throw new Error('Failed to fetch badges by criteria');
    const data = await res.json();
    return data.badge;
}

export async function createBadge(formData) {
    const res = await fetch(`${BASE_URL}/badges`, {
        method: 'POST',
        body: formData // must be FormData to support file upload
    });
    if (!res.ok) throw new Error('Failed to create badge');
    return await res.json();
}

export async function updateBadge(id, formData) {
    const res = await fetch(`${BASE_URL}/badges/${id}`, {
        method: 'PATCH',
        body: formData // also use FormData to support optional icon update
    });
    if (!res.ok) throw new Error('Failed to update badge');
    return await res.json();
}

export async function deleteBadge(id) {
    const res = await fetch(`${BASE_URL}/badges/${id}`, {
        method: 'DELETE'
    });
    if (!res.ok) throw new Error('Failed to delete badge');
    return await res.json();
}
