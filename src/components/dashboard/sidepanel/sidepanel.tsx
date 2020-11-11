import React, { useState } from 'react';
import { without } from 'lodash';
// import styling libs
import { Box } from 'rebass';
// import local components
import Chatroom from './chatroom';

import { db } from 'services/firebase';
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
const Sidepanel: React.FC<Props> = ({ setActiveChatRoom }) => {
    // active chatrooms for this user
    const [chatrooms, setChatrooms] = useState<RoomSchema[]>([]);

    // identifies if the menu should be opened
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // identifies if the search-user component should be displayed.
    const [isSearchingUser, setIsSearchingUser] = useState(false);

    // results of the search-user operation.
    const [userResult, setUserResult] = useState<UserSchema[]>([]);

    /**
     * Function to sort the given rooms descending. Sorted by the date of last sent message.
     * If a room has no message in it, the room would be placed at the beginning of the list.
     *
     * @param rooms rooms to be sorted.
     */
    const sortRooms = (rooms: RoomSchema[]) =>
        [...rooms].sort((a, b) => {
            // handle if a / b does not have any message in it.
            if (a.messages.length === 0) {
                return -1;
            } else if (b.messages.length === 0) {
                return 1;
            } else {
                return (
                    // compare date / timestamp of the last sent message
                    b.messages[b.messages.length - 1].sentAt.getTime() -
                    a.messages[a.messages.length - 1].sentAt.getTime()
                );
            }
        });

    const loggedInUser = 'ABCD';

    const userDbRef = db.collection('user');
    const chatroomDbRef = db.collection('chatroom');

    // initialize database ref.
    const dbRef = userDbRef.doc(loggedInUser);

    // fetchRooms function
    // listening to realtime data update.
    dbRef.onSnapshot(async (doc) => {
        // chatroom should be an array of roomIDs.
        const { chatrooms: chatroomData } = doc.data() as any;

        // for each chatrooms -> fetch data from chatroom collection
        const chatroomsUpdated: RoomSchema[] = await Promise.all(
            chatroomData.map((roomId: string) =>
                chatroomDbRef
                    .doc(roomId)
                    .get()
                    // get data from the chatroom collection
                    .then(async (chatroomDoc) => {
                        const chatroomDocData = chatroomDoc.data() as any;
                        const otherUser = without(
                            chatroomDocData.users,
                            loggedInUser
                        );

                        // get the needed img url and display name.
                        const otherUserData: UserSchema = await userDbRef
                            .doc(otherUser[0])
                            .get()
                            .then((userDoc) => userDoc.data() as UserSchema);

                        // TODO: handle if in a chatroom there are multiple users!
                        return {
                            ...chatroomDocData,
                            messages: chatroomDocData.messages.map(
                                (msg: any) => ({
                                    ...msg,
                                    sentAt: msg.sentAt.toDate(),
                                })
                            ),
                            imgUrl: otherUserData.displayImage,
                            roomName: otherUserData.displayName,
                            roomId: chatroomDoc.id,
                        };
                    })
            )
        );

        // calls sort rooms here!
        const chatromsUpdatedSorted = sortRooms(chatroomsUpdated);

        // update data
        if (
            JSON.stringify(chatromsUpdatedSorted) !== JSON.stringify(chatrooms)
        ) {
            setChatrooms(chatromsUpdatedSorted);
        }
    });

    // TODO: is Active

    return (
        <Box>
            {chatrooms.map((room) => (
                <Chatroom
                    {...room}
                    setActiveChatRoom={setActiveChatRoom}
                    isActive={false}
                    key={`${room.roomId}-sidepanel`}
                    data-testid={room.roomId}
                />
            ))}
        </Box>
    );
};

export { Sidepanel };
