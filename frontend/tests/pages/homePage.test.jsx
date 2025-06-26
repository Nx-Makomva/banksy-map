// HomePage.test.jsx
import { render, screen, act } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { HomePage } from '../../src/pages/Home/HomePage';

// Mock all dependencies
const mockUseUser = vi.hoisted(() => vi.fn());
// Mock all dependencies before importing the component
vi.mock('../../src/contexts/UserContext', () => ({
    useUser: mockUseUser
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => vi.fn()
    };
});

vi.mock('@vis.gl/react-google-maps', () => ({
    APIProvider: ({ children }) => <div>{children}</div>
}));

vi.mock('../../src/components/Navbar', () => ({
    default: () => <div data-testid="navbar">Navbar</div>
}));

vi.mock('../../src/components/Sidebar', () => ({
    default: () => <div data-testid="sidebar">Sidebar</div>
}));

vi.mock('../../src/components/MainBar', () => ({
    default: () => <div data-testid="mainbar">MainBar</div>
}));

vi.mock('../../src/services/artworks', () => ({
    getAllArtworks: vi.fn(() => Promise.resolve({ allArtworks: [] }))
}));

vi.mock('../../src/services/geocoding', () => ({
    geocodeAddress: vi.fn()
}));

vi.mock('import.meta', () => ({
    env: {
        VITE_GOOGLE_MAPS_API_KEY: 'test-key'
    }
}));

describe('HomePage', () => {

    const mockUser = {
        _id: 'user123',
        name: 'Test User'
    };

    beforeEach(() => {
        // Set up the mock to return the expected user context structure
        mockUseUser.mockReturnValue({
        user: mockUser,
        logout: vi.fn()
        });
    });

    const renderHomePage = async () => {
        let component;
        await act(async () => {
            component = render(
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            );
        });
        return component;
    };

    it('renders without crashing', async () => {
        await renderHomePage();

        screen.debug();

        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByTestId('sidebar')).toBeInTheDocument();
        expect(screen.getByTestId('mainbar')).toBeInTheDocument();
    });
});