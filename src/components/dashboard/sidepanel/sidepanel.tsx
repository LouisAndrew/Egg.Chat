import React, { useState, useContext, useEffect } from 'react';
import { without, differenceBy } from 'lodash';
import firebase from 'firebase';
// import styling libs
import { Box, Flex, Heading, Text } from 'rebass';
import {
    BsChevronDown,
    BsFillPersonPlusFill,
    BsPower,
    BsChevronLeft,
    BsChatQuoteFill,
} from 'react-icons/bs';
import { CSSTransition } from 'react-transition-group';
// import local components
import Chatroom from './chatroom';
import User from 'components/user';

import { db } from 'services/firebase';
import { Chatroom as RoomSchema, User as UserSchema } from 'helper/schema';
import { AddChatroomInput, SearchInput } from 'components/inputs';
import AuthContext from 'services/context';

type Props = {
    /**
     * roomId of the currently active chatroom.
     */
    activeChatroom: string;
    /**
     * Function to set a specific chatroom active (show chatroom content in ChatWindow)
     */
    setActiveChatRoom: (roomId: string, user: UserSchema) => void;
};

/**
 * Component that wraps the chatrooms, user, menu and search user components!
 * Connection with database should be made here..
 */
const Sidepanel: React.FC<Props> = ({ activeChatroom, setActiveChatRoom }) => {
    // active chatrooms for this user
    const [chatrooms, setChatrooms] = useState<
        { roomId: string; chatPartnerId: string }[]
    >([]);

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

    const { user: loggedInUser } = useContext(AuthContext);

    const userDbRef = db.collection('user');
    const chatroomDbRef = db.collection('chatroom');

    // initialize database ref.
    useEffect(() => {
        // kinda repetitive, but useEffect cannot be called conditionally.
        if (loggedInUser) {
            const unsubscribe = userDbRef
                .doc(loggedInUser.uid)
                .onSnapshot(async (snapshot) => {
                    const { chatrooms: chatroomIds } = snapshot.data() as any;

                    // get details of chatroom(s) from firestore db
                    const chatroomDatasDb: RoomSchema[] = await Promise.all(
                        chatroomIds.map((id: string) =>
                            chatroomDbRef
                                .doc(id)
                                .get()
                                .then((doc) => {
                                    const data = doc.data() as any;

                                    return {
                                        ...data,
                                        roomId: doc.id,
                                        messages: data.messages.map(
                                            (msg: any) => ({
                                                ...msg,
                                                sentAt: msg.sentAt.toDate(),
                                            })
                                        ),
                                    };
                                })
                        )
                    );

                    // sort the room and then mapping to its corresponding type.
                    const chatroomDatas = await sortRooms(chatroomDatasDb).map(
                        (room) => {
                            const chatPartnerId = without(
                                room.users,
                                loggedInUser.uid
                            )[0];

                            const { roomId } = room;

                            return {
                                roomId,
                                chatPartnerId,
                            };
                        }
                    );

                    setChatrooms(chatroomDatas);
                });

            return () => unsubscribe();
        }
    }, []);

    if (loggedInUser) {
        const dbRef = userDbRef.doc(loggedInUser.uid);

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

                const alreadyChatting = chatrooms.map((chatroom) => ({
                    uid: chatroom.chatPartnerId,
                }));

                console.log({ alreadyChatting });

                const searchedUsers = differenceBy(
                    await rsp,
                    alreadyChatting,
                    'uid'
                );

                setUserResult(searchedUsers);
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

        /**
         * Start a chatroom with a new user
         * @param uid ID of the user to start chatting with
         */
        const startChatting = async (uid: string) => {
            try {
                // room id is the combination of both users' id
                const roomId = uid.slice(0, 4) + loggedInUser.uid.slice(0, 4);

                const otherUserDbRef = userDbRef.doc(uid);

                // create room instance in db
                await chatroomDbRef.doc(roomId).set({
                    users: [uid, loggedInUser.uid],
                    messages: [],
                });

                // update chatrooms on loggedin user
                await dbRef.update({
                    chatrooms: firebase.firestore.FieldValue.arrayUnion(roomId),
                });
                // update chatrooms on target user
                await otherUserDbRef.update({
                    chatrooms: firebase.firestore.FieldValue.arrayUnion(roomId),
                });

                await setIsSearchingUser(false);
                await setUserResult([]);
                await setActiveChatRoom(
                    roomId,
                    await otherUserDbRef.get().then((doc) => {
                        const docData = doc.data();
                        return {
                            ...docData,
                            uid: doc.id,
                        } as UserSchema;
                    })
                );
            } catch (err) {
                console.error(err);
            }
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
            <Flex
                bg="blue.dark.1"
                flexDirection="column"
                width={[
                    'calc(var(--vw, 1vw) * 100)',
                    'calc(var(--vw, 1vw) * 100)',
                    '40%',
                    '30%',
                ]}
                sx={{ flexGrow: 1, flexShrink: 0 }}
                id="sidepanel"
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
                <Flex px={[1]} pb={[1]} flexDirection="column" height="100%">
                    {!isSearchingUser ? (
                        <>
                            <Box p={[2]}>
                                <SearchInput search={search} />
                            </Box>
                            <Box
                                className="custom-scrollbar"
                                height="100%"
                                sx={{ overflowY: 'scroll' }}
                            >
                                {chatrooms.map((room) => (
                                    <Chatroom
                                        {...room}
                                        setActiveChatRoom={setActiveChatRoom}
                                        isActive={
                                            room.roomId === activeChatroom
                                        }
                                        key={`${room.roomId}-sidepanel`}
                                        data-testid={room.roomId}
                                    />
                                ))}
                                {chatrooms.length === 0 && (
                                    <Text color="white.0" mt={[2]} ml={[2]}>
                                        No chatroom :(
                                    </Text>
                                )}
                            </Box>
                        </>
                    ) : (
                        <Flex flexDirection="column" p={[3]} height="100%">
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

                            <Box
                                className="custom-scrollbar"
                                py={[2]}
                                height="100%"
                                sx={{ overflowY: 'scroll' }}
                            >
                                {userResult.map((user) => (
                                    <Flex
                                        alignItems="center"
                                        justifyContent="space-between"
                                        key={`${user.uid}-search-result`}
                                        mt={[3]}
                                        sx={{
                                            svg: {
                                                height: 24,
                                                width: 24,
                                                cursor: 'pointer',
                                                path: { fill: 'white.0' },
                                            },
                                        }}
                                    >
                                        <User {...user} variant="small" />
                                        <BsChatQuoteFill
                                            onClick={() =>
                                                startChatting(user.uid)
                                            }
                                        />
                                    </Flex>
                                ))}
                            </Box>
                        </Flex>
                    )}
                </Flex>
            </Flex>
        );
    } else {
        return null;
    }
};

export { Sidepanel };
