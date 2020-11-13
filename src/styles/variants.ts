const baseStyling = {};

const inputBase = {
    border: 'none',
    fontFamily: 'body',
    fontSize: [1],
    '&:focus': {
        outline: 'none',
    },
};

const messagesBase = {
    fontFamily: 'body',
    fontSize: [2],
    position: 'relative',
    p: [2],
    width: '100%',
    borderRadius: 10,
};

const chatroomBase = {
    color: 'white.1',
    p: [2],
    borderRadius: 16,
    cursor: 'pointer',
    transition: '0.2s',
    '&:hover': {
        bg: 'blue.dark.2',
    },
};

const userBase = {};

const messages = {
    received: {
        ...messagesBase,
        bg: 'white.2',
        color: 'black.1',
        borderBottomLeftRadius: 0,
        mr: [2],
    },
    sent: {
        ...messagesBase,
        bg: 'blue.dark.0',
        color: 'white.1',
        borderBottomRightRadius: 0,
        ml: [2],
        '&:hover .menu-arrow': {
            opacity: 1,
        },
        // styles for the menu..
        '.menu-enter': {
            opacity: 0,
            transform: 'translateX(20px)',
        },
        '.menu-enter-active': {
            opacity: 1,
            transform: 'translateX(0)',
            transition: '200ms',
        },
        '.menu-exit': {
            opacity: 1,
            transform: 'translateX(0)',
        },
        '.menu-exit-active': {
            opacity: 0,
            transform: 'translateX(20px)',
            transition: '200ms',
        },
        position: 'relative',
        zIndex: 2,
    },
    deleteMenu: {
        ...messagesBase,
        bg: 'blue.dark.4',
        color: 'misc.0',
        position: 'absolute',
        zIndex: 1,
        width: [150],
        // width: 'calc(100% + 1px)',
        // width: 'fit-content',
        top: 12,
        left: [-150],
        borderColor: 'misc.0',
        'svg.close': {
            cursor: 'pointer',
        },
    },
};

const inputs = {
    chatInput: {
        ...inputBase,
        '&::placeholder': {
            color: 'black.0',
        },
    },
    inputBox: {
        bg: 'blue.dark.0',
        p: 1,
        borderRadius: 4,
        display: 'flex',
        alignItems: 'center',
        '& > svg': {
            mx: 2,
            height: 16,
            width: 16,
            path: {
                color: 'white.1',
            },
            flexShrink: 0,
            '&.reset': {
                ml: 0,
                cursor: 'pointer',
            },
        },
        '& > input': {
            ...inputBase,
            fontSize: 1,
            fontWeight: 500,
            color: 'white.1',
            '&::placeholder': {
                color: 'white.1',
            },
        },
    },
};

const chatrooms = {
    chatroom: {
        ...chatroomBase,
        bg: 'blue.dark.1',
    },
    chatroomActive: {
        ...chatroomBase,
        bg: 'blue.dark.2',
    },
};

const users = {
    userBig: {
        ...userBase,
        img: {
            height: [80, 80, 100],
            width: [80, 80, 100],
        },
        '& .details': {
            py: [3],
            ml: [4],
        },
    },
    userSmall: {
        ...userBase,
        img: {
            height: 60,
            width: 60,
        },
        '& .details': {
            py: [2],
            ml: [4],
        },
    },
};

export default {
    ...inputs,
    ...messages,
    ...chatrooms,
    ...users,
};
