import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock react-dom/client
const mockRender = vi.fn();
const mockCreateRoot = vi.fn(() => ({ render: mockRender }));

vi.mock('react-dom/client', () => ({
    createRoot: mockCreateRoot
}));

// Mock the App component
vi.mock('../src/App.jsx', () => ({
    default: () => <div data-testid="app">App</div>
}));

// Mock CSS import
vi.mock('../src/index.css', () => ({}));

describe('main.jsx', () => {
    beforeEach(() => {
        vi.clearAllMocks();
        
        // Mock document.getElementById
        const mockRootElement = document.createElement('div');
        mockRootElement.id = 'root';
        document.getElementById = vi.fn().mockReturnValue(mockRootElement);
    });

    it('renders the App component', async () => {
            await import('../src/main.jsx');

            expect(document.getElementById).toHaveBeenCalledWith('root');
            expect(mockCreateRoot).toHaveBeenCalled();
            expect(mockRender).toHaveBeenCalled();
    });
});