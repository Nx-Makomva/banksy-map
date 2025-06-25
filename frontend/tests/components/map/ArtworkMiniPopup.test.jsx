import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import ArtworkMiniPopup from '../../../src/components/map/ArtworkMiniPopup';


// Create the mock using vi.hoisted to ensure it's available during module loading
const mockUseUser = vi.hoisted(() => vi.fn());
const mockBookmarkButton = vi.hoisted(() => vi.fn());
const mockVisitButton = vi.hoisted(() => vi.fn());

// Mock all dependencies before importing the component
vi.mock('../../../src/contexts/UserContext', () => ({
  useUser: mockUseUser
}));

vi.mock('../../../src/components/BookmarkButton', () => ({
  default: (props) => {
    mockBookmarkButton(props);
    return (
      <button 
        data-testid="bookmark-button"
        onClick={() => props.onToggle(!props.isBookmarked)}
      >
        Bookmark Button
      </button>
    );
  }
}));

vi.mock('../../../src/components/VisitButton', () => ({
  default: (props) => {
    mockVisitButton(props);
    return (
      <button 
        data-testid="visit-button"
        onClick={() => props.onToggle(!props.isVisited)}
      >
        Visit Button
      </button>
    );
  }
}));

vi.mock('../../../assets/styles/ArtworkMiniPopup.css', () => ({}));


