import React from 'react';
// import styling libs
// import local components
import { Chatroom as RoomSchema } from 'helper/schema';

type Props = RoomSchema & {
	/**
	 * Identifier to identify if this room is currently active at ChatWindow component
	 */
	isActive: boolean;
    /**
     * Boolean attr to identify if the message is a new notification
     */
	isNewNotification?: boolean;
	/**
	 * Function to set this room as active in ChatWindow component
	 */
    setActiveChatRoom: (roomId: string) => void;
};

const Chatroom: React.FC<Props> = ({ isNewNotification = false }) => {
    return <></>;
};

export { Chatroom };
