import React, { useContext } from 'react';

import { ThemeProvider } from 'emotion-theming';
import { Flex, Box } from 'rebass';

import theme from './styles/theme';
import AuthContext, { AuthProvider } from 'services/context';

import Dashboard from 'components/dashboard';
import Auth from 'components/auth';

const App: React.FC<any> = () => {
    const { user } = useContext(AuthContext);

    return (
        <ThemeProvider theme={theme}>
            <AuthProvider>
                <Flex
                    alignItems="center"
                    justifyContent="center"
                    id="wrapper"
                    sx={{
                        height: '100vh',
                        width: '100vw',
                        overflowX: 'hidden',
                    }}
                    bg="blue.dark.2"
                >
                    <Box
                        id="window"
                        sx={{
                            height: ['100vh', '100vh', '100vh', 800],
                            width: ['100vw', '100vw', '100vw', 1200],
                            // border: '1px solid black',
                        }}
                    >
                        {user ? <Dashboard /> : <Auth />}
                    </Box>
                </Flex>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
