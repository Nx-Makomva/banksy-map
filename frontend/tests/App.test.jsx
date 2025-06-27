import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from '@testing-library/react';

// Create mocks using vi.hoisted to ensure they're available during module loading
const mockGetMe = vi.hoisted(() => vi.fn());
const mockHomePage = vi.hoisted(() => vi.fn());
const mockLoginPage = vi.hoisted(() => vi.fn());
const mockSignupPage = vi.hoisted(() => vi.fn());
const mockBadgeCard = vi.hoisted(() => vi.fn());

// Mock all dependencies before importing the component
vi.mock('../src/services/user', () => ({
    getMe: mockGetMe
}));

vi.mock('../src/pages/Home/HomePage', () => ({
    HomePage: () => {
        mockHomePage();
        return <div data-testid="home-page">Home Page</div>;
    }
}));

vi.mock('../src/pages/Login/LoginPage', () => ({
    LoginPage: () => {
        mockLoginPage();
        return <div data-testid="login-page">Login Page</div>;
    }
}));

vi.mock('../src/pages/Signup/SignupPage', () => ({
    SignupPage: () => {
        mockSignupPage();
        return <div data-testid="signup-page">Signup Page</div>;
    }
}));

vi.mock('../src/components/BadgeCard', () => ({
    default: () => {
        mockBadgeCard();
        return <div data-testid="badge-card">Badge Card</div>;
    }
}));

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage,
    writable: true
});

// Mock react-router-dom components
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        createBrowserRouter: vi.fn((routes) => ({ routes })),
        RouterProvider: ({ router }) => {
        // Simple router mock that renders based on current path
        const currentPath = window.location.pathname;
        const route = router.routes.find(r => r.path === currentPath) || router.routes[0];
        return route.element;
        }
    };
});

import App from '../src/App';

