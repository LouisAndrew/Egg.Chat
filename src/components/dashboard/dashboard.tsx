import React from 'react';
// import styling libs
import { Flex } from 'rebass';
import ChatWindow from './chat-window';
import Sidepanel from './sidepanel';
// import local components
import { mockUser2 } from 'helper/mocks';

// type Props = {};

const Dashboard: React.FC<unknown> = () => {
    // TODO: setActiveChatRoom -> also get its chatPartner Datas,

    const chatPartner = {
        ...mockUser2,
        displayImage:
            'https://avatarfiles.alphacoders.com/246/thumb-246353.jpg',
    };

    return (
        <Flex height="100%" width="100%">
            <Sidepanel
                setActiveChatRoom={(roomId: string) => {
                    console.log(roomId);
                }}
            />
            <ChatWindow roomId="EFGH" chatPartner={chatPartner} />
        </Flex>
    );
};

export { Dashboard };
