const baseStyling = {};

const inputs = {
    chatInput: {
        border: 'none',
        fontFamily: 'body',
        fontSize: [1],
        '&::placeholder': {
            color: 'black.0',
        },
        '&:focus': {
            outline: 'none',
        },
    },
};

export default {
    ...inputs,
};
