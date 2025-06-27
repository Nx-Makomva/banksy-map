import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('../../src/services/visits', () => ({
    addVisit: vi.fn(),
    removeVisit: vi.fn(),
}));

vi.mock('../../src/contexts/UserContext', () => ({
    useUser: vi.fn(),
}));

vi.mock('react-icons/ti', () => ({
    TiTickOutline: () => <span data-testid="unvisited-tick">✗</span>,
    TiTick: () => <span data-testid="visited-tick">✓</span>,
}));

import * as visitService from '../../src/services/visits';
import { useUser } from '../../src/contexts/UserContext';
import VisitButton from '../../src/components/VisitButton';

describe('VisitButton', () => {
    const mockOnToggle = vi.fn();
    const mockRefreshUser = vi.fn();

    beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUser).mockReturnValue({
        refreshUser: mockRefreshUser,
    });
    });

    it('renders unvisited tick when not visited', () => {
    render(
        <VisitButton artworkId="art123" isVisited={false} onToggle={mockOnToggle} />
    );

    expect(screen.getByTestId('unvisited-tick')).toBeInTheDocument();
    expect(screen.getByTitle('Add visit')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
    });

    it('renders visited tick when visited', () => {
    render(
        <VisitButton artworkId="art123" isVisited={true} onToggle={mockOnToggle} />
    );

    expect(screen.getByTestId('visited-tick')).toBeInTheDocument();
    expect(screen.getByTitle('Remove visit')).toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');
    });

    it('adds visit when clicked and not visited', async () => {
    visitService.addVisit.mockResolvedValue();

    render(
        <VisitButton artworkId="art123" isVisited={false} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(visitService.addVisit).toHaveBeenCalledWith('art123');
        expect(mockRefreshUser).toHaveBeenCalled();
        expect(mockOnToggle).toHaveBeenCalledWith(true, 'art123');
    });
    });

    it('removes visit when clicked and visited', async () => {
    visitService.removeVisit.mockResolvedValue();

    render(
        <VisitButton artworkId="art123" isVisited={true} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(visitService.removeVisit).toHaveBeenCalledWith('art123');
        expect(mockRefreshUser).toHaveBeenCalled();
        expect(mockOnToggle).toHaveBeenCalledWith(false, 'art123');
    });
    });

    it('handles add visit error gracefully', async () => {
    const error = new Error('Network error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(visitService.addVisit).mockRejectedValue(error);

    render(
        <VisitButton artworkId="art123" isVisited={false} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Bookmark error:', error);
    });

    consoleSpy.mockRestore();
    });

    it('handles remove visit error gracefully', async () => {
    const error = new Error('Server error');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(visitService.removeVisit).mockRejectedValue(error);

    render(
        <VisitButton artworkId="art123" isVisited={true} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(consoleSpy).toHaveBeenCalledWith('Bookmark error:', error);
    });

    consoleSpy.mockRestore();
    });

    it('does not call onToggle when service call fails', async () => {
    vi.mocked(visitService.addVisit).mockRejectedValue(new Error('Service error'));

    render(
        <VisitButton artworkId="art123" isVisited={false} onToggle={mockOnToggle} />
    );

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
        expect(visitService.addVisit).toHaveBeenCalled();
    });

    expect(mockOnToggle).not.toHaveBeenCalled();
    expect(mockRefreshUser).not.toHaveBeenCalled();
    });
});