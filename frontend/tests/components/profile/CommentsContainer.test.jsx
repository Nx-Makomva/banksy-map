import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CommentsContainer from '../../../src/components/profile/CommentsContainer';

// Hoisted mocks
const mockUseUser = vi.hoisted(() => vi.fn());
const mockGetAllUserComments = vi.hoisted(() => vi.fn());

// Mock dependencies
vi.mock('../../../src/contexts/UserContext', () => ({
    useUser: mockUseUser,
}));

vi.mock('../../../src/services/comments', () => ({
    getAllUserComments: mockGetAllUserComments,
}));

vi.mock('../../../src/utils/s3url', () => ({
    getImageUrl: (photo) => `https://s3.example.com/${photo}`,
}));

describe('CommentsContainer', () => {
    const mockOnArtworkSelect = vi.fn();
    
    const mockUser = {
    _id: 'user123',
    };

    const mockCommentsData = {
        comments: [
        {
        _id: 'comment1',
        text: 'This is a beautiful artwork',
        artwork_id: {
            _id: 'art1',
            title: 'Artwork 1',
            description: 'Beautiful painting',
            photos: ['image1.jpg'],
        },
        },
        {
        _id: 'comment2',
        text: 'Love the colors in this piece',
        artwork_id: {
            _id: 'art2',
            title: 'Artwork 2',
            description: 'Amazing sculpture',
            photos: ['image2.jpg'],
        },
        },
    ],
    };

    beforeEach(() => {
    vi.clearAllMocks();
    mockUseUser.mockReturnValue({ user: mockUser });
    mockGetAllUserComments.mockResolvedValue(mockCommentsData);
    });

    it('renders user comments with artwork titles and comment text', async () => {
    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    expect(screen.getByText('Your Comments on Artworks')).toBeInTheDocument();

    await waitFor(() => {
        expect(screen.getByText('Artwork 1')).toBeInTheDocument();
        expect(screen.getByText('This is a beautiful artwork')).toBeInTheDocument();
        expect(screen.getByText('Artwork 2')).toBeInTheDocument();
        expect(screen.getByText('Love the colors in this piece')).toBeInTheDocument();
    });
    });

    it('renders images for artworks with photos', async () => {
    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    await waitFor(() => {
        expect(screen.getByAltText('Artwork 1')).toHaveAttribute(
        'src',
        'https://s3.example.com/image1.jpg'
        );
        expect(screen.getByAltText('Artwork 2')).toHaveAttribute(
        'src',
        'https://s3.example.com/image2.jpg'
        );
    });
    });

    it('calls onArtworkSelect when comment item is clicked', async () => {
    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    await waitFor(() => {
        expect(screen.getByText('Artwork 1')).toBeInTheDocument();
    });

    const firstCommentItem = screen.getByText('Artwork 1').closest('.artwork-header');
    fireEvent.click(firstCommentItem);

    expect(mockOnArtworkSelect).toHaveBeenCalledWith(
        expect.objectContaining({
        _id: 'art1',
        title: 'Artwork 1',
        description: 'Beautiful painting',
        photos: ['image1.jpg'],
        imageUrl: 'https://s3.example.com/image1.jpg',
        })
    );
    });

    it('does not fetch comments if user is not available', () => {
    mockUseUser.mockReturnValue({ user: null });

    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    expect(mockGetAllUserComments).not.toHaveBeenCalled();
    });

    it('does not fetch comments if user has no id', () => {
    mockUseUser.mockReturnValue({ user: {} });

    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    expect(mockGetAllUserComments).not.toHaveBeenCalled();
    });

    it('displays error message when API call fails', async () => {
    const errorMessage = 'Failed to fetch comments';
    mockGetAllUserComments.mockRejectedValue(new Error(errorMessage));

    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    await waitFor(() => {
        expect(screen.getByText(`Error: ${errorMessage}`)).toBeInTheDocument();
    });

    // Should not display the main content when there's an error
    expect(screen.queryByText('Your Comments on Artworks')).not.toBeInTheDocument();
    });

    it('displays generic error message when API call fails without message', async () => {
    mockGetAllUserComments.mockRejectedValue(new Error());

    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    await waitFor(() => {
        expect(screen.getByText('Error: Error fetching comments')).toBeInTheDocument();
    });
    });

    it('renders empty list when no comments are returned', async () => {
    mockGetAllUserComments.mockResolvedValue({ comments: [] });

    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    await waitFor(() => {
        expect(screen.getByText('Your Comments on Artworks')).toBeInTheDocument();
    });

    expect(screen.queryByText('This is a beautiful artwork')).not.toBeInTheDocument();
    });

    it('calls getAllUserComments when component mounts with valid user', () => {
    render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    expect(mockGetAllUserComments).toHaveBeenCalledTimes(1);
    });

    it('refetches comments when user changes', async () => {
    const { rerender } = render(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    expect(mockGetAllUserComments).toHaveBeenCalledTimes(1);

    // Change user
    const newUser = { _id: 'user456' };
    mockUseUser.mockReturnValue({ user: newUser });

    rerender(<CommentsContainer onArtworkSelect={mockOnArtworkSelect} />);

    expect(mockGetAllUserComments).toHaveBeenCalledTimes(2);
    });

});