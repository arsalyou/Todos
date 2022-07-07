import { render, screen, fireEvent } from '@testing-library/react';
import TodoPage from '../TodoPage';


const addTodo = (todos) => {
    const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
    const buttonElement = screen.getByRole("button", { name: /Add/i} );
    todos.forEach((todo) => {
        fireEvent.change(inputElement, { target: { value: todo } });
        fireEvent.click(buttonElement);
    })
}

describe('IntersectionObserverMokTest', () => {

    const mockIntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    
      beforeEach(() => {
        window.IntersectionObserver = mockIntersectionObserver;
      });

it('should be able to type into input', () => {
    const mockIntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    
      beforeEach(() => {
        window.IntersectionObserver = mockIntersectionObserver;
      });
    render(
        <TodoPage />
    );
    addTodo(["Submit Filestage Assignment"])
    const divElement = screen.getByText(/Submit Filestage Assignment/i);
    expect(divElement).toBeInTheDocument()
});

it('should render multiple items', () => {
    const mockIntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    
      beforeEach(() => {
        window.IntersectionObserver = mockIntersectionObserver;
      });
    render(
        <TodoPage />
    );
    addTodo([ "Submit Filestage Assignment", "Submit Filestage Assignment"])
    const divElements = screen.queryAllByText(/Submit Filestage Assignment/i);
    expect(divElements.length).toBe(2)
});


it('todo should have complete class when clicked', async () => {
    const mockIntersectionObserver = class {
        constructor() {}
        observe() {}
        unobserve() {}
        disconnect() {}
      };
    
      beforeEach(() => {
        window.IntersectionObserver = mockIntersectionObserver;
      });
    render(
        <TodoPage />
    );
    addTodo(["Submit Filestage Assignment"])
    const divElement = screen.getByText(/Submit Filestage Assignment/i);
    fireEvent.click(divElement)
    expect(divElement).toHaveClass("todoTextCompleted")
});

});