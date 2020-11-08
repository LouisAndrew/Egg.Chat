import React from 'react';
// import { ThemeProvider } from 'emotion-theming';
// import theme from '../src/styles/theme';

export const parameters = {
    actions: { argTypesRegex: '^on[A-Z].*' },
};

export const globalTypes = {
    theme: {
        name: 'Theme',
        description: 'Global theme for components',
        defaultValue: 'light',
        toolbar: theme,
    },
};

// const withThemeProvider = (Story, context) => {
//     const theme = getTheme(context.globals.theme);
//     return (
//         <ThemeProvider theme={theme}>
//             <Story {...context} />
//         </ThemeProvider>
//     );
// };

// export const decorators = [withThemeProvider];
