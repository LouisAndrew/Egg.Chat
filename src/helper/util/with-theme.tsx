import React from 'react';

import { ThemeProvider } from 'emotion-theming';
import theme from 'styles/theme';

/**
 * Theme provider for testing.
 */
const withTheme: React.FC<{ children: any }> = ({ children }) => {
    return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default withTheme;
