import React, { useState } from 'react';
import { without } from 'lodash';
// import styling libs
import { Box, Flex, Text } from 'rebass';
import { BsChevronDown, BsFillPersonPlusFill, BsPower } from 'react-icons/bs';
import { CSSTransition } from 'react-transition-group';
// import local components
import Chatroom from './chatroom';
import User from 'components/user';

import { db } from 'services/firebase';
import { Chatroom as RoomSchema, User as UserSchema } from 'helper/schema';
import { mockUser1 } from 'helper/mocks';
import { ChatPartnerDetails } from '../dashboard';
import { SearchInput } from 'components/inputs';

type Props = {
    /**
     * Function to set a specific chatroom active (show chatroom content in ChatWindow)
     */
    setActiveChatRoom: (roomId: string, args: ChatPartnerDetails) => void;
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

    // mocks.
    const loggedInUser = 'ABCD';
    const currentUser = {
        ...mockUser1,
        displayImage:
            'https://www.iconarchive.com/download/i107345/google/noto-emoji-animals-nature/22235-pig-face.ico',
    };

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
                            roomStatus: otherUserData.status,
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

    const search = (query: string) => {
        console.log(query);
    };

    // TODO: is Active
    const menuStyling = {
        fontFamily: 'heading',
        fontWeight: 'bold',
        fontSize: [1],
        color: 'black.0',
        px: [3],
        mt: 3,
        sx: {
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            transition: '0.2s',
            svg: {
                height: 24,
                width: 24,
                path: { fill: 'black.0' },
                mr: 3,
                transition: '0.2s',
            },
            '&:hover': {
                color: 'white.1',
                'svg path': { fill: 'white.1' },
            },
        },
    };

    return (
        <Box
            bg="blue.dark.1"
            width={['100vw', '100vw', '40%', '30%']}
            sx={{ flexGrow: 1 }}
        >
            <Box bg="blue.dark.0" py={[3]} px={[3]} sx={{}}>
                {/* logged-in user details. */}
                <Flex
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{
                        svg: {
                            height: 24,
                            width: 24,
                            transition: '0.2s',
                            transform: `rotate(${
                                isMenuOpen ? '180deg' : '0deg'
                            })`,
                            cursor: 'pointer',
                            path: { fill: 'blue.dark.3' },
                        },
                    }}
                >
                    <User {...currentUser} />
                    <BsChevronDown
                        data-testid="menu-toggle"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    />
                </Flex>
                {/* menu component. */}
                <CSSTransition
                    timeout={100}
                    in={isMenuOpen}
                    classNames="menu"
                    unmountOnExit={true}
                >
                    <Box
                        data-testid="menu"
                        mt={[2]}
                        sx={{
                            '&.menu-enter': {
                                opacity: 0,
                                height: 0,
                                transition: '200ms',
                                overflow: 'hidden',
                            },
                            '&.menu-enter-active': {
                                opacity: 1,
                                height: 'fit-conent',
                            },
                            '&.menu-exit': {
                                opacity: 1,
                                height: 'fit-conent',
                            },
                            '&.menu-exit-active': {
                                opacity: 0,
                                height: 0,
                                overflow: 'hidden',
                                transition: '200ms',
                            },
                        }}
                    >
                        <Text {...menuStyling} role="button">
                            <BsFillPersonPlusFill /> ADD NEW CHATROOM
                        </Text>
                        <Text {...menuStyling} role="button">
                            <BsPower /> SIGN OUT
                        </Text>
                    </Box>
                </CSSTransition>
            </Box>
            <Box px={[1]}>
                <Box p={[2]}>
                    <SearchInput search={search} />
                </Box>
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
        </Box>
    );
};

export { Sidepanel };
