// use just as reference.
// Error message: Jest mock must be an inline function

import { Chatroom, User } from '../schema';
import { mockUser1, mockUser2, mockChatroom } from '.';

const mockUserDb: { [key: string]: User } = {
    '1234': mockUser1,
    '5678': mockUser2,
};

const mockChatroomDb: { [key: string]: Chatroom } = {
    '0972': mockChatroom,
};

export const mockFirebase = () => ({
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
    auth: () => ({}),
});
