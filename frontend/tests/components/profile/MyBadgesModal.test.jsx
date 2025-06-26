import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { expect, vi } from 'vitest';
import MyBadgesModal from '../../../src/components/MyBadgesModal';

//Mock BadgeCard
vi.mock('../../../src/components/BadgeCard', () => ({
    default: ({ name, isEarned }) => {
    console.log('BadgeCard mock called with:', { name, isEarned });
    return (
        <div data-testid="badge-card" data-earned={isEarned}>
            {name}
        </div>
        );
    }
}));

//Mock getAllBadges
vi.mock('../../../src/services/badge', () => ({
    getAllBadges: vi.fn()
}));

import { getAllBadges } from '../../../src/services/badge';

describe('MyBadgesModal', () => {
    const mockBadges = [
        {
            _id: '1',
            name: 'Explorer',
            description: 'Visit 5 locations',
            criteria: { type: 'visits', count: 5}
        },
        {
            _id: '2',
            name: 'Collector',
            description: 'Bookmark 3 pieces',
            criteria: { type: 'bookmarks', count: 3 }
        }
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    test('renders correctly when no badges are returned', async () => {
        getAllBadges.mockResolvedValueOnce([]);

        render(<MyBadgesModal earnedBadgeIds={[]} onClose={vi.fn()} />);

        expect(await screen.findByText('My Badges')).toBeInTheDocument();
        expect(screen.queryByTestId('badge-card')).not.toBeInTheDocument();
        expect(screen.getByText('0 / 0 UNLOCKED')).toBeInTheDocument();
    });


    test('renders modal title and loads badges', async () => {
        getAllBadges.mockResolvedValueOnce(mockBadges);

        render(<MyBadgesModal earnedBadgeIds={[]} onClose={vi.fn()} />);
        expect(screen.getByText('My Badges')).toBeInTheDocument();

        const badgeCards = await screen.findAllByTestId('badge-card');
        expect(badgeCards.length).toBe(2);
    });

    test('marks earned badges correctly', async () => {
        getAllBadges.mockResolvedValueOnce(mockBadges);

        render(<MyBadgesModal earnedBadgeIds={['1']} onClose={vi.fn()} />);

        const badgeCards = await screen.findAllByTestId('badge-card');
        expect(badgeCards[0]).toHaveAttribute('data-earned', 'true');
        expect(badgeCards[1]).toHaveAttribute('data-earned', 'false');
    });

    test('displays unlock count correctly', async () => {
        getAllBadges.mockResolvedValueOnce(mockBadges);

        render(<MyBadgesModal earnedBadgeIds={['1']} onClose={vi.fn()} />);
        const unlockText = await screen.findByText('1 / 2 UNLOCKED');
        expect(unlockText).toBeInTheDocument();
    });

    test('calls onClose when close button is clicked', async () => {
        getAllBadges.mockResolvedValueOnce(mockBadges);
        const onClose = vi.fn();

        render(<MyBadgesModal earnedBadgeIds={[]} onClose={onClose} />);
        const closeBtn = screen.getByRole('button', { name: 'x'});

        fireEvent.click(closeBtn);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    test('handles fetch error gracefully', async () => {
    const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAllBadges.mockRejectedValueOnce(new Error('Failed to load badges'));

    render(<MyBadgesModal earnedBadgeIds={[]} onClose={vi.fn()} />);

    await waitFor(() => {
        expect(errorSpy).toHaveBeenCalledWith(
            'Failed to load badges:',
            expect.any(Error)
        );
    });

        errorSpy.mockRestore();
    });
});