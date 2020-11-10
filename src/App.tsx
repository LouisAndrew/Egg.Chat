import React from 'react';

import { ThemeProvider } from 'emotion-theming';

import theme from './styles/theme';
import ChatWindow from 'components/dashboard/chat-window';
import Sidepanel from 'components/dashboard/sidepanel';

import { db } from 'services/firebase';

const App: React.FC<any> = () => {
    console.log(db);

    return (
        <ThemeProvider theme={theme}>
            <ChatWindow roomId="EFGH" />
            <Sidepanel
                setActiveChatRoom={(roomId: string) => {
                    console.log(roomId);
                }}
            />
        </ThemeProvider>
    );
};

export default App;
