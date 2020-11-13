import React, { useState, useContext } from 'react';
import { without, differenceBy } from 'lodash';
// import styling libs
import { Box, Flex, Heading, Text } from 'rebass';
import {
    BsChevronDown,
    BsFillPersonPlusFill,
    BsPower,
    BsChevronLeft,
} from 'react-icons/bs';
import { CSSTransition } from 'react-transition-group';
// import local components
import Chatroom from './chatroom';
import User from 'components/user';

import { db } from 'services/firebase';
import { Chatroom as RoomSchema, User as UserSchema } from 'helper/schema';
import { ChatPartnerDetails } from '../dashboard';
import { AddChatroomInput, SearchInput } from 'components/inputs';
import AuthContext from 'services/context';

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

    const [searchQuery, setSearchQuery] = useState('');

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
    const { user: loggedInUser } = useContext(AuthContext);

    if (loggedInUser) {
        const userDbRef = db.collection('user');
        const chatroomDbRef = db.collection('chatroom');

        // initialize database ref.
        const dbRef = userDbRef.doc(loggedInUser.uid);

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
                                loggedInUser.uid
                            );

                            // get the needed img url and display name.
                            const otherUserData: UserSchema = await userDbRef
                                .doc(otherUser[0])
                                .get()
                                .then(
                                    (userDoc) => userDoc.data() as UserSchema
                                );

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
                JSON.stringify(chatromsUpdatedSorted) !==
                JSON.stringify(chatrooms)
            ) {
                setChatrooms(chatromsUpdatedSorted);
            }
        });

        /**
         * Function to search for a chatroom in contact list.
         * @param query search query
         */
        const search = (query: string) => {
            if (query !== searchQuery) {
                setSearchQuery(query);
            }
        };

        /**
         * Function to search available chatroom based on display name from database.
         * @param query search query.
         */
        const searchChatroomDb = async (query: string) => {
            try {
                const dbQuery = await userDbRef
                    .where('displayName', '==', query)
                    .get();
                const rsp = await dbQuery.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        ...data,
                        uid: doc.id,
                    } as UserSchema;
                });

                const availableChatrooms = loggedInUser.chatrooms.map(
                    (chatroom) => chatroom
                );

                // const searchedUsers = differenceBy(await rsp,  )

                // setUserResult(await rsp);
            } catch (err) {
                console.error(err);
            }
        };

        /**
         * Function to show search-chatroom input component
         */
        const addNewChatroom = () => {
            setIsMenuOpen(false);
            setIsSearchingUser(true);
        };

        /**
         * Function to go back from searching-chatroom-from-db state
         */
        const goBackSearchingUser = () => {
            setUserResult([]);
            setIsSearchingUser(false);
        };

        // TODO: is Active
        const menuStyling = {
            fontFamily: 'heading',
            fontWeight: 'bold',
            fontSize: [1],
            color: '#ddd',
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
                    path: { fill: '#ddd' },
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
                        <User {...loggedInUser} />
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
                            <Text
                                {...menuStyling}
                                role="button"
                                onClick={addNewChatroom}
                            >
                                <BsFillPersonPlusFill /> ADD NEW CHATROOM
                            </Text>
                            <Text {...menuStyling} role="button">
                                <BsPower /> SIGN OUT
                            </Text>
                        </Box>
                    </CSSTransition>
                </Box>
                <Box px={[1]}>
                    {!isSearchingUser ? (
                        <>
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
                            {chatrooms.length === 0 && (
                                <Text color="white.0" mt={[2]} ml={[2]}>
                                    No chatroom :(
                                </Text>
                            )}
                        </>
                    ) : (
                        <Box p={[3]}>
                            <Heading
                                color="white.1"
                                fontSize={[2]}
                                mb={[3]}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    svg: {
                                        height: 18,
                                        width: 18,
                                        mr: [2],
                                        cursor: 'pointer',
                                    },
                                }}
                            >
                                <BsChevronLeft onClick={goBackSearchingUser} />
                                ADD NEW CHATROOM
                            </Heading>
                            <AddChatroomInput search={searchChatroomDb} />
                        </Box>
                    )}
                </Box>
            </Box>
        );
    } else {
        return null;
    }
};

export { Sidepanel };
