import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { UserContext, useUser } from '../../src/contexts/UserContext';

// Test component that uses the useUser hook
const TestComponent = () => {
    const { user, refreshUser } = useUser();
    return (
        <div>
        <span data-testid="user-id">{user?.id || 'no-user'}</span>
        <span data-testid="user-name">{user?.name || 'no-name'}</span>
        <button data-testid="refresh-button" onClick={refreshUser}>
            Refresh
        </button>
        </div>
    );
};

// Test component that calls useUser outside of provider
const TestComponentWithoutProvider = () => {
    useUser();
    return <div>Should not render</div>;
};

describe('UserContext', () => {
    describe('useUser hook', () => {
        it('throws error when used outside of UserProvider', () => {
            // Mock console.error to avoid cluttering test output
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            
            expect(() => {
                render(<TestComponentWithoutProvider />);
            }).toThrow('useUser must be used within a UserProvider');
            
            consoleSpy.mockRestore();
        });

        it('returns context value when used within UserProvider', () => {
            const mockUser = { id: '123', name: 'John Doe' };
            const mockRefreshUser = vi.fn();
            const contextValue = {
                user: mockUser,
                refreshUser: mockRefreshUser
            };

            render(
                <UserContext.Provider value={contextValue}>
                <TestComponent />
                </UserContext.Provider>
            );

            expect(screen.getByTestId('user-id')).toHaveTextContent('123');
            expect(screen.getByTestId('user-name')).toHaveTextContent('John Doe');
        });

        it('handles null user in context', () => {
            const mockRefreshUser = vi.fn();
            const contextValue = {
                user: null,
                refreshUser: mockRefreshUser
            };

            render(
                <UserContext.Provider value={contextValue}>
                <TestComponent />
                </UserContext.Provider>
            );

            expect(screen.getByTestId('user-id')).toHaveTextContent('no-user');
            expect(screen.getByTestId('user-name')).toHaveTextContent('no-name');
        });

        it('handles undefined user in context', () => {
            const mockRefreshUser = vi.fn();
            const contextValue = {
                user: undefined,
                refreshUser: mockRefreshUser
            };

            render(
                <UserContext.Provider value={contextValue}>
                <TestComponent />
                </UserContext.Provider>
            );

            expect(screen.getByTestId('user-id')).toHaveTextContent('no-user');
            expect(screen.getByTestId('user-name')).toHaveTextContent('no-name');
        });

        it('allows calling context functions', () => {
            const mockUser = { id: '456', name: 'Jane Smith' };
            const mockRefreshUser = vi.fn();
            const contextValue = {
                user: mockUser,
                refreshUser: mockRefreshUser
            };

            render(
                <UserContext.Provider value={contextValue}>
                <TestComponent />
                </UserContext.Provider>
            );

            const refreshButton = screen.getByTestId('refresh-button');
            fireEvent.click(refreshButton);

            expect(mockRefreshUser).toHaveBeenCalledTimes(1);
        });

        it('handles empty context value', () => {
            const contextValue = {};

            render(
                <UserContext.Provider value={contextValue}>
                <TestComponent />
                </UserContext.Provider>
            );

            expect(screen.getByTestId('user-id')).toHaveTextContent('no-user');
            expect(screen.getByTestId('user-name')).toHaveTextContent('no-name');
            });
        });

    describe('UserContext creation', () => {
            it('creates a context object', () => {
            expect(UserContext).toBeDefined();
            expect(typeof UserContext).toBe('object');
            expect(UserContext.Provider).toBeDefined();
            expect(UserContext.Consumer).toBeDefined();
            });
    });

    describe('Multiple components using context', () => {
        const AnotherTestComponent = () => {
        const { user } = useUser();
        return <span data-testid="another-user-id">{user?.id}</span>;
        };

        it('provides same context value to multiple components', () => {
            const mockUser = { id: '789', name: 'Bob Wilson' };
            const mockRefreshUser = vi.fn();
            const contextValue = {
                user: mockUser,
                refreshUser: mockRefreshUser
            };

            render(
                <UserContext.Provider value={contextValue}>
                <TestComponent />
                <AnotherTestComponent />
                </UserContext.Provider>
            );

            expect(screen.getByTestId('user-id')).toHaveTextContent('789');
            expect(screen.getByTestId('another-user-id')).toHaveTextContent('789');
        });
    });

    describe('Nested providers', () => {
        it('uses the closest provider value', () => {
            const outerUser = { id: 'outer', name: 'Outer User' };
            const innerUser = { id: 'inner', name: 'Inner User' };
            const mockRefreshUser = vi.fn();

            const outerContextValue = {
                user: outerUser,
                refreshUser: mockRefreshUser
            };

            const innerContextValue = {
                user: innerUser,
                refreshUser: mockRefreshUser
            };

            render(
                <UserContext.Provider value={outerContextValue}>
                <div data-testid="outer-scope">
                    <TestComponent />
                    <UserContext.Provider value={innerContextValue}>
                    <div data-testid="inner-scope">
                        <TestComponent />
                    </div>
                    </UserContext.Provider>
                </div>
                </UserContext.Provider>
            );

            const outerScope = screen.getByTestId('outer-scope');
            const innerScope = screen.getByTestId('inner-scope');

            // The outer scope should show the outer user
            const outerUserElements = outerScope.querySelectorAll('[data-testid="user-id"]');
            expect(outerUserElements[0]).toHaveTextContent('outer');

            // The inner scope should show the inner user
            const innerUserElements = innerScope.querySelectorAll('[data-testid="user-id"]');
            expect(innerUserElements[0]).toHaveTextContent('inner');
        });
    });

    describe('Error boundary integration', () => {
        class ErrorBoundary extends React.Component {
            constructor(props) {
                super(props);
                this.state = { hasError: false, error: null };
            }

            static getDerivedStateFromError(error) {
                return { hasError: true, error };
            }

            render() {
                if (this.state.hasError) {
                return <div data-testid="error-caught">{this.state.error.message}</div>;
                }
                return this.props.children;
            }
        }

        it('error can be caught by error boundary', () => {
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            render(
                <ErrorBoundary>
                <TestComponentWithoutProvider />
                </ErrorBoundary>
            );

            expect(screen.getByTestId('error-caught')).toHaveTextContent(
                'useUser must be used within a UserProvider'
            );

            consoleSpy.mockRestore();
        });
    });
});