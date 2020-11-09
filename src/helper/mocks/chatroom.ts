import { Chatroom } from 'helper/schema';
import { mockUser2, mockUser1 } from './user';
import { mockMessage } from './message';

const mockChatroom: Chatroom = {
    roomId: '0972',
    users: [mockUser1.uid, mockUser2.uid],
    messages: [mockMessage],
};

export { mockChatroom };
