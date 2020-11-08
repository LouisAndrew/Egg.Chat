const baseStyling = {};

const inputBase = {
    border: 'none',
    fontFamily: 'body',
    fontSize: [1],
    '&:focus': {
        outline: 'none',
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

export default {
    ...inputs,
};
