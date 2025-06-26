import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import MainBar from '../../src/components/MainBar';

// Mock child components
vi.mock('../../src/components/map/MapContainer', () => ({
    default: () => <div data-testid="mock-map-container">MapContainer</div>,
}));
vi.mock('../../src/components/profile/ProfileMainContainer', () => ({
    ProfileMainContainer: () => <div data-testid="mock-profile-main-container">ProfileMainContainer</div>,
}));
vi.mock('../../src/components/map/ArtworkMiniPopup', () => ({
    default: () => <div data-testid="mock-artwork-mini-popup">ArtworkMiniPopup</div>,
}));
vi.mock('../../src/components/ArtworkFullPopup', () => ({
    default: () => <div data-testid="mock-artwork-full-popup">ArtworkFullPopup</div>,
}));

// Mock useUser hook
vi.mock('../../src/contexts/UserContext', () => ({
    useUser: vi.fn(),
}));

import { useUser } from '../../src/contexts/UserContext';

describe('MainBar', () => {
    const mockUser = {
    _id: 'user123',
    bookmarkedArtworks: [{ _id: 'art1' }],
    visitedArtworks: [{ _id: 'art2' }],
    };

    beforeEach(() => {
    vi.clearAllMocks();
    useUser.mockReturnValue({ user: mockUser });
    });

    it('renders MapContainer when activeView is "map"', () => {
    render(<MainBar activeView="map" artworks={[]} onArtworkSelect={() => {}} selectedArtwork={null} showFullPopup={false} onClosePopup={() => {}} />);
    expect(screen.getByTestId('mainbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-map-container')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-profile-main-container')).toBeNull();
    });

    it('renders ProfileMainContainer when activeView is "account"', () => {
    render(<MainBar activeView="account" artworks={[]} onArtworkSelect={() => {}} selectedArtwork={null} showFullPopup={false} onClosePopup={() => {}} />);
    expect(screen.getByTestId('mainbar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-profile-main-container')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-map-container')).toBeNull();
    });

    it('renders ArtworkMiniPopup when selectedArtwork is present and showFullPopup is false', () => {
    render(<MainBar activeView="map" artworks={[]} onArtworkSelect={() => {}} selectedArtwork={{ _id: 'art1' }} showFullPopup={false} onClosePopup={() => {}} />);
    expect(screen.getByTestId('mock-artwork-mini-popup')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-artwork-full-popup')).toBeNull();
    });

    it('renders ArtworkFullPopup when selectedArtwork is present and showFullPopup is true', () => {
    render(<MainBar activeView="map" artworks={[]} onArtworkSelect={() => {}} selectedArtwork={{ _id: 'art1' }} showFullPopup={true} onClosePopup={() => {}} />);
    expect(screen.getByTestId('mock-artwork-full-popup')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-artwork-mini-popup')).toBeNull();
    });

    it('does not render ArtworkMiniPopup or ArtworkFullPopup when no selectedArtwork', () => {
    render(<MainBar activeView="map" artworks={[]} onArtworkSelect={() => {}} selectedArtwork={null} showFullPopup={true} onClosePopup={() => {}} />);
    expect(screen.queryByTestId('mock-artwork-mini-popup')).toBeNull();
    expect(screen.queryByTestId('mock-artwork-full-popup')).toBeNull();
    });
});