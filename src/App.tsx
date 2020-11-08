import React from 'react';

import { ThemeProvider } from 'emotion-theming';
import { Button } from 'rebass';
import { InlineIcon } from '@iconify/react';
import pencilSquare from '@iconify-icons/bi/pencil-square';

import theme from './styles/theme';
import logo from './logo.svg';

const App: React.FC<any> = () => {
    return (
        <ThemeProvider theme={theme}>
            <div className="App">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo" />
                    <p>
                        Edit <code>src/App.tsx</code> and save to reload.
                    </p>
                    <a
                        className="App-link"
                        href="https://reactjs.org"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn React
                    </a>
                </header>
                <div>
                    Button=
                    <br />
                    Primary: <Button>Click me</Button>
                    Secondary: <Button variant="secondary">Click me</Button>
                    Primary with logo:{' '}
                    <Button>
                        Click me! <InlineIcon icon={pencilSquare} />
                    </Button>
                    Secondary with logo:{' '}
                    <Button variant="secondary">
                        Click me! <InlineIcon icon={pencilSquare} />
                    </Button>
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
