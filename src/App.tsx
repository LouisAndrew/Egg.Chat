import React from 'react';

import { ThemeProvider } from 'emotion-theming';
import { Flex, Box } from 'rebass';

import theme from './styles/theme';

import { db } from 'services/firebase';
import Dashboard from 'components/dashboard';

const App: React.FC<any> = () => {
    console.log(db);

    return (
        <ThemeProvider theme={theme}>
            <Flex
                alignItems="center"
                justifyContent="center"
                id="wrapper"
                sx={{ height: '100vh', width: '100vw' }}
            >
                <Box
                    id="window"
                    sx={{
                        height: [800],
                        width: [800],
                        border: '1px solid black',
                    }}
                >
                    <Dashboard />
                </Box>
            </Flex>
        </ThemeProvider>
    );
};

export default App;
