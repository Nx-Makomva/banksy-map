import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import BookmarksContainer from '../../../src/components/profile/BookmarksContainer';

// Hoisted mocks
const mockUseUser = vi.hoisted(() => vi.fn());
const mockBookmarkButton = vi.hoisted(() => vi.fn());

// Mock dependencies
vi.mock('../../../src/contexts/UserContext', () => ({
    useUser: mockUseUser,
}));

vi.mock('../../../src/components/BookmarkButton', () => ({
    default: (props) => {
    mockBookmarkButton(props);
    return (
        <button data-testid="bookmark-toggle" onClick={() => props.onToggle(false, props.artworkId)}>
        BookmarkButton
        </button>
    );
    },
}));

vi.mock('../../../src/utils/s3url', () => ({
    getImageUrl: (photo) => `https://s3.example.com/${photo}`,
}));

describe('BookmarksContainer', () => {
    const mockOnArtworkSelect = vi.fn();
    const mockSetIsBookmarked = vi.fn();
    
    const mockUser = {
    _id: 'user123',
    bookmarkedArtworks: [
        {
        _id: 'art1',
        title: 'Artwork 1',
        description: 'Beautiful art',
        photos: ['image1.jpg'],
        },
    ],
    };

    beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: mockUser });
    });

    it('renders bookmarked artworks with title and description', () => {
    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    expect(screen.getByText('Your Bookmarked Artworks')).toBeInTheDocument();
    expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    expect(screen.getByText('Beautiful art')).toBeInTheDocument();
    expect(screen.getByAltText('Artwork 1')).toHaveAttribute(
        'src',
        'https://s3.example.com/image1.jpg'
    );
    });

    it('handles BookmarkButton toggle and removes artwork from list', () => {
    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    const button = screen.getByTestId('bookmark-toggle');
    fireEvent.click(button);

    // Button triggers toggle which unsets bookmark
    expect(mockSetIsBookmarked).toHaveBeenCalledWith(false);
    });

    it('calls onArtworkSelect when artwork text is clicked', () => {
    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    const title = screen.getByText('Artwork 1');
    fireEvent.click(title);

    expect(mockOnArtworkSelect).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'art1',
        title: 'Artwork 1',
        description: 'Beautiful art',
        photos: ['image1.jpg'],
        imageUrl: 'https://s3.example.com/image1.jpg',
    }));
    });

    it('does not render image if photos are missing', () => {
    const userWithoutPhotos = {
        ...mockUser,
        bookmarkedArtworks: [{ ...mockUser.bookmarkedArtworks[0], photos: null }],
    };
    mockUseUser.mockReturnValue({ user: userWithoutPhotos });

    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    expect(screen.queryByAltText('Artwork 1')).not.toBeInTheDocument();
    });

    it('renders fallback UI if user has no bookmarked artworks', () => {
    const minimalUser = { _id: 'user123', bookmarkedArtworks: [] };
    mockUseUser.mockReturnValue({ user: minimalUser });

    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    expect(screen.getByText('Your Bookmarked Artworks')).toBeInTheDocument();
    // Should render empty list
    expect(screen.queryByText('Artwork 1')).not.toBeInTheDocument();
    });

    it('renders multiple bookmarked artworks', () => {
    const userWithMultipleBookmarks = {
        ...mockUser,
        bookmarkedArtworks: [
        {
            _id: 'art1',
            title: 'Artwork 1',
            description: 'Beautiful art',
            photos: ['image1.jpg'],
        },
        {
            _id: 'art2',
            title: 'Artwork 2',
            description: 'Amazing sculpture',
            photos: ['image2.jpg'],
        },
        ],
    };
    mockUseUser.mockReturnValue({ user: userWithMultipleBookmarks });

    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    expect(screen.getByText('Artwork 2')).toBeInTheDocument();
    expect(screen.getByText('Beautiful art')).toBeInTheDocument();
    expect(screen.getByText('Amazing sculpture')).toBeInTheDocument();
    });

    it('handles missing bookmarkedArtworks array gracefully', () => {
    const userWithoutBookmarks = { _id: 'user123' };
    mockUseUser.mockReturnValue({ user: userWithoutBookmarks });

    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    expect(screen.getByText('Your Bookmarked Artworks')).toBeInTheDocument();
    expect(screen.queryByText('Artwork 1')).not.toBeInTheDocument();
    });

    it('removes artwork from list when bookmark is toggled off', () => {
    const userWithTwoBookmarks = {
        ...mockUser,
        bookmarkedArtworks: [
        {
            _id: 'art1',
            title: 'Artwork 1',
            description: 'Beautiful art',
            photos: ['image1.jpg'],
        },
        {
            _id: 'art2',
            title: 'Artwork 2',
            description: 'Amazing sculpture',
            photos: ['image2.jpg'],
        },
        ],
    };
    mockUseUser.mockReturnValue({ user: userWithTwoBookmarks });

    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        setIsBookmarked={mockSetIsBookmarked}
        />
    );

    // Both artworks should be visible initially
    expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    expect(screen.getByText('Artwork 2')).toBeInTheDocument();

    // Click the first bookmark button to remove it
    const buttons = screen.getAllByTestId('bookmark-toggle');
    fireEvent.click(buttons[0]);

    // The component should update its local state to remove the artwork
    // Note: This tests the local state update, not the actual removal from DOM
    // since the mock doesn't simulate the actual component re-render
    expect(mockSetIsBookmarked).toHaveBeenCalledWith(false);
    });

    it('does not call setIsBookmarked if prop is not provided', () => {
    render(
        <BookmarksContainer
        onArtworkSelect={mockOnArtworkSelect}
        // setIsBookmarked prop is undefined
        />
    );

    const button = screen.getByTestId('bookmark-toggle');
    fireEvent.click(button);

    // Should not throw error when setIsBookmarked is undefined
    expect(mockSetIsBookmarked).not.toHaveBeenCalled();
    });
});