import { Message } from '../schema';
import { mockUser1 } from './user';

const mockMessage: Message = {
    msgId: '45725',
    msg: 'Hello, World',
    sentBy: mockUser1.uid,
    sentAt: new Date(Date.parse('2020-10-10')),
};

export { mockMessage };
