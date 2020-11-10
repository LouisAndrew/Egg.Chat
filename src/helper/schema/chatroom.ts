import { Message } from './message';

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
    /**
     * Img url of the room that should be displayed to the logged in user.
     */
    imgUrl?: string;
    /**
     * Name of the room that should be displayed to the logged in user.
     */
    roomName?: string;
}

export type { Chatroom };
