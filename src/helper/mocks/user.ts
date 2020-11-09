import { Status, User } from '../schema';
import { mockChatroom } from './chatroom';

const mockUser1: User = {
    uid: '1234',
    displayImage: '',
    displayName: 'John Doe',
    status: Status.ONLINE,
    chatrooms: [mockChatroom.roomId],
};

const mockUser2: User = {
    uid: '5678',
    displayImage: '',
    displayName: 'Jane Doe',
    status: Status.OFFLINE,
    chatrooms: [mockChatroom.roomId],
};

export { mockUser2, mockUser1 };
