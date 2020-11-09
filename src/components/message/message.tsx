import React from 'react';
// import styling libs
// import local components
import { Message as MsgSchema } from 'helper/schema';

type Props = MsgSchema & {
    /**
     * ID of the user logged in on this session.
     */
    userId: string;
    /**
     * Status of the message.
     */
    status?: MsgStatus;
    deleteMsg: (msgId: string) => void;
};

export enum MsgStatus {
    /**
     * New msg from other user
     */
    NEW,
    /**
     * Message is being sent (in process)
     */
    SENDING,
    /**
     * Message is successfully sent
     */
    SENT,
    /**
     * Message is sent.
     */
    READ,
}

/**
 * Message component to show a message sent by user.
 */
const Message: React.FC<Props> = ({ sentAt, sentBy, userId, msg }) => {
    // TODO: Integrate functionality of displaying status of the message.

    // TODO:Integrate menu.

    // TODO: Integrate delete message.

    return <></>;
};

export { Message };
