
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MapSideBar from '../../../src/components/map/MapSideBar';

// Create mocks using vi.hoisted to ensure they're available during module loading
const mockUseUser = vi.hoisted(() => vi.fn());
const mockReportButton = vi.hoisted(() => vi.fn());
const mockArtworkForm = vi.hoisted(() => vi.fn());

// Mock all dependencies before importing the component
vi.mock('../../../src/contexts/UserContext', () => ({
    useUser: mockUseUser
}));

// Mock child components
vi.mock('../../../src/components/ReportButton', () => ({
    default: (props) => {
        mockReportButton(props);
        return (
        <button 
            data-testid="report-button"
            onClick={props.onClick}
        >
            Report Button
        </button>
        );
    }
}));

vi.mock('../../../src/components/ArtworkForm', () => ({
    default: (props) => {
        mockArtworkForm(props);
        return (
        <div data-testid="artwork-form">
            <button 
            data-testid="close-form-button"
            onClick={props.onClose}
            >
            Close Form
            </button>
        </div>
        );
    }
}));

// Mock CSS import
vi.mock('../../../assets/styles/MapSideBar.css', () => ({}));

describe('MapSideBar', () => {
    const mockOnFiltersChange = vi.fn();
    const mockOnAddressInputChange = vi.fn();
    const mockOnUseCurrentLocation = vi.fn();

    const mockArtworks = [
        {
        _id: '1',
        title: 'Artwork 1',
        themeTags: ['political', 'street'],
        isAuthenticated: true
        },
        {
        _id: '2',
        title: 'Artwork 2',
        themeTags: ['humor', 'political'],
        isAuthenticated: false
        },
        {
        _id: '3',
        title: 'Artwork 3',
        themeTags: ['nature'],
        isAuthenticated: true
        }
    ];

    const defaultFilters = {
        themeTags: [],
        isAuthenticated: undefined,
        location: null
    };

    const mockUser = {
        _id: 'user123',
        name: 'Test User'
    };


    const defaultProps = {
        artworks: mockArtworks,
        filters: defaultFilters,
        onFiltersChange: mockOnFiltersChange,
        addressInput: '',
        onAddressInputChange: mockOnAddressInputChange,
        isSearchingAddress: false,
        onUseCurrentLocation: mockOnUseCurrentLocation,
        isGettingLocation: false
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockReportButton.mockClear();
        mockArtworkForm.mockClear();

        // Mock the useUser hook to return a logged-in user by default
        mockUseUser.mockReturnValue({ user: mockUser });
    });

describe('Component Rendering', () => {
    it('renders the sidebar with correct structure', () => {
        render(<MapSideBar {...defaultProps} />);
        
        expect(screen.getByTestId('report-button')).toBeInTheDocument();
        expect(screen.getByText('Filter Banksy by:')).toBeInTheDocument();
        expect(screen.getByText('Tags:')).toBeInTheDocument();
        expect(screen.getByText('Authenticity:')).toBeInTheDocument();
        expect(screen.getByText('Find a Banksy near me:')).toBeInTheDocument();
    });

    it('applies correct CSS classes', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const sidebar = screen.getByText('Filter Banksy by:').closest('.map-sidebar');
        expect(sidebar).toHaveClass('map-sidebar');
        
        const filtersSection = screen.getByText('Filter Banksy by:').closest('.filters-section');
        expect(filtersSection).toHaveClass('filters-section');
    });

    it('renders ReportButton with correct props', () => {
        render(<MapSideBar {...defaultProps} />);
        
        expect(mockReportButton).toHaveBeenCalledWith(
            expect.objectContaining({
            src: '/REPORT.png',
            onClick: expect.any(Function)
        })
      );
    });
  });

