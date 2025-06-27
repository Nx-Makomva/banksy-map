import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';

// Create mocks using vi.hoisted to ensure they're available during module loading
const mockUseLocation = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useLocation: mockUseLocation,
        Link: ({ to, children, title, ...props }) => (
        <a href={to} title={title} {...props}>{children}</a>
        )
    };
});

// Mock react-icons
vi.mock('react-icons/fa', () => ({
    FaMapMarkedAlt: () => <span data-testid="map-icon">Map Icon</span>
}));

vi.mock('react-icons/md', () => ({
    MdAccountBox: () => <span data-testid="account-icon">Account Icon</span>
}));

vi.mock('react-icons/pi', () => ({
    PiSignOutBold: () => <span data-testid="logout-icon">Logout Icon</span>
}));

vi.mock('react-icons/fi', () => ({
    FiLogIn: () => <span data-testid="login-icon">Login Icon</span>
}));

vi.mock('react-icons/si', () => ({
    SiGnuprivacyguard: () => <span data-testid="signup-icon">Signup Icon</span>
}));

// Mock CSS import
vi.mock('../../src/assets/styles/NavBar.css', () => ({}));

import Navbar from '../../src/components/NavBar';

// Helper component to wrap Navbar with Router when needed
const NavbarWithRouter = (props) => (
    <BrowserRouter>
        <Navbar {...props} />
    </BrowserRouter>
);



describe('Navbar', () => {
    const mockOnLogOut = vi.fn();
    const mockOnMapClick = vi.fn();
    const mockOnAccountClick = vi.fn();

    const defaultProps = {
        loggedIn: false,
        onLogOut: mockOnLogOut,
        onMapClick: mockOnMapClick,
        onAccountClick: mockOnAccountClick
    };

    beforeEach(() => {
        vi.clearAllMocks();
        mockUseLocation.mockReturnValue({ pathname: '/other' });
    });

    describe('Basic Rendering', () => {
        it('renders navbar structure', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
            expect(screen.getByAltText('Logo')).toBeInTheDocument();
            expect(screen.getByRole('navigation')).toBeInTheDocument();
        });

        it('renders map button', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            expect(screen.getByTestId('map-button')).toBeInTheDocument();
            expect(screen.getByTestId('map-icon')).toBeInTheDocument();
        });
    });

    describe('Map Button', () => {
        it('shows home link when not on homepage', () => {
            mockUseLocation.mockReturnValue({ pathname: '/login' });
            render(<NavbarWithRouter {...defaultProps} />);
            
            const mapButton = screen.getByTestId('map-button');
            expect(mapButton).toHaveAttribute('href', '/');
        });

        it('shows hash link when on homepage', () => {
            mockUseLocation.mockReturnValue({ pathname: '/' });
            render(<NavbarWithRouter {...defaultProps} />);
            
            const mapButton = screen.getByTestId('map-button');
            expect(mapButton).toHaveAttribute('href', '#');
        });

        it('calls onMapClick when clicked', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            const mapButton = screen.getByTestId('map-button');
            fireEvent.click(mapButton);
            
            expect(mockOnMapClick).toHaveBeenCalledTimes(1);
        });
    });

    describe('When Not Logged In', () => {
        it('shows login and signup buttons', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            expect(screen.getByTestId('login-button')).toBeInTheDocument();
            expect(screen.getByTestId('signup-button')).toBeInTheDocument();
        });

        it('does not show account/logout buttons', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            expect(screen.queryByTestId('account-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
        });

        it('login button links to /login', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            const loginButton = screen.getByTestId('login-button');
            expect(loginButton).toHaveAttribute('href', '/login');
        });

        it('signup button links to /signup', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            const signupButton = screen.getByTestId('signup-button');
            expect(signupButton).toHaveAttribute('href', '/signup');
        });
    });

    describe('When Logged In', () => {
        const loggedInProps = { ...defaultProps, loggedIn: true };

        it('shows account and logout buttons', () => {
            render(<NavbarWithRouter {...loggedInProps} />);
            
            expect(screen.getByTestId('account-button')).toBeInTheDocument();
            expect(screen.getByTestId('logout-button')).toBeInTheDocument();
        });

        it('does not show login/signup buttons', () => {
            render(<NavbarWithRouter {...loggedInProps} />);
            
            expect(screen.queryByTestId('login-button')).not.toBeInTheDocument();
            expect(screen.queryByTestId('signup-button')).not.toBeInTheDocument();
        });

        it('calls onAccountClick when account button clicked', () => {
            render(<NavbarWithRouter {...loggedInProps} />);
            
            const accountButton = screen.getByTestId('account-button');
            fireEvent.click(accountButton);
            
            expect(mockOnAccountClick).toHaveBeenCalledTimes(1);
        });

        it('calls onLogOut when logout button clicked', () => {
            render(<NavbarWithRouter {...loggedInProps} />);
            
            const logoutButton = screen.getByTestId('logout-button');
            fireEvent.click(logoutButton);
            
            expect(mockOnLogOut).toHaveBeenCalledTimes(1);
        });
    });

    describe('Icons', () => {
        it('renders all icons when not logged in', () => {
            render(<NavbarWithRouter {...defaultProps} />);
            
            expect(screen.getByTestId('map-icon')).toBeInTheDocument();
            expect(screen.getByTestId('login-icon')).toBeInTheDocument();
            expect(screen.getByTestId('signup-icon')).toBeInTheDocument();
        });

        it('renders all icons when logged in', () => {
            render(<NavbarWithRouter {...defaultProps} loggedIn={true} />);
            
            expect(screen.getByTestId('map-icon')).toBeInTheDocument();
            expect(screen.getByTestId('account-icon')).toBeInTheDocument();
            expect(screen.getByTestId('logout-icon')).toBeInTheDocument();
        });
    });
});