describe('ArtworkMiniPopup', () => {
  const mockOnClose = vi.fn();
  const mockOnArtworkSelect = vi.fn();
  const mockSetIsBookmarked = vi.fn();
  const mockSetIsVisited = vi.fn();

  const mockArtwork = {
    _id: '123',
    id: 'artwork-1',
    title: 'Test Artwork',
    description: 'A beautiful test artwork',
    discoveryYear: 2023,
    address: '123 Art Street, London',
    photos: ['photo1.jpg'],
    imageUrl: 'https://example.com/image.jpg'
  };

  const mockUser = {
    _id: 'user123',
    name: 'Test User'
  };

  const defaultProps = {
    artwork: mockArtwork,
    onClose: mockOnClose,
    onArtworkSelect: mockOnArtworkSelect,
    isBookmarked: false,
    setIsBookmarked: mockSetIsBookmarked,
    isVisited: false,
    setIsVisited: mockSetIsVisited
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockBookmarkButton.mockClear();
    mockVisitButton.mockClear();
    
    // Mock the useUser hook to return a logged-in user by default
    mockUseUser.mockReturnValue({ user: mockUser });
  });

  describe('Component Rendering', () => {
    it('renders the popup with correct structure', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      expect(screen.getByText('×')).toBeInTheDocument();
      expect(screen.getByText('Test Artwork')).toBeInTheDocument();
      expect(screen.getByText('View Big →')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: '×' })).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const popup = screen.getByText('Test Artwork').closest('.artwork-mini-popup');
      expect(popup).toHaveClass('artwork-mini-popup');
      
      const content = screen.getByText('Test Artwork').closest('.mini-content');
      expect(content).toHaveClass('mini-content');
    });

  });

  describe('Artwork Information Display', () => {
    it('displays artwork title', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      expect(screen.getByRole('heading', { name: 'Test Artwork' })).toBeInTheDocument();
    });

    it('displays discovery year when provided', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      expect(screen.getByText('Discovered:')).toBeInTheDocument();
      expect(screen.getByText('2023')).toBeInTheDocument();
    });

    it('displays description when provided', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      expect(screen.getByText('A beautiful test artwork')).toBeInTheDocument();
    });

    it('displays address when provided', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      expect(screen.getByText('Location:')).toBeInTheDocument();
      expect(screen.getByText('123 Art Street, London')).toBeInTheDocument();
    });

    it('hides discovery year when not provided', () => {
      const artworkWithoutYear = { ...mockArtwork, discoveryYear: null };
      render(<ArtworkMiniPopup {...defaultProps} artwork={artworkWithoutYear} />);
      expect(screen.queryByText('Discovered:')).not.toBeInTheDocument();
    });

    it('hides description when not provided', () => {
      const artworkWithoutDescription = { ...mockArtwork, description: null };
      render(<ArtworkMiniPopup {...defaultProps} artwork={artworkWithoutDescription} />);
      expect(screen.queryByText('A beautiful test artwork')).not.toBeInTheDocument();
    });

    it('hides address when not provided', () => {
      const artworkWithoutAddress = { ...mockArtwork, address: null };
      render(<ArtworkMiniPopup {...defaultProps} artwork={artworkWithoutAddress} />);
      expect(screen.queryByText('Location:')).not.toBeInTheDocument();
    });
  });

  describe('Image Display', () => {
    it('displays artwork image when photos exist', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const image = screen.getByAltText('Test Artwork');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', 'https://example.com/image.jpg');
      expect(image).toHaveClass('artwork-mini-image');
    });

    it('hides image when photos do not exist', () => {
      const artworkWithoutPhotos = { ...mockArtwork, photos: null };
      render(<ArtworkMiniPopup {...defaultProps} artwork={artworkWithoutPhotos} />);
      
      expect(screen.queryByAltText('Test Artwork')).not.toBeInTheDocument();
    });

    it('hides image when photos array is empty', () => {
      const artworkWithEmptyPhotos = { ...mockArtwork, photos: [] };
      render(<ArtworkMiniPopup {...defaultProps} artwork={artworkWithEmptyPhotos} />);
      
      expect(screen.queryByAltText('Test Artwork')).not.toBeInTheDocument();
    });

    it('uses artwork.id as image key', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const image = screen.getByAltText('Test Artwork');
      // Note: We can't directly test the key prop, but we can verify the image renders correctly
      expect(image).toBeInTheDocument();
    });
  });

  describe('User Authentication and Buttons', () => {
    it('shows bookmark and visit buttons when user is logged in', () => {
      // Debug: Let's see what the mock is returning
      console.log('Mock useUser returns:', mockUseUser.mock.results);
      
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      // Debug: Let's see what's actually rendered
      screen.debug();
      
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
      expect(screen.getByTestId('visit-button')).toBeInTheDocument();
    });

    it('hides bookmark and visit buttons when user is not logged in', () => {
      mockUseUser.mockReturnValue({ user: { _id: null }  }); // No _id
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('bookmark-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('visit-button')).not.toBeInTheDocument();
    });

    it('hides bookmark and visit buttons when user is null', () => {
      mockUseUser.mockReturnValue({ user: {}  });
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('bookmark-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('visit-button')).not.toBeInTheDocument();
    });

    it('passes correct props to BookmarkButton', () => {
      render(<ArtworkMiniPopup {...defaultProps} isBookmarked={true} />);
      
      expect(mockBookmarkButton).toHaveBeenCalledWith({
        artworkId: '123',
        isBookmarked: true,
        onToggle: mockSetIsBookmarked
      });
    });

    it('passes correct props to VisitButton', () => {
      render(<ArtworkMiniPopup {...defaultProps} isVisited={true} />);
      
      expect(mockVisitButton).toHaveBeenCalledWith({
        artworkId: '123',
        isVisited: true,
        onToggle: mockSetIsVisited
      });
    });
  });

  describe('Button Interactions', () => {
    it('calls onClose when close button is clicked', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const closeButton = screen.getByRole('button', { name: '×' });
      fireEvent.click(closeButton);
      
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it('calls onArtworkSelect when expand button is clicked', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const expandButton = screen.getByRole('button', { name: 'View Big →' });
      fireEvent.click(expandButton);
      
      expect(mockOnArtworkSelect).toHaveBeenCalledTimes(1);
      expect(mockOnArtworkSelect).toHaveBeenCalledWith(mockArtwork);
    });

    it('calls setIsBookmarked when bookmark button is clicked', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const bookmarkButton = screen.getByTestId('bookmark-button');
      fireEvent.click(bookmarkButton);
      
      expect(mockSetIsBookmarked).toHaveBeenCalledTimes(1);
      expect(mockSetIsBookmarked).toHaveBeenCalledWith(true); // Toggled from false
    });

    it('calls setIsVisited when visit button is clicked', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const visitButton = screen.getByTestId('visit-button');
      fireEvent.click(visitButton);
      
      expect(mockSetIsVisited).toHaveBeenCalledTimes(1);
      expect(mockSetIsVisited).toHaveBeenCalledWith(true); // Toggled from false
    });
  });

  describe('Button Group Layout', () => {
    it('renders button group with correct class when user is logged in', () => {
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      const buttonGroup = screen.getByTestId('bookmark-button').closest('.button-group-mini-popup');
      expect(buttonGroup).toHaveClass('button-group-mini-popup');
      expect(buttonGroup).toContainElement(screen.getByTestId('bookmark-button'));
      expect(buttonGroup).toContainElement(screen.getByTestId('visit-button'));
    });

    it('does not render button group when user is not logged in', () => {
      mockUseUser.mockReturnValue({ user: { _id: null }  });
      render(<ArtworkMiniPopup {...defaultProps} />);
      
      expect(screen.queryByTestId('bookmark-button')).not.toBeInTheDocument();
      expect(screen.queryByTestId('visit-button')).not.toBeInTheDocument();
    });
  });

  describe('Prop Variations', () => {
    it('handles artwork without optional fields', () => {
      const minimalArtwork = {
        _id: '456',
        id: 'minimal-artwork',
        title: 'Minimal Artwork',
        imageUrl: 'https://example.com/minimal.jpg'
      };

      expect(() => {
        render(<ArtworkMiniPopup {...defaultProps} artwork={minimalArtwork} />);
      }).not.toThrow();

      expect(screen.getByText('Minimal Artwork')).toBeInTheDocument();
      expect(screen.queryByText('Discovered:')).not.toBeInTheDocument();
      expect(screen.queryByText('Location:')).not.toBeInTheDocument();
    });

    it('handles different bookmark states', () => {
      const { rerender } = render(<ArtworkMiniPopup {...defaultProps} isBookmarked={false} />);
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();

      rerender(<ArtworkMiniPopup {...defaultProps} isBookmarked={true} />);
      expect(screen.getByTestId('bookmark-button')).toBeInTheDocument();
    });

    it('handles different visit states', () => {
      const { rerender } = render(<ArtworkMiniPopup {...defaultProps} isVisited={false} />);
      expect(screen.getByTestId('visit-button')).toBeInTheDocument();

      rerender(<ArtworkMiniPopup {...defaultProps} isVisited={true} />);
      expect(screen.getByTestId('visit-button')).toBeInTheDocument();
    });
  });
});