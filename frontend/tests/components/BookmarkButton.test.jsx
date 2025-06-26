import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BookmarkButton from '../../src/components/BookmarkButton'; // Adjust relative path from test file


vi.mock('../../src/services/bookmarks', () => ({
    addBookmark: vi.fn(),
    removeBookmark: vi.fn(),
}));

import * as bookmarkService from '../../src/services/bookmarks';

// Mock the UserContext
import { useUser } from '../../src/contexts/UserContext';
vi.mock('../../src/contexts/UserContext');

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaRegBookmark: () => <span data-testid="unfilled-bookmark">☆</span>,
    FaBookmark: () => <span data-testid="filled-bookmark">★</span>,
}));

describe('BookmarkButton', () => {
    const mockOnToggle = vi.fn();
    const mockRefreshUser = vi.fn();

    beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useUser).mockReturnValue({
        refreshUser: mockRefreshUser,
    });
    });

    it('renders unfilled bookmark when not bookmarked', () => {
    render(
        <BookmarkButton artworkId="art123" isBookmarked={false} onToggle={mockOnToggle} />
    );

    expect(screen.getByTestId('unfilled-bookmark')).toBeInTheDocument();
    expect(screen.getByTitle('Add bookmark')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders filled bookmark when bookmarked', () => {
    render(
        <BookmarkButton artworkId="art123" isBookmarked={true} onToggle={mockOnToggle} />
    );

    expect(screen.getByTestId('filled-bookmark')).toBeInTheDocument();
    expect(screen.getByTitle('Remove bookmark')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('adds bookmark when clicked and not bookmarked', async () => {
    bookmarkService.addBookmark.mockResolvedValue(); // mock here

    render(
    <BookmarkButton 
        artworkId="art123" 
        isBookmarked={false} 
        onToggle={mockOnToggle} 
    />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
    expect(bookmarkService.addBookmark).toHaveBeenCalledWith('art123');
    expect(mockRefreshUser).toHaveBeenCalled();
    expect(mockOnToggle).toHaveBeenCalledWith(true, 'art123');
    });
    });

    it('removes bookmark when clicked and bookmarked', async () => {
    bookmarkService.removeBookmark.mockResolvedValue();

    render(
        <BookmarkButton artworkId="art123" isBookmarked={true} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(bookmarkService.removeBookmark).toHaveBeenCalledWith('art123');
        expect(mockRefreshUser).toHaveBeenCalled();
        expect(mockOnToggle).toHaveBeenCalledWith(false, 'art123');
    });
    });

    it('handles bookmark add error gracefully', async () => {
    const error = new Error('Network error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bookmarkService.addBookmark).mockRejectedValue(error);

    render(
        <BookmarkButton artworkId="art123" isBookmarked={false} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Bookmark error:', error);
    });

    consoleSpy.mockRestore();
    });

    it('handles bookmark remove error gracefully', async () => {
    const error = new Error('Server error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(bookmarkService.removeBookmark).mockRejectedValue(error);

    render(
        <BookmarkButton artworkId="art123" isBookmarked={true} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Bookmark error:', error);
    });

    consoleSpy.mockRestore();
    });

    it('does not call onToggle when service call fails', async () => {
    vi.mocked(bookmarkService.addBookmark).mockRejectedValue(new Error('Service error'));

    render(
        <BookmarkButton artworkId="art123" isBookmarked={false} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(bookmarkService.addBookmark).toHaveBeenCalled();
    });

    expect(mockOnToggle).not.toHaveBeenCalled();
    expect(mockRefreshUser).not.toHaveBeenCalled();
    });
});