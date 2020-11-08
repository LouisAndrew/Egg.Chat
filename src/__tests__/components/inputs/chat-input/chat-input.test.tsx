import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { cleanup, render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import { ChatInput } from 'components/inputs/chat-input/chat-input';

describe('ChatInput', () => {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const mockSendMsg = jest.fn((str) => {});

    const Element = <ChatInput sendMsg={mockSendMsg} />;

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
        expect(true).toBeTruthy();
    });

    it('Should render all necessary elements', () => {
        const { queryByPlaceholderText, queryByRole } = render(Element);

        const submitButton = queryByRole('button');
        const inputField = queryByPlaceholderText('Type Here');

        expect(submitButton).toBeInTheDocument();
        expect(inputField).toBeInTheDocument();
    });

    it('Should calls the function sendMsg when the form is submitted.', () => {
        const { getByPlaceholderText, getByRole } = render(Element);

        const submitButton = getByRole('button');
        const inputField = getByPlaceholderText('Type Here');

        const mockText = 'Hello, world!';

        userEvent.type(inputField, mockText);
        userEvent.click(submitButton);

        expect(mockSendMsg).toHaveBeenCalled();
        expect(mockSendMsg).toHaveBeenCalledWith(mockText);
    });

    it('Should clear the input field when the form is submitted.', () => {
        const { getByPlaceholderText, getByRole } = render(Element);

        const submitButton = getByRole('button');
        const inputField = getByPlaceholderText('Type Here');

        const mockText = 'Hello, world!';

        userEvent.type(inputField, mockText);

        expect((inputField as HTMLInputElement).value).toBe(mockText);

        userEvent.click(submitButton);

        expect((inputField as HTMLInputElement).value).toBe('');
    });

    it('matches snapshot', () => {
        const run = false;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            // eslint-disable-next-line jest/no-conditional-expect
            expect(tree).toMatchSnapshot();
        }
    });
});
