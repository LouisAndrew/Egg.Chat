/**
 * Message Schema to model a message posted by an user into chatroom(s)
 *
 * msgId: ID of this message
 * msg: Content of the message
 * sentBy: User ID that sent this message
 * sentAt: Date, when this message is sent (server time)
 */
interface Message {
    msgId: string;
    msg: string;
    sentBy: string;
    sentAt: Date;
}

export type { Message };
