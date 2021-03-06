import { Message } from './message';
import { Status } from './user';

/**
 * Chatroom schema to model a chatroom
 *
 * roomId: ID of the chatroom
 * users: Array of user ID(s). -> could be more than one -> group chat?
 * messages: Array of messages posted in this room.
 */
interface Chatroom {
    roomId: string;
    users: string[];
    messages: Message[];
}

export type { Chatroom };
