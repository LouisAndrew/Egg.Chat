import buttons from './buttons';
import text from './texts';
import variants from './variants';

const theme = {
    breakpoints: ['40em', '52em', '64em'],
    fontSizes: [12, 14, 16, 20, 24, 32, 48, 64],
    colors: {
        blue: {
            //       third,    blue-shade, blue-darker, blue-even-darker
            dark: ['#545E75', '#4B556C', '#3A4765', '#2F3A54'],
            //      primary
            light: '#CEEDFF',
        },
        //       black-shade, text-color
        black: ['#A5A5A5', '#333333'],
        //       secondary,  bg
        white: ['#F3F3F3', '#F7F7FF'],
        //      banner-new, banner-online
        misc: ['#FF8590', '#ABFFB3'],
    },
    space: [0, 4, 8, 16, 32, 64, 128, 256],
    fonts: {
        body: "'Open Sans', sans-serif",
        heading: "'Raleway', sans-serif",
        monospace: 'Menlo, monospace',
    },
    fontWeights: {
        body: 400,
        heading: 700,
        bold: 700,
    },
    lineHeights: {
        body: 1.5,
        heading: 1.25,
    },
    shadows: {
        small: '0 0 4px rgba(0, 0, 0, .125)',
        large: '0 0 24px rgba(0, 0, 0, .125)',
    },
    variants,
    text,
    buttons,
};

export default theme;
