import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import BadgesButton from '../../../src/components/profile/BadgesButton';

// Mock useUser and MyBadgesModal
vi.mock('../../../src/contexts/UserContext', () => ({
    useUser: vi.fn()
}));

vi.mock('../../../src/components/MyBadgesModal', () => ({
    default: ({ onClose, earnedBadgeIds }) => (
        <div data-testid="my-badges-modal">
            Modal Open - Badges: {earnedBadgeIds.join(',')}
        <button onClick={onClose}>Close</button>
    </div>
    )
}));

import { useUser } from '../../../src/contexts/UserContext';

describe('BadgesButton', () => {
    const mockRefreshUser = vi.fn();
    const mockUser = {
        badges: [
            { _id: 'badge1' },
            { _id: 'badge2' }
        ]   
    };

    beforeEach(() => {
        vi.clearAllMocks();
        useUser.mockReturnValue({
            user: mockUser,
            refreshUser: mockRefreshUser
        });
    });

    test('renders button with correct image', () => {
        render(<BadgesButton />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByAltText('View Badges')).toHaveAttribute('src', '/VIEW BADGES.png');
    });

    test('calls refreshUser and shows modal on click', async () => {
        mockRefreshUser.mockResolvedValueOnce();

        render(<BadgesButton />);
        fireEvent.click(screen.getByRole('button'));

        await waitFor(() => {
        expect(mockRefreshUser).toHaveBeenCalled();
        expect(screen.getByTestId('my-badges-modal')).toBeInTheDocument();
        });
    });

    test('passes earnedBadgeIds to MyBadgesModal', async () => {
        mockRefreshUser.mockResolvedValueOnce();

        render(<BadgesButton />);
        fireEvent.click(screen.getByRole('button'));

        const modal = await screen.findByTestId('my-badges-modal');
        expect(modal).toHaveTextContent('badge1,badge2');
    });

    test('closes modal on onClose', async () => {
        mockRefreshUser.mockResolvedValueOnce();

        render(<BadgesButton />);
        fireEvent.click(screen.getByRole('button'));

        const modal = await screen.findByTestId('my-badges-modal');
        expect(modal).toBeInTheDocument();

        fireEvent.click(screen.getByText('Close'));
        await waitFor(() => {
            expect(screen.queryByTestId('my-badges-modal')).not.toBeInTheDocument();
        });
    });
});
