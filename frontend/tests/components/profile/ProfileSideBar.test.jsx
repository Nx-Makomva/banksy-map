import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ProfileSideBar } from '../../../src/components/profile/ProfileSideBar';
import { useUser } from '../../../src/contexts/UserContext';

vi.mock('../../../src/contexts/UserContext');

describe('ProfileSideBar', () => {
    beforeEach(() => {
    vi.mocked(useUser).mockReturnValue({
        user: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        bookmarkedArtworks: [1, 2, 3],
        visitedArtworks: [4, 5],
        badges: [{ _id: 'b1' }, { _id: 'b2' }, { _id: 'b3' }, { _id: 'b4' }],
        },
    });
    });

    it('renders user info and stats correctly', () => {
    render(<ProfileSideBar />);

    expect(screen.getByText('JD')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();

    expect(screen.getByText('Visited Artworks: 2')).toBeInTheDocument();
    expect(screen.getByText('Bookmarked Artworks: 3')).toBeInTheDocument();
    expect(screen.getByText('Badges: 4')).toBeInTheDocument();
    });

    it('renders profile image with correct alt text and src', () => {
    render(<ProfileSideBar />);
    const img = screen.getByAltText('Profile');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/subwaysurfer.jpg');
    });
});