describe('Theme Tags Filter', () => {
    it('displays available themes from artworks', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const select = screen.getByLabelText('Tags:');
        expect(select).toBeInTheDocument();
        
        // Check that themes are sorted and unique
        const options = Array.from(select.options).map(option => option.value);
        expect(options).toContain('All');
        expect(options).toContain('humor');
        expect(options).toContain('nature');
        expect(options).toContain('political');
        expect(options).toContain('street');
    });

    it('shows "All" as selected when no themes are filtered', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const select = screen.getByLabelText('Tags:');
        expect(select.value).toContain('All');
    });

    it('shows selected themes when filters are applied', () => {
        const filtersWithThemes = {
            ...defaultFilters,
            themeTags: ['political', 'humor']
        };
        
        render(<MapSideBar {...defaultProps} filters={filtersWithThemes} />);
        
        const select = screen.getByLabelText('Tags:');
        expect(Array.from(select.selectedOptions).map(opt => opt.value)).toEqual(['humor', 'political']);
    });

    it('calls onFiltersChange when theme selection changes', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const select = screen.getByLabelText('Tags:');
        
        // Simulate selecting multiple options by setting their selected property
        const politicalOption = screen.getByRole('option', { name: 'political' });
        const humorOption = screen.getByRole('option', { name: 'humor' });
        
        // Create mock selectedOptions that behaves like a real HTMLCollection
        const mockSelectedOptions = {
            length: 2,
            0: { value: 'political' },
            1: { value: 'humor' },
            [Symbol.iterator]: function* () {
            yield this[0];
            yield this[1];
            }
        };
        
        // Mock the change event with proper selectedOptions
        Object.defineProperty(select, 'selectedOptions', {
            value: mockSelectedOptions,
            configurable: true
        });
        
        fireEvent.change(select);
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            themeTags: ['political', 'humor']
        });
    });

    it('clears theme filters when "All" is selected', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const select = screen.getByLabelText('Tags:');
        
        // Create mock selectedOptions for "All" selection
        const mockSelectedOptions = {
            length: 1,
            0: { value: 'All' },
            [Symbol.iterator]: function* () {
            yield this[0];
            }
        };
        
        // Mock the selectedOptions property
        Object.defineProperty(select, 'selectedOptions', {
            value: mockSelectedOptions,
            configurable: true
        });
        
        fireEvent.change(select);
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            themeTags: []
        });
    });


    it('displays helper text for multiple selection', () => {
        render(<MapSideBar {...defaultProps} />);
        
        expect(screen.getByText('Hold Ctrl/Cmd to select multiple themes')).toBeInTheDocument();
        });
    });

describe('Authentication Filter', () => {
    it('renders authentication radio buttons', () => {
        render(<MapSideBar {...defaultProps} />);
        
        expect(screen.getByLabelText('All')).toBeInTheDocument();
        expect(screen.getByLabelText('Certified Banksy only')).toBeInTheDocument();
        expect(screen.getByLabelText('Pending authentication')).toBeInTheDocument();
    });

    it('has "All" selected by default', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const allRadio = screen.getByLabelText('All');
        expect(allRadio).toBeChecked();
    });

    it('reflects current authentication filter state', () => {
        const filtersWithAuth = {
            ...defaultFilters,
            isAuthenticated: true
        };
        
        render(<MapSideBar {...defaultProps} filters={filtersWithAuth} />);
        
        const certifiedRadio = screen.getByLabelText('Certified Banksy only');
        expect(certifiedRadio).toBeChecked();
        });

        it('calls onFiltersChange when authentication filter changes', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const certifiedRadio = screen.getByLabelText('Certified Banksy only');
        fireEvent.click(certifiedRadio);
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            isAuthenticated: true
        });
    });

    it('calls onFiltersChange with false for pending authentication', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const pendingRadio = screen.getByLabelText('Pending authentication');
        fireEvent.click(pendingRadio);
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...defaultFilters,
            isAuthenticated: false
        });
        });
    });

