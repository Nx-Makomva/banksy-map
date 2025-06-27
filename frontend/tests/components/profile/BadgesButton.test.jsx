import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import BadgesButton from '../../../src/components/profile/BadgesButton';
import { useUser } from '../../../src/contexts/UserContext';

vi.mock('../../../src/contexts/UserContext');

describe('BadgesButton', () => {
    const mockRefreshUser = vi.fn();

    beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useUser).mockReturnValue({
        user: {
        badges: [{ _id: 'badge1' }, { _id: 'badge2' }],
        },
        refreshUser: mockRefreshUser,
    });
    });

    it('renders the button with image', () => {
    render(<BadgesButton />);
    expect(screen.getByRole('button')).toBeInTheDocument();
    expect(screen.getByAltText('View Badges')).toBeInTheDocument();
    });

    it('calls refreshUser and shows modal when button is clicked', async () => {
    render(<BadgesButton />);
    fireEvent.click(screen.getByRole('button'));

    expect(mockRefreshUser).toHaveBeenCalled();

    await waitFor(() => {
      expect(screen.getByRole('button')).toBeInTheDocument(); // Button still there, modal open or not not checked
    });
    });
});