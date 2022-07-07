import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe("Site Header", () => {
    it('display text passed into prop', () => {
        render(
            <Header 
              title="Todos"
            />
        );
        const h1Element = screen.getByText(/todos/i);
        expect(h1Element).toBeInTheDocument();
    });
})