describe('Location Filter', () => {
    it('renders address input', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const addressInput = screen.getByLabelText('Find a Banksy near me:');
        expect(addressInput).toBeInTheDocument();
        expect(addressInput).toHaveAttribute('placeholder', 'Type an address to search...');
    });

    it('displays current address input value', () => {
        render(<MapSideBar {...defaultProps} addressInput="London" />);
        
        const addressInput = screen.getByLabelText('Find a Banksy near me:');
        expect(addressInput).toHaveValue('London');
    });

    it('calls onAddressInputChange when address input changes', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const addressInput = screen.getByLabelText('Find a Banksy near me:');
        fireEvent.change(addressInput, { target: { value: 'New York' } });
        
        expect(mockOnAddressInputChange).toHaveBeenCalledWith('New York');
    });

    it('shows searching indicator when isSearchingAddress is true', () => {
        render(<MapSideBar {...defaultProps} isSearchingAddress={true} />);
        
        expect(screen.getByText('Searching...')).toBeInTheDocument();
    });

    it('hides searching indicator when isSearchingAddress is false', () => {
        render(<MapSideBar {...defaultProps} isSearchingAddress={false} />);
        
        expect(screen.queryByText('Searching...')).not.toBeInTheDocument();
    });

    it('renders current location button', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const locationButton = screen.getByText('Use Current Location');
        expect(locationButton).toBeInTheDocument();
        expect(locationButton).not.toBeDisabled();
    });

    it('shows loading state for current location button', () => {
        render(<MapSideBar {...defaultProps} isGettingLocation={true} />);
        
        const locationButton = screen.getByText('Getting Location...');
        expect(locationButton).toBeInTheDocument();
        expect(locationButton).toBeDisabled();
    });

    it('calls onUseCurrentLocation when current location button is clicked', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const locationButton = screen.getByText('Use Current Location');
        fireEvent.click(locationButton);
        
        expect(mockOnUseCurrentLocation).toHaveBeenCalledTimes(1);
    });
});

describe('Distance Control', () => {
    const filtersWithLocation = {
        ...defaultFilters,
        location: {
            lat: 51.5074,
            lng: -0.1278,
            maxDistance: 5000
        }
    };

    it('shows distance control when location filter is active', () => {
        render(<MapSideBar {...defaultProps} filters={filtersWithLocation} />);
        
        expect(screen.getByText('Max Distance: 5.0km')).toBeInTheDocument();
        expect(screen.getByLabelText(/Max Distance/)).toBeInTheDocument();
    });

    it('hides distance control when no location filter', () => {
        render(<MapSideBar {...defaultProps} />);
        
        expect(screen.queryByText(/Max Distance/)).not.toBeInTheDocument();
    });

    it('displays correct distance value', () => {
        render(<MapSideBar {...defaultProps} filters={filtersWithLocation} />);
        
        const slider = screen.getByLabelText(/Max Distance/);
        expect(slider).toHaveValue('5000');
    });

    it('calls onFiltersChange when distance slider changes', () => {
        render(<MapSideBar {...defaultProps} filters={filtersWithLocation} />);
        
        const slider = screen.getByLabelText(/Max Distance/);
        fireEvent.change(slider, { target: { value: '3000' } });
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...filtersWithLocation,
            location: {
            ...filtersWithLocation.location,
            maxDistance: 3000
            }
        });
    });

    it('renders distance labels', () => {
        render(<MapSideBar {...defaultProps} filters={filtersWithLocation} />);
        
        expect(screen.getByText('0.1km')).toBeInTheDocument();
        expect(screen.getByText('10km')).toBeInTheDocument();
    });

    it('renders clear location button', () => {
        render(<MapSideBar {...defaultProps} filters={filtersWithLocation} />);
        
        const clearButton = screen.getByText('Clear Location Filter');
        expect(clearButton).toBeInTheDocument();
    });

    it('clears location filter when clear button is clicked', () => {
        render(<MapSideBar {...defaultProps} filters={filtersWithLocation} />);
        
        const clearButton = screen.getByText('Clear Location Filter');
        fireEvent.click(clearButton);
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            ...filtersWithLocation,
            location: null
        });
        expect(mockOnAddressInputChange).toHaveBeenCalledWith('');
        });
    });

describe('Clear All Filters', () => {
    it('renders clear all filters button', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const clearAllButton = screen.getByText('Clear All Filters');
        expect(clearAllButton).toBeInTheDocument();
    });

    it('clears all filters when clear all button is clicked', () => {
        const filtersWithData = {
            themeTags: ['political'],
            isAuthenticated: true,
            location: { lat: 51.5074, lng: -0.1278, maxDistance: 5000 }
        };
        
        render(<MapSideBar {...defaultProps} filters={filtersWithData} />);
        
        const clearAllButton = screen.getByText('Clear All Filters');
        fireEvent.click(clearAllButton);
        
        expect(mockOnFiltersChange).toHaveBeenCalledWith({
            themeTags: [],
            isAuthenticated: undefined,
            location: null, 
            bookmarked: false,
            visited: false
        });
        expect(mockOnAddressInputChange).toHaveBeenCalledWith('');
    });
});

