import React from 'react';
import firebase from 'firebase';
// import styling libs
import { Box, Button, Heading, Text, Flex } from 'rebass';
import { BsPeopleFill } from 'react-icons/bs';
// import local components
import Logo from './assets/logo';
import GoogleLogo from './assets/google-logo';

import { auth } from 'services/firebase';

import './index.css';

/**
 * Auth component to enable login functionality
 */
const Auth: React.FC<unknown> = () => {
    // signs in user.

    // sign in with mock user

    // create new user on the database

    // save user to global store.

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
            <Button variant="googleButton">
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
                bg="blue.dark.0"
                sx={{ svg: { height: 18, width: 18, mr: [3], ml: 0 } }}
            >
                <BsPeopleFill />
                SIGN IN AS GUEST
            </Button>
        </Flex>
    );
};

export { Auth };
