const baseStyling = {
    fontFamily: 'body',
    cursor: 'pointer',
    fontSize: [1],
    // flex: logo styling!
    display: 'flex',
    alignItems: 'center',
};

const svgStyling = {
    height: 14,
    width: 14,
    minHeight: 14,
    minWidth: 14,
    ml: 2,
};

export default {
    primary: {
        ...baseStyling,
        bg: 'blue.dark.0',
        color: 'white.1',
        '& svg': {
            ...svgStyling,
            path: {
                fill: 'white.1',
            },
        },
    },
    secondary: {
        ...baseStyling,
        bg: 'blue.dark.2',
        color: 'white.0',
        svg: {
            ...svgStyling,
            path: {
                fill: 'white.0',
            },
        },
    },
    googleButton: {
        ...baseStyling,
        bg: '#fff',
        color: 'rgba(51, 51, 51, 0.8)',
        svg: {
            height: 18,
            width: 18,
            mr: [3],
        },
    },
};
