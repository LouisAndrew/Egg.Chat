import React, { useState, useContext } from 'react';
import firebase from 'firebase';
// import styling libs
import { Box, Button, Heading, Text, Flex, Image } from 'rebass';
import { BsPeopleFill, BsExclamationDiamondFill } from 'react-icons/bs';
// import local components
import Logo from './assets/logo';
import GoogleLogo from './assets/google-logo';

import { auth, db } from 'services/firebase';
import { Status, User as UserSchema } from 'helper/schema';
import AuthContext from 'services/context';

import './index.css';

const alice = {
    name: 'Alice',
    uid: 'ABCD',
    imgUrl:
        'https://cdn.pixabay.com/photo/2016/03/31/19/58/avatar-1295429__340.png',
};
const bob = {
    name: 'Bob',
    uid: 'XYZA',
    imgUrl:
        'https://images.freeimages.com/images/large-previews/023/geek-avatar-1632962.jpg',
};
const charles = {
    name: 'Charlie',
    uid: 'EFGH',
    imgUrl:
        'https://images.freeimages.com/images/large-previews/d1f/lady-avatar-1632967.jpg',
};

/**
 * Auth component to enable login functionality
 */
const Auth: React.FC<unknown> = () => {
    const UNKNOWN_ERR = 'Oops! something went wrong. Please try again later';
    const LOG_IN_ERR = 'Trouble logging in, please try again';

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

    const [showMockUser, setShowockUser] = useState(false);

    const { signIn: dispatchSignIn } = useContext(AuthContext);

    const dbRef = db.collection('user');

    /**
     * Signs in the user with google auth provider
     */
    const signIn = async () => {
        const googleProvider = new firebase.auth.GoogleAuthProvider();

        await setIsLoading(true);
        try {
            const { user } = await auth.signInWithPopup(googleProvider);

            if ((await user) !== null) {
                const { uid, displayName, photoURL } = (await user) as any;

                if (
                    await dbRef
                        .doc(uid)
                        .get()
                        .then((doc) => doc.exists)
                ) {
                    saveUser(uid);
                } else {
                    createNewUser(displayName, photoURL, uid);
                }
            } else {
                setIsError(true);
                setErrMsg(UNKNOWN_ERR);
            }
        } catch (err) {
            setErrMsg(err.message ? err.message : UNKNOWN_ERR);
            setIsError(true);
        }
    };

    /**
     * signs in user with provided mock user (Bob, Alice, Charlie)
     * @param userId: Id of the mock user
     */
    const signInWithMockUser = async (userId: string) => {
        saveUser(userId);
    };

    /**
     * Create new user instance in the database and saving the user directly to global state
     *
     * @param displayName name of the user
     * @param displayImage img url of the user
     * @param uid user id -> important! to be used as id of the document.
     */
    const createNewUser = async (
        displayName: string,
        displayImage: string,
        uid: string
    ) => {
        const newUser: UserSchema = {
            displayName,
            displayImage,
            uid,
            status: Status.ONLINE,
            chatrooms: [],
            lastOnline: new Date(),
        };

        try {
            await dbRef.doc(uid).set({
                ...newUser,
                lastOnline: firebase.firestore.FieldValue.serverTimestamp(),
            });
            await dispatchSignIn(newUser);
        } catch (err) {
            setIsError(true);
            setErrMsg(LOG_IN_ERR);
        }

        await setIsLoading(false);
    };

    /**
     * Save user signed in to the global state
     * @param uid: id of the user to be saved.
     */
    const saveUser = async (uid: string) => {
        try {
            const userRef = dbRef.doc(uid);

            await userRef.update({ status: 'Online' });

            const data = await userRef.get().then((doc) => {
                const docData = doc.data() as any;
                return {
                    ...docData,
                    uid: doc.id,
                    lastOnline: docData.lastOnline.toDate(),
                };
            });

            if (await data) {
                dispatchSignIn((await data) as UserSchema);
            } else {
                setIsError(true);
                setErrMsg(LOG_IN_ERR);
            }
        } catch (err) {
            setIsError(true);
            setErrMsg(LOG_IN_ERR);
        }

        await setIsLoading(false);
    };

    const flexDirection: 'column' | 'row' = 'column';

    const mockUserStyling = {
        alignItems: 'center',
        flexDirection,
        width: '30%',
        bg: 'blue.dark.2',
        py: [3],
        color: 'white.0',
        sx: {
            borderRadius: 8,
            cursor: 'pointer',
            transition: '0.2s',
            '& img': {
                height: 60,
                width: 60,
                mb: [4],
                borderRadius: 8,
            },
            '&:hover': {
                transform: 'translateY(-10px)',
            },
        },
    };

    // TODO: handle some specific breakpoints..
    return (
        <Flex
            flexDirection="column"
            justifyContent="center"
            width={['100%', '100%', '50%', '40%']}
            height={['100%', '100%', '50%']}
            px={[4, 6, 4, 5]}
            py={[4]}
            my={['unset', 'unset', 'auto']}
            bg="blue.dark.3"
            sx={{
                borderRadius: [0, 0, 8],
                position: 'relative',
                left: [0, 0, -128, '-20%'],
                '#logo': {
                    width: [128],
                    height: 'auto',
                },
                button: {
                    width: '100%',
                },
            }}
            id="auth"
        >
            <Logo id="logo" />
            {!showMockUser ? (
                <>
                    <Heading my={[4]} color="white.1">
                        Login and start chatting now!
                    </Heading>
                    <Button onClick={signIn} variant="googleButton">
                        <GoogleLogo id="google-logo" /> SIGN IN WITH GOOGLE
                    </Button>
                    {/* or badge */}
                    <Flex
                        alignItems="center"
                        justifyContent="space-between"
                        width="100%"
                        px={[3]}
                        my={[4]}
                        className="separator"
                    >
                        <Box bg="white.1" width="35%" height={1} sx={{}} />
                        <Text
                            color="white.1"
                            fontFamily="heading"
                            fontSize={[1]}
                            fontWeight="bold"
                        >
                            OR
                        </Text>
                        <Box bg="white.1" width="35%" height={1} sx={{}} />
                    </Flex>
                    <Button
                        onClick={() => setShowockUser(true)}
                        bg="blue.dark.0"
                        sx={{ svg: { height: 18, width: 18, mr: [3], ml: 0 } }}
                    >
                        <BsPeopleFill />
                        SIGN IN AS GUEST
                    </Button>
                    {isError && (
                        <Flex
                            alignItems="center"
                            color="misc.0"
                            fontSize={[0]}
                            mt={[4]}
                            sx={{
                                svg: {
                                    height: 24,
                                    width: 24,
                                    mr: [3],
                                    path: { fill: 'misc.0' },
                                },
                            }}
                        >
                            <BsExclamationDiamondFill />
                            {errMsg}
                        </Flex>
                    )}
                </>
            ) : (
                <Box>
                    <Heading my={[4]} color="white.1">
                        Select user to use
                    </Heading>
                    <Flex justifyContent="space-between">
                        <Flex
                            {...mockUserStyling}
                            onClick={() => signInWithMockUser(alice.uid)}
                        >
                            <Image src={alice.imgUrl} />
                            <Text>{alice.name}</Text>
                        </Flex>
                        <Flex
                            {...mockUserStyling}
                            onClick={() => signInWithMockUser(bob.uid)}
                        >
                            <Image src={bob.imgUrl} />
                            <Text>{bob.name}</Text>
                        </Flex>
                        <Flex
                            {...mockUserStyling}
                            onClick={() => signInWithMockUser(charles.uid)}
                        >
                            <Image src={charles.imgUrl} />
                            <Text>{charles.name}</Text>
                        </Flex>
                    </Flex>
                </Box>
            )}
        </Flex>
    );
};

export { Auth };
