import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect } from 'vitest';
import { TabButton } from '../../../src/components/profile/TabButton';

describe('TabButton', () => {
    it('renders with correct value and attributes', () => {
    const mockSetActiveTab = vi.fn();
    render(<TabButton name="collected" value="Visited" setActiveTab={mockSetActiveTab} />);
    
    const button = screen.getByRole('button', { name: 'Visited' });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('name', 'collected');
    expect(button).toHaveAttribute('value', 'Visited');
    expect(button).toHaveClass('tab-button');
    });

    it('calls setActiveTab with correct name when clicked', () => {
    const mockSetActiveTab = vi.fn();
    render(<TabButton name="collected" value="Visited" setActiveTab={mockSetActiveTab} />);
    
    fireEvent.click(screen.getByRole('button', { name: 'Visited' }));
    
    expect(mockSetActiveTab).toHaveBeenCalledWith('collected');
    });
    
});