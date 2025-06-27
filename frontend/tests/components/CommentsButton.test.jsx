import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, beforeAll, afterAll } from 'vitest';
import userEvent from '@testing-library/user-event';
import { UserContext } from '../../src/contexts/UserContext';

vi.mock('../../src/services/comments', async (importOriginal) => {
  const mod = await importOriginal();
  return {
    ...mod,
    addComment: vi.fn() // This will be replaced in beforeEach
  };
});

import CommentButton, { CommentForm } from '../../src/components/CommentsButton';

beforeAll(() => {
  const portalRoot = document.createElement('div');
  portalRoot.setAttribute('id', 'modal-root');
  document.body.appendChild(portalRoot);
});

afterAll(() => {
  const portalRoot = document.getElementById('modal-root');
  if (portalRoot) document.body.removeChild(portalRoot);
});

// Mock user data
const mockUser = {
  _id: 'user123',
  firstName: 'John',
  lastName: 'Doe'
};

const Wrapper = ({ children }) => (
  <UserContext.Provider value={{ user: mockUser }}>
    {children}
  </UserContext.Provider>
);

describe('CommentButton', () => {
  let mockAddComment;
  let mockOnCommentPosted;
  const mockArtworkId = 'artwork123';

  // 3. Before each test, get a fresh reference to the mock
  beforeEach(async () => {
    // Reset all mocks
    vi.clearAllMocks();
    
    // Get the actual mock function
    const commentsModule = await import('../../src/services/comments');
    mockAddComment = commentsModule.addComment;
    mockAddComment.mockReset().mockResolvedValue({
      _id: 'comment123',
      text: 'Test comment'
    });
    
    mockOnCommentPosted = vi.fn();
  });

  it('should use the mock', async () => {
    const commentsModule = await import('../../src/services/comments');
    expect(commentsModule.addComment).toBe(mockAddComment); // Verify mock is used
  });

  it('submits a comment with user data', async () => {
    render(
      <CommentButton 
        artworkId={mockArtworkId} 
        onCommentPosted={mockOnCommentPosted}
      />,
      { wrapper: Wrapper }
    );

    // Open form
    await userEvent.click(screen.getByRole('button'));
    
    // Fill form
    await userEvent.type(screen.getByRole('textbox'), 'Test comment');
    
    // Submit form
    await userEvent.click(screen.getByRole('button', { name: /post/i }));

    // Verify
    await waitFor(() => {
      expect(mockAddComment).toHaveBeenCalledWith(mockArtworkId, 'Test comment');
    });
  });

  it('renders the comment button with icon', () => {
    render(<CommentButton artworkId={mockArtworkId} />, { wrapper: Wrapper });
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByTestId('comment-icon')).toBeInTheDocument();
  });

  it('opens the comment form when clicked', async () => {
    render(<CommentButton artworkId={mockArtworkId} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument();
    });
  });

  it('closes the form when onClose is called', async () => {
    render(<CommentButton artworkId={mockArtworkId} />, { wrapper: Wrapper });
    fireEvent.click(screen.getByRole('button'));
    
    await waitFor(() => {
      const cancelButton = screen.getByText('Cancel');
      fireEvent.click(cancelButton);
    });

    await waitFor(() => {
      expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });
  });


    it('shows error when comment submission fails', async () => {
      mockAddComment.mockRejectedValue(new Error('Network error'));
      
      render(
        <CommentButton artworkId={mockArtworkId} />,
        { wrapper: Wrapper }
      );

      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Test comment' } });
        
        const form = screen.getByTestId('comment-form');
        fireEvent.submit(form);
      });

      await waitFor(() => {
        expect(screen.getByText('Failed to add comment')).toBeInTheDocument();
      });
    });

    it('disables form during submission', async () => {
      let resolveComment;
      const promise = new Promise(resolve => {
        resolveComment = resolve;
      });
      mockAddComment.mockReturnValue(promise);

      render(
        <CommentButton artworkId={mockArtworkId} />,
        { wrapper: Wrapper }
      );

      fireEvent.click(screen.getByRole('button'));
      
      await waitFor(() => {
        const textarea = screen.getByRole('textbox');
        fireEvent.change(textarea, { target: { value: 'Test comment' } });
        
        const form = screen.getByTestId('comment-form');
        fireEvent.submit(form);
      });

      expect(screen.getByText('Posting...')).toBeInTheDocument();
      expect(screen.getByText('Cancel')).toBeDisabled();

      resolveComment({ _id: 'comment123', text: 'Test comment' });
      await waitFor(() => {
        expect(screen.queryByText('Posting...')).not.toBeInTheDocument();
      });
    });
  });
