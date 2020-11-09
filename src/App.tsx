import React from 'react';

import { ThemeProvider } from 'emotion-theming';
import { Button } from 'rebass';
import { BsPencilSquare } from 'react-icons/bs';

import theme from './styles/theme';
import logo from './logo.svg';
import { ChatInput, SearchInput, AddChatroomInput } from 'components/inputs';
import { mockMessage, mockUser1, mockUser2 } from 'helper/mocks';
import Message from 'components/message';

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
                        Click me! <BsPencilSquare />
                    </Button>
                    Secondary with logo:{' '}
                    <Button variant="secondary">
                        Click me! <BsPencilSquare />
                    </Button>
                </div>
                <div>
                    Inputs=
                    <br />
                    chat input:{' '}
                    <ChatInput
                        sendMsg={(msg: string) => {
                            console.log(msg);
                        }}
                    />
                    Search input:
                    <SearchInput
                        search={(name: string) => {
                            console.log(name);
                        }}
                    />
                    Add chatroom input:
                    <AddChatroomInput
                        search={(query: string) => {
                            console.log(query);
                        }}
                    />
                </div>

                <div>
                    Msgs:
                    <br />
                    sent:{' '}
                    <Message
                        {...mockMessage}
                        userId={mockUser1.uid}
                        deleteMsg={(msgId: string) => {
                            console.log(msgId);
                        }}
                    />
                    Received: sent:{' '}
                    <Message
                        {...mockMessage}
                        userId={mockUser2.uid}
                        deleteMsg={(msgId: string) => {
                            console.log(msgId);
                        }}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
};

export default App;
