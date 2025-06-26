import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

// Create mocks using vi.hoisted to ensure they're available during module loading
const mockUseUser = vi.hoisted(() => vi.fn());
const mockUseNavigate = vi.hoisted(() => vi.fn());
const mockLogin = vi.hoisted(() => vi.fn());
const mockNavbar = vi.hoisted(() => vi.fn());

// Mock all dependencies before importing the component
vi.mock('../../src/contexts/UserContext', () => ({
    useUser: mockUseUser
}));

vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: mockUseNavigate,
        Link: ({ to, children, ...props }) => (
        <a href={to} {...props}>{children}</a>
        )
    };
});

vi.mock('../../src/services/authentication', () => ({
  login: mockLogin
}));

vi.mock('../../src/components/Navbar', () => ({
    default: () => {
        mockNavbar();
        return <nav data-testid="navbar">Navbar</nav>;
    }
}));

vi.mock('../../src/assets/styles/LoginPage.css', () => ({}));

// Mock localStorage
const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', {
    value: mockLocalStorage
});

// Mock window.alert
window.alert = vi.fn();

import { LoginPage } from '../../src/pages/Login/LoginPage';

// Helper component to wrap LoginPage with Router
const LoginPageWithRouter = () => (
    <BrowserRouter>
        <LoginPage />
    </BrowserRouter>
);

describe('LoginPage', () => {
    const mockNavigate = vi.fn();
    const mockRefreshUser = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockLocalStorage.setItem.mockClear();
        mockNavbar.mockClear();
        
        // Set up default mocks
        mockUseNavigate.mockReturnValue(mockNavigate);
        mockUseUser.mockReturnValue({ refreshUser: mockRefreshUser });
        window.alert.mockClear();
    });

    describe('Component Rendering', () => {
        it('renders the login form with correct structure', () => {
        render(<LoginPageWithRouter />);
        
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
        expect(screen.getByLabelText('Email:')).toBeInTheDocument();
        expect(screen.getByLabelText('Password:')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Submit')).toBeInTheDocument();
        expect(screen.getByText('Need an account?')).toBeInTheDocument();
        expect(screen.getByText('Sign Up!')).toBeInTheDocument();
        });

    it('applies correct CSS classes and attributes', () => {
        render(<LoginPageWithRouter />);
        
        const form = screen.getByRole('form');
        expect(form).toHaveClass('login-form');
        
        const emailInput = screen.getByLabelText('Email:');
        expect(emailInput).toHaveAttribute('type', 'text');
        expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address...');
        
        const passwordInput = screen.getByLabelText('Password:');
        expect(passwordInput).toHaveAttribute('type', 'password');
        expect(passwordInput).toHaveAttribute('placeholder', 'Enter your password...');
        
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        expect(submitButton).toHaveAttribute('type', 'submit');
    });

    it('renders Navbar component', () => {
        render(<LoginPageWithRouter />);
        
        expect(mockNavbar).toHaveBeenCalled();
        expect(screen.getByTestId('navbar')).toBeInTheDocument();
    });

    it('renders signup link with correct href', () => {
        render(<LoginPageWithRouter />);
        
        const signupLink = screen.getByText('Sign Up!');
        expect(signupLink).toHaveAttribute('href', '/signup');
    });
});

    describe('Form Input Handling', () => {
        it('updates email input value when typed', () => {
            render(<LoginPageWithRouter />);
            
            const emailInput = screen.getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
            
            expect(emailInput).toHaveValue('test@example.com');
    });

    it('updates password input value when typed', () => {
        render(<LoginPageWithRouter />);
        
        const passwordInput = screen.getByLabelText('Password:');
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        
        expect(passwordInput).toHaveValue('password123');
    });

    it('maintains form state across multiple changes', () => {
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        
        fireEvent.change(emailInput, { target: { value: 'user@test.com' } });
        fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
        fireEvent.change(emailInput, { target: { value: 'updated@test.com' } });
        
        expect(emailInput).toHaveValue('updated@test.com');
        expect(passwordInput).toHaveValue('mypassword');
    });

    it('starts with empty form fields', () => {
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        
        expect(emailInput).toHaveValue('');
        expect(passwordInput).toHaveValue('');
    });
});

describe('Form Submission', () => {
    it('prevents default form submission behavior', async () => {
        mockLogin.mockResolvedValue('fake-token');
        
        render(<LoginPageWithRouter />);
        
        const form = screen.getByRole('form');
        fireEvent.submit(form);
        
        // If preventDefault() worked, login should be called
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalled();
        });
    });

    it('calls login service with email and password', async () => {
        mockLogin.mockResolvedValue('fake-token');
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
    });

    it('handles empty form submission', async () => {
        mockLogin.mockResolvedValue('fake-token');
        
        render(<LoginPageWithRouter />);
        
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('', '');
        });
    });
});

