import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Sidebar from '../../src/components/Sidebar';

// Mock the child components to keep tests focused
vi.mock('../../src/components/map/MapSideBar', () => ({
    default: () => <div data-testid="mock-map-sidebar">MapSideBar</div>,
}));
vi.mock('../../src/components/profile/ProfileSideBar', () => ({
    ProfileSideBar: () => <div data-testid="mock-profile-sidebar">ProfileSideBar</div>,
}));

describe('Sidebar', () => {
    it('renders MapSideBar when activeView is "map"', () => {
    render(<Sidebar activeView="map" artworks={[]} filters={{}} onFiltersChange={() => {}} addressInput="" onAddressInputChange={() => {}} isSearchingAddress={false} onUseCurrentLocation={() => {}} isGettingLocation={false} refreshTrigger={false} />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-map-sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-profile-sidebar')).toBeNull();
    });

    it('renders ProfileSideBar when activeView is "account"', () => {
    render(<Sidebar activeView="account" loggedIn={true} />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByTestId('mock-profile-sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-map-sidebar')).toBeNull();
    });

    it('renders nothing inside sidebar when activeView is neither "map" nor "account"', () => {
    render(<Sidebar activeView="other" />);
    
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-map-sidebar')).toBeNull();
    expect(screen.queryByTestId('mock-profile-sidebar')).toBeNull();
    });
});