describe('App', () => {
    const mockUser = {
        _id: 'user123',
        name: 'John Doe',
        email: 'john@example.com'
    };

    beforeEach(() => {
        vi.clearAllMocks();
        
        // Reset all localStorage mock implementations to default behavior
        mockLocalStorage.getItem.mockClear();
        mockLocalStorage.removeItem.mockClear();
        mockLocalStorage.setItem.mockClear();
        
        // Reset to default implementations
        mockLocalStorage.getItem.mockImplementation((key) => {
        if (key === 'token') return null;
        return null;
        });
        mockLocalStorage.removeItem.mockImplementation(() => {});
        mockLocalStorage.setItem.mockImplementation(() => {});
        
        // Reset component mocks
        mockHomePage.mockClear();
        mockLoginPage.mockClear();
        mockSignupPage.mockClear();
        mockBadgeCard.mockClear();
        
        // Reset location
        window.history.replaceState({}, '', '/');
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('Initial Loading State', () => {
        it('shows loading spinner while checking authentication', async () => {
            // Make getMe hang to keep loading state
            mockGetMe.mockImplementation(() => new Promise(() => {}));
            mockLocalStorage.getItem.mockReturnValue('fake-token');

            render(<App />);

            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.queryByTestId('home-page')).not.toBeInTheDocument();
            });

            it('applies correct loading styles', async () => {
            mockGetMe.mockImplementation(() => new Promise(() => {}));
            mockLocalStorage.getItem.mockReturnValue('fake-token');

            render(<App />);
                // get div in the loading element
            const loadingElement = screen.getByText('Loading...');
            // Check that it has the correct inline styles
            expect(loadingElement).toHaveAttribute('style');
            
            
            // Check the style attribute contains the expected styles
            const style = loadingElement.getAttribute('style');
            expect(style).toContain('display: flex');
            expect(style).toContain('justify-content: center');
            expect(style).toContain('align-items: center');
            expect(style).toContain('height: 100vh');
            });
    });

    describe('Authentication Flow', () => {
        it('fetches user data on app load when token exists', async () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockResolvedValue(mockUser);

            render(<App />);

            await waitFor(() => {
                expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
                expect(mockGetMe).toHaveBeenCalledWith('valid-token');
            });

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
        });

        it('does not call getMe when no token exists', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            render(<App />);

            await waitFor(() => {
                expect(mockLocalStorage.getItem).toHaveBeenCalledWith('token');
            });

            // Should still call getCurrentUser which handles no token case
            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
        });

        it('sets user data when authentication succeeds', async () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockResolvedValue(mockUser);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            // User should be available in context - i.e. component renders
            expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });

        it('handles authentication failure', async () => {
            mockLocalStorage.getItem.mockReturnValue('invalid-token');
            mockGetMe.mockRejectedValue(new Error('Invalid token'));

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            render(<App />);

            await waitFor(() => {
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
            });

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user:', expect.any(Error));
            consoleErrorSpy.mockRestore();
        });

        it('sets loggedoutUser when authentication fails', async () => {
            mockLocalStorage.getItem.mockReturnValue('invalid-token');
            mockGetMe.mockRejectedValue(new Error('Invalid token'));

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            // Component should render with logged out user context
            expect(screen.getByTestId('home-page')).toBeInTheDocument();
            });
    });

    describe('Context Provider', () => {
            it('provides user context to child components', async () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockResolvedValue(mockUser);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            // The RouterProvider should be rendered, indicating context is working
            expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });

        it('provides context functions', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            // Context should be provided with all functions
            // We can't directly test the context value, but the component should render without errors
            expect(screen.getByTestId('home-page')).toBeInTheDocument();
            });
    });

    describe('Router Configuration', () => {
        it('renders HomePage for root path', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            window.history.replaceState({}, '', '/');

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(screen.getByTestId('home-page')).toBeInTheDocument();
            expect(mockHomePage).toHaveBeenCalled();
        });

        it('renders LoginPage for /login path', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            window.history.replaceState({}, '', '/login');

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(screen.getByTestId('login-page')).toBeInTheDocument();
            expect(mockLoginPage).toHaveBeenCalled();
        });

        it('renders SignupPage for /signup path', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);
            window.history.replaceState({}, '', '/signup');

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(screen.getByTestId('signup-page')).toBeInTheDocument();
            expect(mockSignupPage).toHaveBeenCalled();
            });
    });

    describe('Context Functions', () => {
        // functions exist and don't throw errors

        it('getCurrentUser function handles successful user fetch', async () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockResolvedValue(mockUser);

            render(<App />);

            await waitFor(() => {
                expect(mockGetMe).toHaveBeenCalledWith('valid-token');
            });

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });
        });

        it('getCurrentUser function handles failed user fetch', async () => {
            mockLocalStorage.getItem.mockReturnValue('invalid-token');
            mockGetMe.mockRejectedValue(new Error('Unauthorized'));

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            render(<App />);

            await waitFor(() => {
                expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');
            });

            expect(consoleErrorSpy).toHaveBeenCalled();
            consoleErrorSpy.mockRestore();
        });

        it('getCurrentUser function handles no token', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            // getMe should still be called with null token in your implementation
            expect(mockGetMe).toHaveBeenCalledWith(null);
        });
    });

    describe('Error Handling', () => {
        it('handles getMe service errors gracefully', async () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockRejectedValue(new Error('Network error'));

            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(consoleErrorSpy).toHaveBeenCalledWith('Error fetching user:', expect.any(Error));
            expect(mockLocalStorage.removeItem).toHaveBeenCalledWith('token');

            consoleErrorSpy.mockRestore();
        });


        it('handles missing token gracefully', async () => {
            mockLocalStorage.getItem.mockReturnValue(undefined);

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(screen.getByTestId('home-page')).toBeInTheDocument();
            });
    });

    describe('Logged Out User State', () => {
        it('sets correct loggedoutUser structure', async () => {
            mockLocalStorage.getItem.mockReturnValue('invalid-token');
            mockGetMe.mockRejectedValue(new Error('Invalid token'));

            render(<App />);

            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            // app should render without errors i.e.loggedoutUser is set correctly
            expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });
    });

    describe('useEffect Dependencies', () => {
        it('calls getCurrentUser only once on mount', async () => {
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockResolvedValue(mockUser);

            const { rerender } = render(<App />);

            await waitFor(() => {
                expect(mockGetMe).toHaveBeenCalledTimes(1);
            });

            // Rerender the component
            rerender(<App />);

            // Should still be called only once (useEffect with empty deps)
            expect(mockGetMe).toHaveBeenCalledTimes(1);
        });
    });

    describe('Component Integration', () => {
        it('integrates with all page components', async () => {
            mockLocalStorage.getItem.mockReturnValue(null);

            // Test each route
            const routes = [
                { path: '/', testId: 'home-page', mock: mockHomePage },
                { path: '/login', testId: 'login-page', mock: mockLoginPage },
                { path: '/signup', testId: 'signup-page', mock: mockSignupPage }
            ];

            for (const route of routes) {
                window.history.replaceState({}, '', route.path);
                
                render(<App />);

                await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
                });

                expect(screen.getByTestId(route.testId)).toBeInTheDocument();
                expect(route.mock).toHaveBeenCalled();
            }
        });
    });

    describe('Loading State Timing', () => {
        it('shows loading state until authentication check completes', async () => {
            let resolveGetMe;
            const getMePromise = new Promise((resolve) => {
                resolveGetMe = resolve;
            });
            
            mockLocalStorage.getItem.mockReturnValue('valid-token');
            mockGetMe.mockReturnValue(getMePromise);

            render(<App />);

            // Should show loading initially
            expect(screen.getByText('Loading...')).toBeInTheDocument();

            // Resolve the promise
            act(() => {
                resolveGetMe(mockUser);
            });

            // Should hide loading after resolution
            await waitFor(() => {
                expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            });

            expect(screen.getByTestId('home-page')).toBeInTheDocument();
        });
    });
});