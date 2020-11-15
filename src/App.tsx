import React, { useContext, useEffect } from 'react';

import { ThemeProvider } from 'emotion-theming';
import { Flex } from 'rebass';

import theme from './styles/theme';
import AuthContext from 'services/context';

import Dashboard from 'components/dashboard';
import Auth from 'components/auth';
import Background from 'background';

import './index.css';

const App: React.FC<any> = () => {
    const { user } = useContext(AuthContext);
    const isLoggedIn = user !== undefined;

    const calculateViewport = () => {
        const height = window.innerHeight * 0.01;
        const width = window.innerWidth * 0.01;
        document.documentElement.style.setProperty('--vh', `${height}px`);
        document.documentElement.style.setProperty('--vw', `${width}px`);
    };

    useEffect(() => {
        calculateViewport();

        window.addEventListener('resize', calculateViewport);

        return () => {
            window.removeEventListener('resize', calculateViewport);
        };
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <Flex
                alignItems="center"
                justifyContent="center"
                id="wrapper"
                sx={{
                    height: 'calc(var(--vh, 1vh) * 100)',
                    maxHeight: 'calc(var(--vh, 1vh) * 100)',
                    width: 'calc(var(--vw, 1vw) * 100)',
                    overflow: 'hidden',
                }}
                bg="blue.dark.2"
            >
                <Flex
                    id="window"
                    bg="blue.dark.2"
                    alignItems="center"
                    justifyContent="center"
                    sx={{
                        height: ['100%', '100%', '100%', 800],
                        width: ['100%', '100%', '100%', 1200],
                        overflow: 'hidden',
                        position: 'relative',
                        borderRadius: [0, 0, 0, 8],
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
                    {isLoggedIn ? <Dashboard /> : <Auth />}
                </Flex>
            </Flex>
        </ThemeProvider>
    );
};

export default App;
