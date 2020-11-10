import React, { useState } from 'react';
// import styling libs
// import local components

import { Chatroom as RoomSchema, User as UserSchema } from 'helper/schema';

type Props = {
    /**
     * Function to set a specific chatroom active (show chatroom content in ChatWindow)
     */
    setActiveChatRoom: (roomId: string) => void;
};

/**
 * Component that wraps the chatrooms, user, menu and search user components!
 * Connection with database should be made here..
 */
const Sidepanel: React.FC<Props> = () => {
    // active chatrooms for this user
    const [chatrooms, setChatrooms] = useState<RoomSchema[]>([]);

    // identifies if the menu should be opened
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // identifies if the search-user component should be displayed.
    const [isSearchingUser, setIsSearchingUser] = useState(false);

    // results of the search-user operation.
    const [userResult, setUserResult] = useState<UserSchema[]>([]);

    const loggedInUser = 'ABCD';
    return <></>;
};

export { Sidepanel };
