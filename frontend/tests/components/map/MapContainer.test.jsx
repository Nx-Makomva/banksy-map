import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import MapContainer from '../../../src/components/map/MapContainer';

// Mock the Google Maps components and capture their props
const mockMapComponent = vi.fn();
const mockAdvancedMarkerComponent = vi.fn();
const mockPinComponent = vi.fn();

vi.mock('@vis.gl/react-google-maps', () => ({
    Map: (props) => {
        mockMapComponent(props);
        return (
        <div data-testid="google-map" {...props}>
            {props.children}
        </div>
        );
    },
    AdvancedMarker: (props) => {
        mockAdvancedMarkerComponent(props);
        return (
        <div 
            data-testid="advanced-marker"
            data-position={JSON.stringify(props.position)}
            data-title={props.title}
            onClick={props.onClick}
        >
            {props.children}
        </div>
        );
    },
    Pin: (props) => {
        mockPinComponent(props);
        return (
        <div 
            data-testid="pin"
            data-background={props.background}
            data-border-color={props.borderColor}
            data-glyph-color={props.glyphColor}
        />
        );
    },
    }));

    describe('MapContainer', () => {
    const mockOnArtworkSelect = vi.fn();
    
    const mockArtworks = [
        {
        _id: '1',
        title: 'Artwork 1',
        location: {
            coordinates: [-0.1278, 51.5074] // [lng, lat]
        }
        },
        {
        _id: '2',
        title: 'Artwork 2',
        location: {
            coordinates: [-0.1390, 51.5155]
        }
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
        mockMapComponent.mockClear();
        mockAdvancedMarkerComponent.mockClear();
        mockPinComponent.mockClear();
    });

    describe('Component Rendering', () => {
        it('renders the Map component with correct props', () => {
        render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        
        const map = screen.getByTestId('google-map');
        expect(map).toBeInTheDocument();
        
        // Check the actual props passed to the mocked Map component
        expect(mockMapComponent).toHaveBeenCalledWith(
            expect.objectContaining({
            mapId: '789d31d06ebabc6f5c31282b',
            defaultCenter: { lat: 51.5074, lng: -0.1278 },
            defaultZoom: 13,
            gestureHandling: 'greedy',
            disableDefaultUI: false,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
            style: {
                width: '100%',
                height: '1200px',
                borderRadius: '8px'
            }
            })
        );
        });

        it('applies correct inline styles to the Map', () => {
        render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        
        // Check that the style prop was passed correctly to the Map component
        expect(mockMapComponent).toHaveBeenCalledWith(
            expect.objectContaining({
            style: {
                width: '100%',
                height: '1200px',
                borderRadius: '8px'
            }
            })
        );
        });
    });

    describe('Artwork Markers', () => {
        it('renders markers for each artwork when artworks array is provided', () => {
        render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        
        const markers = screen.getAllByTestId('advanced-marker');
        expect(markers).toHaveLength(2);
        
        // Check first marker
        expect(markers[0]).toHaveAttribute('data-position', JSON.stringify({ lat: 51.5074, lng: -0.1278 }));
        expect(markers[0]).toHaveAttribute('data-title', 'Artwork 1');
        
        // Check second marker
        expect(markers[1]).toHaveAttribute('data-position', JSON.stringify({ lat: 51.5155, lng: -0.1390 }));
        expect(markers[1]).toHaveAttribute('data-title', 'Artwork 2');
        });

        it('renders Pin components with correct styling props', () => {
        render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        
        const pins = screen.getAllByTestId('pin');
        expect(pins).toHaveLength(2);
        
        pins.forEach(pin => {
            expect(pin).toHaveAttribute('data-background', '#ff51b0');
            expect(pin).toHaveAttribute('data-border-color', '#B6F6EA');
            expect(pin).toHaveAttribute('data-glyph-color', '#B6F6EA');
        });
        });

        it('handles empty artworks array gracefully', () => {
        render(<MapContainer artworks={[]} onArtworkSelect={mockOnArtworkSelect} />);
        
        const map = screen.getByTestId('google-map');
        expect(map).toBeInTheDocument();
        
        const markers = screen.queryAllByTestId('advanced-marker');
        expect(markers).toHaveLength(0);
        });

        it('handles null artworks prop gracefully', () => {
        render(<MapContainer artworks={null} onArtworkSelect={mockOnArtworkSelect} />);
        
        const map = screen.getByTestId('google-map');
        expect(map).toBeInTheDocument();
        
        const markers = screen.queryAllByTestId('advanced-marker');
        expect(markers).toHaveLength(0);
        });

        it('handles undefined artworks prop gracefully', () => {
        render(<MapContainer artworks={undefined} onArtworkSelect={mockOnArtworkSelect} />);
        
        const map = screen.getByTestId('google-map');
        expect(map).toBeInTheDocument();
        
        const markers = screen.queryAllByTestId('advanced-marker');
        expect(markers).toHaveLength(0);
        });
    });

    describe('Marker Interactions', () => {
        it('calls onArtworkSelect when a marker is clicked', () => {
        render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        
        const markers = screen.getAllByTestId('advanced-marker');
        const firstMarker = markers[0];
        
        fireEvent.click(firstMarker);
        
        expect(mockOnArtworkSelect).toHaveBeenCalledTimes(1);
        expect(mockOnArtworkSelect).toHaveBeenCalledWith(mockArtworks[0]);
        });

        it('calls onArtworkSelect with correct artwork data for each marker', () => {
        render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        
        const markers = screen.getAllByTestId('advanced-marker');
        
        // Click first marker
        fireEvent.click(markers[0]);
        expect(mockOnArtworkSelect).toHaveBeenCalledWith(mockArtworks[0]);
        
        // Click second marker
        fireEvent.click(markers[1]);
        expect(mockOnArtworkSelect).toHaveBeenCalledWith(mockArtworks[1]);
        
        expect(mockOnArtworkSelect).toHaveBeenCalledTimes(2);
        });
    });

    describe('Coordinate Handling', () => {
        it('correctly converts coordinates from [lng, lat] to {lat, lng} format', () => {
        const artworkWithSpecificCoords = [{
            _id: '3',
            title: 'Test Artwork',
            location: {
            coordinates: [-1.5, 52.5] // [lng, lat]
            }
        }];

        render(<MapContainer artworks={artworkWithSpecificCoords} onArtworkSelect={mockOnArtworkSelect} />);
        
        const marker = screen.getByTestId('advanced-marker');
        expect(marker).toHaveAttribute('data-position', JSON.stringify({ lat: 52.5, lng: -1.5 }));
        });
    });

    describe('Error Handling', () => {
        it('handles artworks with missing coordinates gracefully', () => {
        const artworksWithMissingCoords = [
            {
            _id: '1',
            title: 'Artwork 1',
            location: {
                coordinates: [-0.1278, 51.5074]
            }
            },
            {
            _id: '2',
            title: 'Artwork 2',
            location: {} // Missing coordinates
            }
        ];

        expect(() => {
            render(<MapContainer artworks={artworksWithMissingCoords} onArtworkSelect={mockOnArtworkSelect} />);
        }).not.toThrow();

        const markers = screen.getAllByTestId('advanced-marker');
        expect(markers).toHaveLength(1); // Only the valid artwork should render
        });
    });

    describe('Component Props', () => {
        it('renders without crashing when required props are provided', () => {
        expect(() => {
            render(<MapContainer artworks={mockArtworks} onArtworkSelect={mockOnArtworkSelect} />);
        }).not.toThrow();
        });

        it('renders without crashing when onArtworkSelect is not provided', () => {
        expect(() => {
            render(<MapContainer artworks={mockArtworks} />);
        }).not.toThrow();
        });
    });
});