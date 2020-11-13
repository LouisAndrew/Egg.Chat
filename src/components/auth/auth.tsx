import React, { useState, useContext } from 'react';
import firebase from 'firebase';
// import styling libs
import { Box, Button, Heading, Text, Flex } from 'rebass';
import { BsPeopleFill, BsExclamationDiamondFill } from 'react-icons/bs';
// import local components
import Logo from './assets/logo';
import GoogleLogo from './assets/google-logo';

import { auth, db } from 'services/firebase';
import { Status, User as UserSchema } from 'helper/schema';
import AuthContext from 'services/context';

import './index.css';

/**
 * Auth component to enable login functionality
 */
const Auth: React.FC<unknown> = () => {
    const UNKNOWN_ERR = 'Oops! something went wrong. Please try again later';
    const LOG_IN_ERR = 'Trouble logging in, please try again';

    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errMsg, setErrMsg] = useState('');

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
     */
    const signInWithMockUser = async () => {
        //

        const ALICE_UID = 'ABCD';
        saveUser(ALICE_UID);
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
        };

        console.log('new user');

        try {
            await dbRef.doc(uid).set(newUser);
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
            const data = await dbRef
                .doc(uid)
                .get()
                .then((doc) => {
                    const docData = doc.data();
                    return { ...docData, uid: doc.id };
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
                onClick={signInWithMockUser}
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
        </Flex>
    );
};

export { Auth };
