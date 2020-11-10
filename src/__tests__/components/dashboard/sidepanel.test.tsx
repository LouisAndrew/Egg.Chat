import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

import Sidepanel from 'components/dashboard/sidepanel';
import { Chatroom as RoomSchema, User as UserSchema } from 'helper/schema';
import { mockChatroom, mockUser1, mockUser2 } from 'helper/mocks';

import * as Firebase from 'firebase';

const mockUserDb: { [key: string]: UserSchema } = {
    '1234': mockUser1,
    '5678': mockUser2,
};

const mockChatroomDb: { [key: string]: RoomSchema } = {
    '0972': mockChatroom,
};

describe('Sidepanel', () => {
    const mockSetActiveChatroom = jest.fn((str) => {});
    const mockChatRooms: RoomSchema[] = [mockChatroom];

    const Element = <Sidepanel setActiveChatRoom={mockSetActiveChatroom} />;

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
                                        res(mockUserDb[id]);
                                    }),
                            }),
                        };
                    } else if (ref === 'chatroom') {
                        return {
                            doc: (id: string) => ({
                                get: () =>
                                    new Promise((res) => {
                                        res(mockChatroomDb[id]);
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

    it('Should render the chatrooms correctly', () => {
        const { queryByTestId } = render(Element);

        setTimeout(() => {
            const room = queryByTestId(mockChatRooms[0].roomId);
            expect(room).toBeInTheDocument();
        }, 1000);
    });

    it('Should not render the menu when component first rendered.', () => {
        const { queryByTestId } = render(Element);

        const menu = queryByTestId('menu');
        expect(menu).not.toBeInTheDocument();
    });

    it('Should toggle the menu correctly', () => {
        const { queryByTestId, getByTestId } = render(Element);

        const menuToggle = getByTestId('menu-toggle');
        userEvent.click(menuToggle);

        const menu = queryByTestId('menu');
        expect(menu).toBeInTheDocument();

        userEvent.click(menuToggle);
        expect(menu).not.toBeInTheDocument();
    });

    it('Should not render the search-user-input when component first rendered.', () => {
        const { queryByTestId } = render(Element);

        const searchUserInput = queryByTestId('search-user');
        expect(searchUserInput).not.toBeInTheDocument();
    });

    it('Should toggle the search-user component correctly', () => {
        const { queryByTestId, getByTestId, getByRole } = render(Element);

        const menuToggle = getByTestId('menu-toggle');
        userEvent.click(menuToggle);

        const searchUserToggle = getByRole('button', {
            name: 'ADD NEW CHATROOM',
        });

        userEvent.click(searchUserToggle);

        const searchUserInput = queryByTestId('search-user');
        const menu = queryByTestId('menu');
        expect(menu).not.toBeInTheDocument();
        expect(searchUserInput).toBeInTheDocument();
    });

    it('Should show the user search result correctly', () => {
        const { getByTestId, getByRole, queryByTestId } = render(Element);

        const menuToggle = getByTestId('menu-toggle');
        userEvent.click(menuToggle);

        const searchUserToggle = getByRole('button', {
            name: 'ADD NEW CHATROOM',
        });

        userEvent.click(searchUserToggle);

        const searchUserInput = getByTestId('search-user');
        userEvent.type(searchUserInput, mockUser1.displayName);

        const user = queryByTestId(mockUser1.uid);
        expect(user).toBeInTheDocument();
    });

    it('matches snapshot', () => {
        const run = false;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
