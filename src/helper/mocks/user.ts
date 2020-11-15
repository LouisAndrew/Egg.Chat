import { Status, User } from '../schema';

const CHATROOM_ID = '0972';

const mockUser1: User = {
    uid: '1234',
    displayImage: '',
    displayName: 'John Doe',
    status: Status.ONLINE,
    chatrooms: [CHATROOM_ID],
    lastOnline: new Date(16023160238),
};

const mockUser2: User = {
    uid: '5678',
    displayImage: '',
    displayName: 'Jane Doe',
    status: Status.OFFLINE,
    chatrooms: [CHATROOM_ID],
    lastOnline: new Date(1605460238),
};

export { mockUser2, mockUser1 };
