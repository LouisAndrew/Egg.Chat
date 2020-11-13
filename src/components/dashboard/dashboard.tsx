import React, { useState, useEffect, useContext } from 'react';
// import styling libs
import { Flex, Box } from 'rebass';
import ChatWindow from './chat-window';
import Sidepanel from './sidepanel';
// import local components

import AuthContext from 'services/context';

import {
    // User as UserSchema,
    // Chatroom as RoomSchema,
    Status,
} from 'helper/schema';
import { mockUser1 } from 'helper/mocks';

// type Props = {};
// taken from schema/chatroom.ts
export type ChatPartnerDetails = {
    /**
     * Img url of the room that should be displayed to the logged in user.
     */
    imgUrl: string;
    /**
     * Name of the room that should be displayed to the logged in user.
     */
    roomName: string;
    /**
     * Status of the other user. used to set room as active at sidepanel
     */
    roomStatus: Status;
};

const Dashboard: React.FC<unknown> = () => {
    // used in mobile devices. 💡 To set the transform property of dashboard'wrapper component.
    const focusSidepanel = 'translateX(0)';
    const focusChatWindow = 'translateX(-100vw)';

    // focusing sidepanel when component first renders.
    const [useTransform, setUseTransform] = useState(focusSidepanel);

    const [active, setActive] = useState<string | undefined>(undefined);
    const [chatPartner, setChatPartner] = useState<
        ChatPartnerDetails | undefined
    >(undefined);

    const { user: loggedInUser, signIn } = useContext(AuthContext);

    useEffect(() => {
        const windowWidth = window.innerWidth;
        // check if window is below the breakpoint of tablet
        if (windowWidth < 832) {
            setTransformMobile(active !== undefined);
        }
    }, [active]);

    /**
     * Function to set the transform property of wrapper on mobile devices
     * @param applyTransform
     */
    const setTransformMobile = (applyTransform: boolean) => {
        setUseTransform(applyTransform ? focusChatWindow : focusSidepanel);
    };

    /**
     * Set the active chatroom according to its parameter.
     * @param roomId active room ID
     */
    const setActiveChatRoom = (roomId: string, args: ChatPartnerDetails) => {
        setActive(roomId);
        setChatPartner(args);
    };

    /**
     * Set active chatroom to undefined (do not display chat window!)
     */
    const goBack = () => {
        setActive(undefined);
        setChatPartner(undefined);
    };

    return (
        <Flex
            height="100%"
            width={['200vw', '200vw', '100%']}
            sx={{
                transform: [useTransform, useTransform, 'unset'],
                transition: '0.2s',
                position: 'relative',
                zIndex: 3,
            }}
        >
            <Sidepanel setActiveChatRoom={setActiveChatRoom} />
            {active && chatPartner ? (
                <ChatWindow
                    roomId={active}
                    chatPartner={chatPartner}
                    goBack={goBack}
                />
            ) : (
                <Box width={['100vw', '100vw', '70%']} />
            )}
        </Flex>
    );
};

export { Dashboard };
