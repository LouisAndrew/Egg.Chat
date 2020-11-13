import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Chatroom from 'components/dashboard/sidepanel/chatroom';
import { mockChatroom, mockUser1, mockUser2 } from 'helper/mocks';
import { Chatroom as RoomSchema, User as UserSchema } from 'helper/schema';
import { getTime } from 'helper/util/get-time';
import theme from 'styles/theme';
import WithTheme from 'helper/util/with-theme';

const imgUrl = './src/img';

// extending default mock.
const mockUserDb: { [key: string]: UserSchema } = {
    '1234': { ...mockUser1, displayImage: imgUrl, chatrooms: ['0972', '8888'] },
    '5678': { ...mockUser2, chatrooms: ['0972', '8888'] },
};

const mockChatroomDb: { [key: string]: RoomSchema } = {
    '0972': mockChatroom,
    '8888': { ...mockChatroom, roomId: '8888', messages: [] },
};

describe('Chatroom', () => {
    const roomName = mockUser1.displayName;
    const roomStatus = mockUser1.status;

    const lastMsg = mockChatroom.messages[mockChatroom.messages.length - 1];

    // extending the chatroom mock to provide more details!
    const mockChatroomExtended = {
        roomId: '0972',
        chatPartnerId: '1234', // id of mockUser1. So every chatroom elements are going to be populated with mockUser1 as chatPartner
    };

    const mockChatroomEmpty = {
        roomId: '8888',
        chatPartnerId: '1234',
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
    beforeEach(() => {
        jest.mock('firebase', () => ({
            firestore: () => ({
                collection: (ref: string) => {
                    if (ref === 'user') {
                        return {
                            doc: (id: string) => ({
                                get: () =>
                                    new Promise((res) => {
                                        res({ data: () => mockUserDb[id] });
                                    }),
                            }),
                        };
                    } else if (ref === 'chatroom') {
                        return {
                            doc: (id: string) => ({
                                get: () =>
                                    new Promise((res) => {
                                        res({ data: () => mockChatroomDb[id] });
                                    }),
                            }),
                        };
                    } else {
                        return;
                    }
                },
            }),
        }));
    });

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
    });

    it('Should render the name of the room and its image correctly', () => {
        const { queryByText, queryByRole } = render(Element);

        setTimeout(() => {
            const roomNameEl = queryByText(roomName);
            const img = queryByRole('img');

            expect(roomNameEl).toBeInTheDocument();
            expect(img).toBeInTheDocument();
            expect((img as HTMLImageElement).src).toBe(
                imgUrl.replace('.', 'http://localhost')
            );
        }, 200);
    });

    it('Should render the last message in the room and when its sent', () => {
        const { queryByTestId } = render(Element);

        setTimeout(() => {
            // querying component by lastMsg's last send content
            const lastMsgEl = queryByTestId('last-msg');
            // querying component by lastMsg's last sent date
            const lastMsgDate = queryByTestId('last-msg-sent');

            expect(lastMsgEl).toBeInTheDocument();
            expect(lastMsgEl).toHaveTextContent(lastMsg.msg);

            expect(lastMsgDate).toBeInTheDocument();
            expect(lastMsgDate).toHaveTextContent(getTime(lastMsg.sentAt));
        }, 200);
    });

    it("Should not render last message and when its sent if the room's message is empty", () => {
        const { queryByTestId } = render(ElementEmpty);

        setTimeout(() => {
            // querying component by lastMsg's last send content
            const lastMsgEl = queryByTestId('last-msg');
            // querying component by lastMsg's last sent date
            const lastMsgDate = queryByTestId('last-msg-sent');

            expect(lastMsgEl).not.toBeInTheDocument();
            expect(lastMsgDate).not.toBeInTheDocument();
        }, 200);
    });

    it('Should not render the new notification badge if isNewNotification is not set', () => {
        const { queryByTestId } = render(Element);

        setTimeout(() => {
            const newNotifBadge = queryByTestId('new-notification-badge');

            expect(newNotifBadge).not.toBeInTheDocument();
        }, 200);
    });

    it('Should render the new notification badge if isNewNotification is set to true', () => {
        const { queryByTestId } = render(ElementNewNotif);

        setTimeout(() => {
            const newNotifBadge = queryByTestId('new-notification-badge');

            expect(newNotifBadge).toBeInTheDocument();
        }, 200);
    });

    it('Should not render the ACTIVE variant of the component if the room is currently active', () => {
        const { getByTestId } = render(Element);

        setTimeout(() => {
            const wrapper = getByTestId('wrapper');

            expect(wrapper).not.toHaveStyle(
                `background-color: ${theme.colors.blue.dark[2]}`
            );
        }, 200);
    });

    it('Should render the ACTIVE variant of the component if the room is currently active', () => {
        const { getByTestId } = render(ElementActive);

        setTimeout(() => {
            const wrapper = getByTestId('wrapper');

            expect(wrapper).toHaveStyle(
                `background-color: ${theme.colors.blue.dark[2]}`
            );
        }, 200);
    });

    it('Should call the setActiveChatRoom function if the compopnent is clicked', () => {
        const { getByTestId } = render(ElementActive);

        setTimeout(() => {
            const wrapper = getByTestId('wrapper');

            userEvent.click(wrapper);

            expect(mockSetActiveChatroom).toBeCalled();
            expect(mockSetActiveChatroom).toBeCalledWith(mockChatroom.roomId, {
                imgUrl,
                roomName,
                roomStatus,
            });
        }, 200);
    });

    it('matches snapshot', () => {
        const run = true;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
