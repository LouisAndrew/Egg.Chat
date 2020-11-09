import { Message } from '../schema';
import { mockUser1 } from './user';

const mockMessage: Message = {
    msgId: '45725',
    msg: 'Hello, World',
    sentBy: mockUser1.uid,
    sentAt: new Date(Date.parse('10 Oct 2020 00:12:00 GMT')),
};

export { mockMessage };
