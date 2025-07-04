const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function addComment(artworkId, text) {

  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BACKEND_URL}/comments/${artworkId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        text: text
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to add comment');
    }

    const data = await response.json();
    return data.readyForResponse;
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error; 
  }
};

export async function getAllUserComments() {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(`${BACKEND_URL}/comments/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to fetch comments');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching user comments:', error);
    throw error; 
  }
};

export async function getCommentsByArtworkId(artworkId) {
  try {
    const response = await fetch(`${BACKEND_URL}/comments/${artworkId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Include auth token if needed
        ...(localStorage.getItem('token') && {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        })
      }
    });


    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(errorData.message || 'Failed to fetch comments');
      error.status = response.status;
      error.cause = errorData.error;
      throw error;
    }
    const data = await response.json();
    return data
  } catch (error) {
    console.error('Error fetching comments:', error);
    throw error; // Re-throw for handling in components
  }
};


export async function updateComment(commentId, updates) {
  try {
    console.log(commentId)
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BACKEND_URL}/comments/${commentId}`,
      {
        method: 'PATCH', 
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({text: updates})
      }
    );
    

    if (!response.ok) {
      const errorData = await response.json();
      const err = new Error('Failed to update comment');
      err.cause = errorData.error || errorData.message;
      throw err;
    }
    const data = await response.json()
    return data.updatedComment;
  } catch (error) {
    console.error('Error updating comment:', error);
    throw error;
  }
};

export async function deleteComment(commentId) {
  try {
    const token = localStorage.getItem('token');
    const response = await fetch(
      `${BACKEND_URL}/comments/${commentId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      const err = new Error('Failed to delete comment');
      err.cause = errorData.error || errorData.message;
      throw err;
    }

    return await response.json();
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}