describe('Successful Login Flow', () => {
    it('stores token in localStorage on successful login', async () => {
        mockLogin.mockResolvedValue('fake-jwt-token');
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'fake-jwt-token');
        });
    });

    it('calls refreshUser after successful login', async () => {
        mockLogin.mockResolvedValue('fake-token');
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockRefreshUser).toHaveBeenCalled();
        });
    });

    it('navigates to home page after successful login', async () => {
        mockLogin.mockResolvedValue('fake-token');
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });

    it('follows correct sequence for successful login', async () => {
        mockLogin.mockResolvedValue('fake-token');
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'password123' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
        });
        
        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', 'fake-token');
        });
        
        await waitFor(() => {
            expect(mockRefreshUser).toHaveBeenCalled();
        });
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/');
        });
    });
});

describe('Failed Login Flow', () => {
    it('shows alert on login failure', async () => {
        mockLogin.mockRejectedValue(new Error('Invalid credentials'));
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'wrong@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalledWith('Invalid credentials');
        });
    });

    it('navigates to login page on failure', async () => {
        mockLogin.mockRejectedValue(new Error('Login failed'));
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });

    it('does not store token on login failure', async () => {
        mockLogin.mockRejectedValue(new Error('Login failed'));
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalled();
        });
        
        expect(mockLocalStorage.setItem).not.toHaveBeenCalled();
    });

    it('does not call refreshUser on login failure', async () => {
        mockLogin.mockRejectedValue(new Error('Login failed'));
        
        render(<LoginPageWithRouter />);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(window.alert).toHaveBeenCalled();
        });
        
        expect(mockRefreshUser).not.toHaveBeenCalled();
    });
});

describe('User Context Integration', () => {
    it('calls useUser hook', () => {
        render(<LoginPageWithRouter />);
        
        expect(mockUseUser).toHaveBeenCalled();
    });

    it('handles undefined refreshUser gracefully', async () => {
        mockUseUser.mockReturnValue({ refreshUser: undefined });
        mockLogin.mockResolvedValue('fake-token');
        
        expect(() => {
            render(<LoginPageWithRouter />);
        }).not.toThrow();
        
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        
        expect(() => {
            fireEvent.click(submitButton);
        }).not.toThrow();
    });
});

describe('Navigation Integration', () => {
    it('calls useNavigate hook', () => {
        render(<LoginPageWithRouter />);
        
        expect(mockUseNavigate).toHaveBeenCalled();
    });

    it('handles navigation gracefully when navigate is undefined', () => {
        mockUseNavigate.mockReturnValue(undefined);
        
        expect(() => {
            render(<LoginPageWithRouter />);
        }).not.toThrow();
    });
});

describe('Edge Cases', () => {
    it('handles login service returning null/undefined token', async () => {
        mockLogin.mockResolvedValue(null);
        
        render(<LoginPageWithRouter />);
        
        const submitButton = screen.getByRole('button', { name: 'Submit login form' });
        fireEvent.click(submitButton);
        
        await waitFor(() => {
            expect(mockLocalStorage.setItem).toHaveBeenCalledWith('token', null);
        });
    });

    it('handles very long email and password inputs', () => {
        render(<LoginPageWithRouter />);
        
        const longEmail = 'a'.repeat(1000) + '@example.com';
        const longPassword = 'p'.repeat(1000);
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        
        fireEvent.change(emailInput, { target: { value: longEmail } });
        fireEvent.change(passwordInput, { target: { value: longPassword } });
        
        expect(emailInput).toHaveValue(longEmail);
        expect(passwordInput).toHaveValue(longPassword);
    });

    it('handles special characters in email and password', () => {
        render(<LoginPageWithRouter />);
        
        const specialEmail = 'test+user@example-domain.co.uk';
        const specialPassword = 'P@ssw0rd!#$%&*()';
        
        const emailInput = screen.getByLabelText('Email:');
        const passwordInput = screen.getByLabelText('Password:');
        
        fireEvent.change(emailInput, { target: { value: specialEmail } });
        fireEvent.change(passwordInput, { target: { value: specialPassword } });
        
        expect(emailInput).toHaveValue(specialEmail);
        expect(passwordInput).toHaveValue(specialPassword);
    });
  });
});