describe('Artwork Form Management', () => {
    it('does not show artwork form initially', () => {
        render(<MapSideBar {...defaultProps} />);
        
        expect(screen.queryByTestId('artwork-form')).not.toBeInTheDocument();
    });

    it('shows artwork form when report button is clicked', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const reportButton = screen.getByTestId('report-button');
        fireEvent.click(reportButton);
        
        expect(screen.getByTestId('artwork-form')).toBeInTheDocument();
    });

    it('passes onClose prop to ArtworkForm', () => {
        render(<MapSideBar {...defaultProps} />);
        
        const reportButton = screen.getByTestId('report-button');
        fireEvent.click(reportButton);
        
        expect(mockArtworkForm).toHaveBeenCalledWith(
            expect.objectContaining({
            onClose: expect.any(Function)
            })
        );
    });

    it('hides artwork form when close is called', () => {
        render(<MapSideBar {...defaultProps} />);
        
        // Open form
        const reportButton = screen.getByTestId('report-button');
        fireEvent.click(reportButton);
        
        expect(screen.getByTestId('artwork-form')).toBeInTheDocument();
        
        // Close form
        const closeButton = screen.getByTestId('close-form-button');
        fireEvent.click(closeButton);
        
        expect(screen.queryByTestId('artwork-form')).not.toBeInTheDocument();
    });
});

describe('Theme Tag Processing', () => {
        it('handles artworks without theme tags', () => {
        const artworksWithoutTags = [
            { _id: '1', title: 'Artwork 1' },
            { _id: '2', title: 'Artwork 2', themeTags: ['political'] }
        ];
        
        expect(() => {
            render(<MapSideBar {...defaultProps} artworks={artworksWithoutTags} />);
        }).not.toThrow();
        
        const select = screen.getByLabelText('Tags:');
        const options = Array.from(select.options).map(option => option.value);
        expect(options).toContain('political');
        });

        it('sorts theme tags alphabetically', () => {
        const artworksWithUnsortedTags = [
            { _id: '1', themeTags: ['zebra', 'apple', 'banana'] }
        ];
        
        render(<MapSideBar {...defaultProps} artworks={artworksWithUnsortedTags} />);
        
        const select = screen.getByLabelText('Tags:');
        const themeOptions = Array.from(select.options)
            .filter(option => option.value !== 'All')
            .map(option => option.value);
        
        expect(themeOptions).toEqual(['apple', 'banana', 'zebra']);
    });

    it('removes duplicate theme tags', () => {
        const artworksWithDuplicates = [
            { _id: '1', themeTags: ['political', 'humor'] },
            { _id: '2', themeTags: ['political', 'street'] }
        ];
        
        render(<MapSideBar {...defaultProps} artworks={artworksWithDuplicates} />);
        
        const select = screen.getByLabelText('Tags:');
        const politicalOptions = Array.from(select.options).filter(option => option.value === 'political');
        expect(politicalOptions).toHaveLength(1);
        });
    });

describe('Edge Cases', () => {
    it('handles empty artworks array', () => {
        expect(() => {
            render(<MapSideBar {...defaultProps} artworks={[]} />);
        }).not.toThrow();
        
        const select = screen.getByLabelText('Tags:');
        const options = Array.from(select.options);
        expect(options).toHaveLength(1); // Only "All" option
        expect(options[0].value).toBe('All');
    });

    it('handles undefined prop values', () => {
        expect(() => {
            render(
            <MapSideBar 
                artworks={mockArtworks}
                filters={defaultFilters}
                onFiltersChange={undefined}
                addressInput={undefined}
                onAddressInputChange={undefined}
                isSearchingAddress={undefined}
                onUseCurrentLocation={undefined}
                isGettingLocation={undefined}
            />
            );
        }).not.toThrow();
        });
    });
});