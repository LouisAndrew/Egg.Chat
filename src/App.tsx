import React, { useContext } from 'react';

import { ThemeProvider } from 'emotion-theming';
import { Flex, Box } from 'rebass';

import theme from './styles/theme';
import AuthContext, { AuthProvider } from 'services/context';

import Dashboard from 'components/dashboard';
import Auth from 'components/auth';
import Background from 'background';

import './index.css';

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
                    <Flex
                        id="window"
                        bg="blue.dark.1"
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            height: ['100vh', '100vh', '100vh', 800],
                            width: ['100vw', '100vw', '100vw', 1200],
                            overflow: 'hidden',
                            position: 'relative',
                            borderRadius: 8,
                            '#background': {
                                position: 'absolute',
                                right: [0, 0, -16, -64],
                                bottom: [0, 0, -16, -64],
                                width: ['44%', '44%', '44%', '60%'],
                                height: 'auto',
                                display: ['none', 'none', 'block'],
                                zIndex: 2,
                            },
                        }}
                        css={`
                            @media screen and (min-width: 640px) and (orientation: portrait) {
                                & #background: {
                                    width: 60% !important;
                                }
                            }
                        `}
                    >
                        <Background id="background" />
                        {user ? <Dashboard /> : <Auth />}
                    </Flex>
                </Flex>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App;
