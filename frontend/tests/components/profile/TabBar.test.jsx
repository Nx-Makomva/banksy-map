import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { TabBar } from '../../../src/components/profile/TabBar';

vi.mock('../../../src/components/TabButton', () => ({
    TabButton: ({ name, value, setActiveTab }) => (
    <button onClick={() => setActiveTab(name)}>{value}</button>
    ),
}));

describe('TabBar', () => {
    it('renders all tab buttons', () => {
    const mockSetActiveTab = vi.fn();
    render(<TabBar setActiveTab={mockSetActiveTab} />);

    expect(screen.getByText('Visited')).toBeInTheDocument();
    expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    expect(screen.getByText('Comments')).toBeInTheDocument();
    });

    it('calls setActiveTab with correct name when tab clicked', () => {
    const mockSetActiveTab = vi.fn();
    render(<TabBar setActiveTab={mockSetActiveTab} />);

    fireEvent.click(screen.getByText('Visited'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('collected');

    fireEvent.click(screen.getByText('Bookmarks'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('bookmarks');

    fireEvent.click(screen.getByText('Comments'));
    expect(mockSetActiveTab).toHaveBeenCalledWith('comments');
    });
});