import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { SignupPage } from '../../src/pages/Signup/SignupPage';

// Create mocks using vi.hoisted to ensure they're available during module loading
const mockUseNavigate = vi.hoisted(() => vi.fn());
const mockSignup = vi.hoisted(() => vi.fn());
const mockNavbar = vi.hoisted(() => vi.fn());

// Mock all dependencies before importing the component
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
    signup: mockSignup
}));

vi.mock('../../src/components/NavBar', () => ({
    default: () => {
        mockNavbar();
        return <nav data-testid="navbar">Navbar</nav>;
    }
}));

vi.mock('../../src/assets/styles/SignupPage.css', () => ({}));

// Helper component to wrap SignupPage with Router
const SignupPageWithRouter = () => (
    <BrowserRouter>
        <SignupPage />
    </BrowserRouter>
);

describe('SignupPage', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        mockNavbar.mockClear();
        
        // Set up default mocks
        mockUseNavigate.mockReturnValue(mockNavigate);
    });

    describe('Component Rendering', () => {
        it('renders the signup form with correct structure', () => {
            render(<SignupPageWithRouter />);
            
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
            expect(screen.getByLabelText('First Name:')).toBeInTheDocument();
            expect(screen.getByLabelText('Last Name:')).toBeInTheDocument();
            expect(screen.getByLabelText('Email:')).toBeInTheDocument();
            expect(screen.getByLabelText('Password:')).toBeInTheDocument();
            expect(screen.getByRole('button', { name: 'Submit signup form' })).toBeInTheDocument();
            expect(screen.getByText('Already have an account?')).toBeInTheDocument();
            expect(screen.getByText('Log In!')).toBeInTheDocument();
        });

        it('applies correct CSS classes and attributes', () => {
            render(<SignupPageWithRouter />);
            
            const form = screen.getByRole('form', { name: 'Submit form' });
            expect(form).toHaveClass('signup-form');
            
            const firstNameInput = screen.getByLabelText('First Name:');
            expect(firstNameInput).toHaveAttribute('type', 'text');
            expect(firstNameInput).toHaveAttribute('placeholder', 'Enter your first name...');
            
            const lastNameInput = screen.getByLabelText('Last Name:');
            expect(lastNameInput).toHaveAttribute('type', 'text');
            expect(lastNameInput).toHaveAttribute('placeholder', 'Enter your last name...');
            
            const emailInput = screen.getByLabelText('Email:');
            expect(emailInput).toHaveAttribute('type', 'text');
            expect(emailInput).toHaveAttribute('placeholder', 'Enter your email address...');
            
            const passwordInput = screen.getByLabelText('Password:');
            expect(passwordInput).toHaveAttribute('type', 'password');
            expect(passwordInput).toHaveAttribute('placeholder', 'Choose a password...');
            
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            expect(submitButton).toHaveAttribute('type', 'submit');
        });

        it('renders Navbar component', () => {
            render(<SignupPageWithRouter />);
            
            expect(mockNavbar).toHaveBeenCalled();
            expect(screen.getByTestId('navbar')).toBeInTheDocument();
        });

        it('renders login link with correct href', () => {
            render(<SignupPageWithRouter />);
            
            const loginLink = screen.getByText('Log In!');
            expect(loginLink).toHaveAttribute('href', '/login');
        });
    });

    describe('Form Input Handling', () => {
        it('updates first name input value when typed', () => {
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            
            expect(firstNameInput).toHaveValue('John');
        });

        it('updates last name input value when typed', () => {
            render(<SignupPageWithRouter />);
            
            const lastNameInput = screen.getByLabelText('Last Name:');
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            
            expect(lastNameInput).toHaveValue('Doe');
        });

        it('updates email input value when typed', () => {
            render(<SignupPageWithRouter />);
            
            const emailInput = screen.getByLabelText('Email:');
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            
            expect(emailInput).toHaveValue('john@example.com');
        });

        it('updates password input value when typed', () => {
            render(<SignupPageWithRouter />);
            
            const passwordInput = screen.getByLabelText('Password:');
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            
            expect(passwordInput).toHaveValue('password123');
        });

        it('maintains form state across multiple changes', () => {
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john@test.com' } });
            fireEvent.change(passwordInput, { target: { value: 'mypassword' } });
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            
            expect(firstNameInput).toHaveValue('Jane');
            expect(lastNameInput).toHaveValue('Doe');
            expect(emailInput).toHaveValue('john@test.com');
            expect(passwordInput).toHaveValue('mypassword');
        });

        it('starts with empty form fields', () => {
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            
            expect(firstNameInput).toHaveValue('');
            expect(lastNameInput).toHaveValue('');
            expect(emailInput).toHaveValue('');
            expect(passwordInput).toHaveValue('');
            });
    });

    describe('Form Submission', () => {
        it('prevents default form submission behavior', async () => {
            mockSignup.mockResolvedValue();
            
            render(<SignupPageWithRouter />);
            
            const form = screen.getByRole('form', { name: 'Submit form' });
            fireEvent.submit(form);
            
            // If preventDefault() worked, signup should be called
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalled();
            });
        });

        it('calls signup service with all form data', async () => {
        mockSignup.mockResolvedValue();
        
        render(<SignupPageWithRouter />);
        
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalledWith('john@example.com', 'password123', 'John', 'Doe');
            });
        });

        it('handles empty form submission', async () => {
            mockSignup.mockResolvedValue();
            
            render(<SignupPageWithRouter />);
            
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalledWith('', '', '', '');
            });
        });

        it('handles partial form submission', async () => {
        mockSignup.mockResolvedValue();
        
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const emailInput = screen.getByLabelText('Email:');
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalledWith('john@example.com', '', 'John', '');
            });
        });
    });

    describe('Successful Signup Flow', () => {
        it('navigates to login page after successful signup', async () => {
            mockSignup.mockResolvedValue();
            
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/login');
            });
        });

        it('follows correct sequence for successful signup', async () => {
            mockSignup.mockResolvedValue();
        
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
            fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
            fireEvent.change(emailInput, { target: { value: 'jane@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'securepass' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalledWith('jane@example.com', 'securepass', 'Jane', 'Smith');
            });
            
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/login');
            });
        });
    });

    describe('Failed Signup Flow', () => {
        it('navigates to signup page on failure', async () => {
            mockSignup.mockRejectedValue(new Error('Signup failed'));
            
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            fireEvent.change(firstNameInput, { target: { value: 'John' } });
            fireEvent.change(lastNameInput, { target: { value: 'Doe' } });
            fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password123' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/signup');
            });
        });

        it('logs error on signup failure', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const signupError = new Error('Email already exists');
            mockSignup.mockRejectedValue(signupError);
            
            render(<SignupPageWithRouter />);
            
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(consoleErrorSpy).toHaveBeenCalledWith(signupError);
            });
            
            consoleErrorSpy.mockRestore();
        });

        it('handles different types of signup errors', async () => {
            const networkError = new Error('Network error');
            mockSignup.mockRejectedValue(networkError);
            
            render(<SignupPageWithRouter />);
            
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/signup');
            });
        });
    });

    describe('Navigation Integration', () => {
        it('calls useNavigate hook', () => {
            render(<SignupPageWithRouter />);
            
            expect(mockUseNavigate).toHaveBeenCalled();
            });

            it('handles navigation gracefully when navigate is undefined', () => {
            mockUseNavigate.mockReturnValue(undefined);
            
            expect(() => {
                render(<SignupPageWithRouter />);
            }).not.toThrow();
        });
    });

    describe('Edge Cases', () => {
        it('handles very long input values', () => {
            render(<SignupPageWithRouter />);
            
            const longName = 'a'.repeat(1000);
            const longEmail = 'b'.repeat(500) + '@example.com';
            const longPassword = 'c'.repeat(1000);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            
            fireEvent.change(firstNameInput, { target: { value: longName } });
            fireEvent.change(lastNameInput, { target: { value: longName } });
            fireEvent.change(emailInput, { target: { value: longEmail } });
            fireEvent.change(passwordInput, { target: { value: longPassword } });
            
            expect(firstNameInput).toHaveValue(longName);
            expect(lastNameInput).toHaveValue(longName);
            expect(emailInput).toHaveValue(longEmail);
            expect(passwordInput).toHaveValue(longPassword);
        });

        it('handles special characters in input fields', () => {
            render(<SignupPageWithRouter />);
            
            const specialFirstName = "Jean-François";
            const specialLastName = "O'Connor-Smith";
            const specialEmail = 'test+user@example-domain.co.uk';
            const specialPassword = 'P@ssw0rd!#$%&*()';
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            
            fireEvent.change(firstNameInput, { target: { value: specialFirstName } });
            fireEvent.change(lastNameInput, { target: { value: specialLastName } });
            fireEvent.change(emailInput, { target: { value: specialEmail } });
            fireEvent.change(passwordInput, { target: { value: specialPassword } });
            
            expect(firstNameInput).toHaveValue(specialFirstName);
            expect(lastNameInput).toHaveValue(specialLastName);
            expect(emailInput).toHaveValue(specialEmail);
            expect(passwordInput).toHaveValue(specialPassword);
        });

        it('handles signup service returning undefined', async () => {
            mockSignup.mockResolvedValue(undefined);
            
            render(<SignupPageWithRouter />);
            
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockNavigate).toHaveBeenCalledWith('/login');
            });
        });

        it('handles rapid form submissions', async () => {
            mockSignup.mockResolvedValue();
            
            render(<SignupPageWithRouter />);
            
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            // Rapid clicks
            fireEvent.click(submitButton);
            fireEvent.click(submitButton);
            fireEvent.click(submitButton);
            
            // Should still work normally
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalled();
            });
        });

        it('handles whitespace in input fields', async () => {
            mockSignup.mockResolvedValue();
            
            render(<SignupPageWithRouter />);
            
            const firstNameInput = screen.getByLabelText('First Name:');
            const lastNameInput = screen.getByLabelText('Last Name:');
            const emailInput = screen.getByLabelText('Email:');
            const passwordInput = screen.getByLabelText('Password:');
            const submitButton = screen.getByRole('button', { name: 'Submit signup form' });
            
            fireEvent.change(firstNameInput, { target: { value: '  John  ' } });
            fireEvent.change(lastNameInput, { target: { value: '  Doe  ' } });
            fireEvent.change(emailInput, { target: { value: '  test@example.com  ' } });
            fireEvent.change(passwordInput, { target: { value: '  password123  ' } });
            fireEvent.click(submitButton);
            
            await waitFor(() => {
                expect(mockSignup).toHaveBeenCalledWith('  test@example.com  ', '  password123  ', '  John  ', '  Doe  ');
            });
        });
    });
});