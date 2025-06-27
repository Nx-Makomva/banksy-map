import { render, screen } from "@testing-library/react";
import BadgeCard from "../../src/components/BadgeCard";
import { describe, expect } from "vitest";

describe('BadgeCard', () => {
    const defaultProps = {
        name: 'Explorer',
        description: 'Visit 5 locations',
        icon: '/explorer.png',
        style: 'classic'
    };

    test('renders badge name and descriprion', () => {
        render(<BadgeCard {...defaultProps} isEarned={true} />);
        expect(screen.getByText('Explorer')).toBeInTheDocument();
        expect(screen.getByText('Visit 5 locations')).toBeInTheDocument();
    });

    test('renders icon with correct src and alt', () => {
        render(<BadgeCard {...defaultProps} isEarned={true} />);
        const img = screen.getByAltText('Explorer');
        expect(img).toHaveAttribute('src', '/explorer.png');
    });

    test('renders default icon if none provided', () => {
        render(<BadgeCard {...defaultProps} icon={null} isEarned={true} />);
        const img = screen.getByAltText('Explorer');
        expect(img).toHaveAttribute('src', '/default-badge.png');
    });

    test('shows "UNLOCKED" tag when earned', () => {
        render(<BadgeCard {...defaultProps} isEarned={true} />);
        expect(screen.getByText('UNLOCKED')).toBeInTheDocument();
    });

    test('shows 🔒 lock overlay when not earned', () => {
        render(<BadgeCard {...defaultProps} isEarned={false} />);
        expect(screen.getByText('🔒')).toBeInTheDocument();
    });

    test('applies correct classes based on isEarned and style', () => {
        const { container } = render(<BadgeCard {...defaultProps} isEarned={true} style='graffiti' />);
        expect(container.firstChild).toHaveClass('badge-card earned graffiti');
    });

    test('sets CSS variable --spray-color', () => {
        const { container } = render(<BadgeCard {...defaultProps} isEarned={true} sprayColor="#00ff00" />);
        const spray = container.querySelector('.spray-effect');
        expect(spray.style.getPropertyValue('--spray-color')).toBe('#00ff00');
    });
})