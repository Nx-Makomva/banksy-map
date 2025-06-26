import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, vi } from 'vitest';
import MyBadgesModal from '../../../src/components/MyBadgesModal';
import { getAllBadges } from '../../../src/services/badge';

//Mock BadgeCard
vi.mock('../../../scr/components/BadgeCard', () => ({
    default: ({ name, isEarned }) => (
        <div data-testid='badge-card' data-earned={isEarned}>
            {name}
        </div>
    )
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
});

beforeEach(() => {
    vi.clearAllMocks();
});

test('renders modal title and loads badges', async () => {
    getAllBadges.mockResolvedValueOnce(mockBadges);

    render(<MyBadgesModal earnedBadgeIds={[]} onClose={vi.fn()} />);
    expect(screen.getByText('My Badges')).toBeInTheDocument();

    
})