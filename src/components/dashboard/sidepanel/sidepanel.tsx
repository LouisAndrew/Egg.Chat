import React, { useState } from 'react';
import { without } from 'lodash';
// import styling libs
import { Box } from 'rebass';
// import local components
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

    const userDbRef = db.collection('user');
    const chatroomDbRef = db.collection('chatroom');

    // initialize database ref.
    const dbRef = userDbRef.doc(loggedInUser);
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

                        // get the needed img url.
                        const imgUrl = await userDbRef
                            .doc(otherUser[0])
                            .get()
                            .then(
                                (userDoc) =>
                                    (userDoc.data() as any).displayImage
                            );

                        // TODO: handle if in a chatroom there are multiple users!
                        return {
                            ...chatroomDocData,
                            imgUrl,
                        };
                    })
            )
        );

        // update data
        if (JSON.stringify(chatroomsUpdated) !== JSON.stringify(chatrooms)) {
            setChatrooms(chatroomsUpdated);
        }
    });

    return <></>;
};

export { Sidepanel };
