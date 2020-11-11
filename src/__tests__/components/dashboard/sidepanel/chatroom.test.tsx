import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Chatroom from 'components/dashboard/sidepanel/chatroom';
import { mockChatroom } from 'helper/mocks';
import { Chatroom as RoomSchema } from 'helper/schema';
import { getTime } from 'helper/util/get-time';
import theme from 'styles/theme';
import WithTheme from 'helper/util/with-theme';

describe('Chatroom', () => {
    const roomName = 'John Doe';
    const imgUrl = './src/img';

    const lastMsg = mockChatroom.messages[mockChatroom.messages.length - 1];

    // extending the chatroom mock to provide more details!
    const mockChatroomExtended: RoomSchema = {
        ...mockChatroom,
        roomName,
        imgUrl,
    };

    const mockChatroomEmpty: RoomSchema = {
        ...mockChatroomExtended,
        messages: [],
    };

    const mockSetActiveChatroom = jest.fn((str) => {});

    const Element = (
        <WithTheme>
            <Chatroom
                {...mockChatroomExtended}
                isActive={false}
                setActiveChatRoom={mockSetActiveChatroom}
                data-testid="wrapper"
            />
        </WithTheme>
    );

    const ElementNewNotif = (
        <Chatroom
            {...mockChatroomExtended}
            isActive={false}
            setActiveChatRoom={mockSetActiveChatroom}
            isNewNotification={true}
            data-testid="wrapper"
        />
    );

    const ElementActive = (
        <WithTheme>
            <Chatroom
                {...mockChatroomExtended}
                isActive={true}
                setActiveChatRoom={mockSetActiveChatroom}
                data-testid="wrapper"
            />
        </WithTheme>
    );

    const ElementEmpty = (
        <Chatroom
            {...mockChatroomEmpty}
            isActive={false}
            setActiveChatRoom={mockSetActiveChatroom}
            data-testid="wrapper"
        />
    );

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
    });

    it('Should render the name of the room and its image correctly', () => {
        const { queryByText, queryByRole } = render(Element);

        const roomNameEl = queryByText(roomName);
        const img = queryByRole('img');

        expect(roomNameEl).toBeInTheDocument();
        expect(img).toBeInTheDocument();
        expect((img as HTMLImageElement).src).toBe(
            imgUrl.replace('.', 'http://localhost')
        );
    });

    it('Should render the last message in the room and when its sent', () => {
        const { queryByTestId } = render(Element);

        // querying component by lastMsg's last send content
        const lastMsgEl = queryByTestId('last-msg');
        // querying component by lastMsg's last sent date
        const lastMsgDate = queryByTestId('last-msg-sent');

        expect(lastMsgEl).toBeInTheDocument();
        expect(lastMsgEl).toHaveTextContent(lastMsg.msg);

        expect(lastMsgDate).toBeInTheDocument();
        expect(lastMsgDate).toHaveTextContent(getTime(lastMsg.sentAt));
    });

    it("Should not render last message and when its sent if the room's message is empty", () => {
        const { queryByTestId } = render(ElementEmpty);

        // querying component by lastMsg's last send content
        const lastMsgEl = queryByTestId('last-msg');
        // querying component by lastMsg's last sent date
        const lastMsgDate = queryByTestId('last-msg-sent');

        expect(lastMsgEl).not.toBeInTheDocument();
        expect(lastMsgDate).not.toBeInTheDocument();
    });

    it('Should not render the new notification badge if isNewNotification is not set', () => {
        const { queryByTestId } = render(Element);

        const newNotifBadge = queryByTestId('new-notification-badge');

        expect(newNotifBadge).not.toBeInTheDocument();
    });

    it('Should render the new notification badge if isNewNotification is set to true', () => {
        const { queryByTestId } = render(ElementNewNotif);

        const newNotifBadge = queryByTestId('new-notification-badge');

        expect(newNotifBadge).toBeInTheDocument();
    });

    it('Should not render the ACTIVE variant of the component if the room is currently active', () => {
        const { getByTestId } = render(Element);

        const wrapper = getByTestId('wrapper');

        expect(wrapper).not.toHaveStyle(
            `background-color: ${theme.colors.blue.dark[2]}`
        );
    });

    it('Should render the ACTIVE variant of the component if the room is currently active', () => {
        const { getByTestId } = render(ElementActive);

        const wrapper = getByTestId('wrapper');

        expect(wrapper).toHaveStyle(
            `background-color: ${theme.colors.blue.dark[2]}`
        );
    });

    it('Should call the setActiveChatRoom function if the compopnent is clicked', () => {
        const { getByTestId } = render(ElementActive);

        const wrapper = getByTestId('wrapper');

        userEvent.click(wrapper);

        expect(mockSetActiveChatroom).toBeCalled();
        expect(mockSetActiveChatroom).toBeCalledWith(mockChatroom.roomId);
    });

    it('matches snapshot', () => {
        const run = true;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
