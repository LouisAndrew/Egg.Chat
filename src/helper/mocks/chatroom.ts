import { Chatroom } from 'helper/schema';
import { mockUser2, mockUser1 } from './user';
import { mockMessage } from './message';

const CHATROOM_ID = '0972';

const mockChatroom: Chatroom = {
    roomId: CHATROOM_ID,
    users: [mockUser1.uid, mockUser2.uid],
    messages: [mockMessage],
};

export { mockChatroom, CHATROOM_ID };
