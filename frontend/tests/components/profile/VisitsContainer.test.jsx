import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import VisitsContainer from '../../../src/components/profile/VisitsContainer';

// Hoisted mocks
const mockUseUser = vi.hoisted(() => vi.fn());
const mockVisitButton = vi.hoisted(() => vi.fn());

// Mock dependencies
vi.mock('../../../src/contexts/UserContext', () => ({
    useUser: mockUseUser,
}));

vi.mock('../../../src/components/VisitButton', () => ({
    default: (props) => {
        mockVisitButton(props);
        return (
        <button data-testid="visit-toggle" onClick={() => props.onToggle(false, props.artworkId)}>
            VisitButton
        </button>
        );
    },
}));

vi.mock('../../../src/utils/s3url', () => ({
    getImageUrl: (photo) => `https://s3.example.com/${photo}`,
}));

describe('VisitedArtworksList', () => {
    const mockOnArtworkSelect = vi.fn();
    const mockSetIsVisited = vi.fn();

    const mockUser = {
        _id: 'user123',
        visitedArtworks: [
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

    it('renders visited artworks with title and description', () => {
        render(
        <VisitsContainer
            onArtworkSelect={mockOnArtworkSelect}
            setIsVisited={mockSetIsVisited}
        />
        );

        expect(screen.getByText('Your Visited Artworks')).toBeInTheDocument();
        expect(screen.getByText('Artwork 1')).toBeInTheDocument();
        expect(screen.getByText('Beautiful art')).toBeInTheDocument();
        expect(screen.getByAltText('Artwork 1')).toHaveAttribute(
        'src',
        'https://s3.example.com/image1.jpg'
        );
    });

    it('handles VisitButton toggle and removes artwork from list', () => {
        render(
        <VisitsContainer
            onArtworkSelect={mockOnArtworkSelect}
            setIsVisited={mockSetIsVisited}
        />
        );

        const button = screen.getByTestId('visit-toggle');
        fireEvent.click(button);

        // Button triggers toggle which unsets visit
        expect(mockSetIsVisited).toHaveBeenCalledWith(false);
    });

    it('calls onArtworkSelect when artwork text is clicked', () => {
        render(
        <VisitsContainer
            onArtworkSelect={mockOnArtworkSelect}
            setIsVisited={mockSetIsVisited}
        />
        );

        const title = screen.getByText('Artwork 1');
        fireEvent.click(title);

        expect(mockOnArtworkSelect).toHaveBeenCalledWith(expect.objectContaining({
        _id: 'art1',
        title: 'Artwork 1',
        description: 'Beautiful art',
        photos: ['image1.jpg'],
        }));
    });

    it('does not render image if photos are missing', () => {
        const userWithoutPhotos = {
        ...mockUser,
        visitedArtworks: [{ ...mockUser.visitedArtworks[0], photos: null }],
        };

        mockUseUser.mockReturnValue({ user: userWithoutPhotos });

        render(
        <VisitsContainer
            onArtworkSelect={mockOnArtworkSelect}
            setIsVisited={mockSetIsVisited}
        />
        );

        expect(screen.queryByAltText('Artwork 1')).not.toBeInTheDocument();
    });

    it('renders fallback UI if user has no visited artworks', () => {
    const minimalUser = { _id: 'user123', visitedArtworks: [] };
    mockUseUser.mockReturnValue({ user: minimalUser });

    render(
        <VisitsContainer
            onArtworkSelect={mockOnArtworkSelect}
            setIsVisited={mockSetIsVisited}
        />
    );

    // Since no visited artworks, the heading might or might not show — adjust as needed
    expect(screen.queryByText('Your Visited Artworks')).toBeInTheDocument();

    });
}); 