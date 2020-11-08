import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import ChatInput from 'components/inputs/search-input';

describe('ChatInput', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockSearch = jest.fn((name) => {});
    const mockInput = 'John Doe';

    const Element = <ChatInput search={mockSearch} />;

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
        expect(true).toBeTruthy();
    });

    it('Should render the necessary fields', () => {
        const { queryByPlaceholderText } = render(Element);
        const inputField = queryByPlaceholderText('SEARCH NAME');

        expect(inputField).toBeInTheDocument();
    });

    it('Should search for the available / in-contact chatroom when user types in the input field', () => {
        const { getByPlaceholderText } = render(Element);

        const inputField = getByPlaceholderText('SEARCH NAME');

        userEvent.type(inputField, mockInput);
        expect(mockSearch).toBeCalled();
        expect(mockSearch).toBeCalledWith(mockInput);
    });

    it('Should not render the reset button if the text field is empty', () => {
        const { getByPlaceholderText, queryByTestId } = render(Element);
        const inputField = getByPlaceholderText('SEARCH NAME');
        const resetButton = queryByTestId('search-reset');

        expect(resetButton).not.toBeInTheDocument();

        userEvent.type(inputField, mockInput);
        expect(queryByTestId('search-reset')).toBeInTheDocument();
    });

    it('Should reset the value of the text field when reset button is clicked', () => {
        const { getByPlaceholderText, getByTestId } = render(Element);
        const inputField = getByPlaceholderText('SEARCH NAME');

        userEvent.type(inputField, mockInput);
        const resetButton = getByTestId('search-reset');

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
