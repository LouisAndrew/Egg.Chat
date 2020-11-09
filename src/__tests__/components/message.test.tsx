import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

import Message from 'components/message';

// mockMesasge is sent by user1.
import { mockMessage, mockUser1, mockUser2 } from 'helper/mocks';
import theme from 'styles/theme';
import WithTheme from 'helper/util/with-theme';

describe('Message', () => {
    const mockDeleteMessage = jest.fn((str) => {});

    // message: SENT
    const Element = (
        <WithTheme>
            <Message
                {...mockMessage}
                userId={mockUser1.uid}
                deleteMsg={mockDeleteMessage}
            />
        </WithTheme>
    );

    // message: RECEIVED.
    const ElementUser2 = (
        <WithTheme>
            <Message
                {...mockMessage}
                userId={mockUser2.uid}
                deleteMsg={mockDeleteMessage}
            />
        </WithTheme>
    );

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
    });

    it('Should render the message content correctly.', () => {
        const { queryByText } = render(Element);

        const content = queryByText(mockMessage.msg);
        expect(content).toBeInTheDocument();
    });

    it('Should render the "RECEIVED" variant of the component if the message is sent by logged in user.', () => {
        const { getByTestId } = render(ElementUser2);

        const wrapper = getByTestId('wrapper');
        expect(wrapper).toHaveStyle(
            `background-color: ${theme.colors.white[0]}`
        );
        expect(wrapper).toHaveStyle(`color: ${theme.colors.black[1]}`);
    });

    it('Should render the "SENT" variant of the component if message is not sent by logged in user', () => {
        const { getByTestId } = render(Element);

        const wrapper = getByTestId('wrapper');
        expect(wrapper).toHaveStyle(
            `background-color: ${theme.colors.blue.dark[0]}`
        );
        expect(wrapper).toHaveStyle(`color: ${theme.colors.white[1]}`);
    });

    it('Should not display menu-arrow when message is not sent by logged in user', () => {
        const { queryByTestId, getByTestId } = render(ElementUser2);

        const wrapper = getByTestId('wrapper');
        userEvent.hover(wrapper);

        const menuArrow = queryByTestId('menu-arrow');
        expect(menuArrow).not.toBeInTheDocument();
    });

    it('Should display menu-arrow when the component is hovered if the message is sent by logged in user.', () => {
        const { queryByTestId, getByTestId } = render(Element);

        const wrapper = getByTestId('wrapper');
        userEvent.hover(wrapper);

        const menuArrow = queryByTestId('menu-arrow');
        expect(menuArrow).toBeInTheDocument();
    });

    it('Should display menu to delete message when the menu-arrow is clicked.', () => {
        const { getByTestId } = render(Element);

        const wrapper = getByTestId('wrapper');
        userEvent.hover(wrapper);

        const menuArrow = getByTestId('menu-arrow');
        userEvent.click(menuArrow);

        const menuDelete = getByTestId('menu-delete');
        expect(menuDelete).toBeInTheDocument();
    });

    it('Should calls the deleteMsg when the menu to delete message is clicked.', () => {
        const { getByTestId } = render(Element);

        const wrapper = getByTestId('wrapper');
        userEvent.hover(wrapper);

        const menuArrow = getByTestId('menu-arrow');
        userEvent.click(menuArrow);

        const menuDelete = getByTestId('menu-delete');
        userEvent.click(menuDelete);

        expect(mockDeleteMessage).toBeCalled();
        expect(mockDeleteMessage).toBeCalledWith(mockMessage.msgId);
    });

    it('matches snapshot', () => {
        const run = true;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
