import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup, getByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';

import AddChatroomInput from 'components/inputs/add-chatroom-input';
import userEvent from '@testing-library/user-event';

describe('AddChatroomInput', () => {
    const mockSearch = jest.fn((query) => {});
    const mockInput = 'Hello, World!';

    const Element = <AddChatroomInput search={mockSearch} />;

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
        expect(true).toBeTruthy();
    });

    it('Should render the necessary fields and button', () => {
        const { queryByPlaceholderText, queryByRole } = render(Element);

        const submitButton = queryByRole('button');
        const inputField = queryByPlaceholderText('SEARCH BY USERNAME');

        expect(submitButton).toBeInTheDocument();
        expect(inputField).toBeInTheDocument();
    });

    it('Should calls the search function when the form is submitted', () => {
        const { getByPlaceholderText, getByRole } = render(Element);

        const submitButton = getByRole('button');
        const inputField = getByPlaceholderText('SEARCH BY USERNAME');

        userEvent.type(inputField, mockInput);
        userEvent.click(submitButton);

        expect(mockSearch).toHaveBeenCalled();
        expect(mockSearch).toHaveBeenCalledWith(mockInput);
    });

    it('Should not reset the value of the text field when the form is submitted', () => {
        const { getByPlaceholderText, getByRole } = render(Element);

        const submitButton = getByRole('button');
        const inputField = getByPlaceholderText('SEARCH BY USERNAME');

        userEvent.type(inputField, mockInput);
        expect((inputField as HTMLInputElement).value).toBe(mockInput);

        userEvent.click(submitButton);

        expect((inputField as HTMLInputElement).value).toBe(mockInput);
    });

    it('Should not render the reset button if the text field is empty', () => {
        const { getByPlaceholderText, queryByTestId } = render(Element);
        const inputField = getByPlaceholderText('SEARCH BY USERNAME');
        const resetButton = queryByTestId('addchatroom-reset');

        expect(resetButton).not.toBeInTheDocument();

        userEvent.type(inputField, mockInput);
        expect(queryByTestId('addchatroom-reset')).toBeInTheDocument();
    });

    it('Should reset the value of the text field when reset button is clicked', () => {
        const { getByPlaceholderText, getByTestId } = render(Element);
        const inputField = getByPlaceholderText('SEARCH BY USERNAME');

        userEvent.type(inputField, mockInput);
        const resetButton = getByTestId('addchatroom-reset');

        expect((inputField as HTMLInputElement).value).toBe(mockInput);
        userEvent.click(resetButton);
        expect((inputField as HTMLInputElement).value).toBe('');
    });

    it('matches snapshot', () => {
        const run = true;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            // eslint-disable-next-line jest/no-conditional-expect
            expect(tree).toMatchSnapshot();
        }
    });
});
