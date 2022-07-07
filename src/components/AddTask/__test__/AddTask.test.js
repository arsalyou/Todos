import { render, screen, fireEvent } from '@testing-library/react';
import AddTask from '../AddTask';

const mockedSetFunction = jest.fn();

describe("Input Todo Task Field", () => {
    it('should render TextField element', () => {
        render(
            <AddTask 
            />
        );
        const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
        expect(inputElement).toBeInTheDocument();
    });
    
    it('should be able to type into TextField', () => {
        render(
            <AddTask 
            />
        );
        const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
        fireEvent.click(inputElement)
        fireEvent.change(inputElement, { target: { value: "Submit Filestage task" } })
        expect(inputElement.value).toBe("Submit Filestage task");
    });
    
    it('should be able to type into TextField', () => {
        render(
            <AddTask 
            />
        );
        const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
        fireEvent.click(inputElement)
        fireEvent.change(inputElement, { target: { value: "Submit Filestage task" } });
        const buttonElement = screen.getByRole("button", { name: /Add/i});
        fireEvent.click(buttonElement)
        //expect(mockedSetTodo).toBeCalled()
    });
    
    it('should have empty input when add button is cliked', () => {
        render(
            <AddTask 
            />
        );
        const inputElement = screen.getByPlaceholderText(/Add a new todo/i);
        fireEvent.change(inputElement, { target: { value: "Submit Filestage task" } });
        const buttonElement = screen.getByRole("button", { name: /Add/i});
        //console.log(buttonElement);
        fireEvent.click(buttonElement)
        expect(inputElement.value).toBe("")
    });
})