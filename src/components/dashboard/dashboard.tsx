import React, { useState, useEffect, useContext } from 'react';
// import styling libs
import { Flex, Box } from 'rebass';
import ChatWindow from './chat-window';
import Sidepanel from './sidepanel';

// custom styling for taller mobile devices on dashboard, sidepanel and chat window.
import './index.css';

import { User as UserSchema } from 'helper/schema';

const Dashboard: React.FC<unknown> = () => {
    // used in mobile devices. 💡 To set the transform property of dashboard'wrapper component.
    const focusSidepanel = 'translateX(0)';
    const focusChatWindow = 'translateX(calc(var(--vw, 1vw) * -100))';

    // focusing sidepanel when component first renders.
    const [useTransform, setUseTransform] = useState(focusSidepanel);

    const [active, setActive] = useState<string | undefined>(undefined);
    const [chatPartner, setChatPartner] = useState<UserSchema | undefined>(
        undefined
    );

    // helper state to determine if userAgent is a mobile (specific styling should be applied on mobile landscape.)
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        checkIsMobile();
        window.addEventListener('resize', checkIsMobile);

        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
    }, []);

    useEffect(() => {
        if (isMobile) {
            setTransformMobile(active !== undefined);
        }
    }, [active]);

    /**
     * Function to check if the user agent device is a mobile device.
     */
    const checkIsMobile = () => {
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;

        // first check orientation
        const portrait = windowHeight > windowWidth;

        if (portrait) {
            // check the browser width..
            if (windowWidth < 640) {
                setIsMobile(true);
                return;
            }
        } else {
            if (windowWidth < 832 && windowHeight < 640) {
                setIsMobile(true);
                return;
            }
        }

        setIsMobile(false);
    };

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
    const setActiveChatRoom = (roomId: string, user: UserSchema) => {
        setActive(roomId);
        setChatPartner(user);
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
            width={[
                'calc(var(--vw, 1vw) * 200)',
                'calc(var(--vw, 1vw) * 200)',
                '100%',
            ]}
            sx={{
                transform: isMobile ? useTransform : 'unset',
                transition: '0.2s',
                position: 'relative',
                zIndex: 3,
            }}
            id="dashboard"
        >
            <Sidepanel
                activeChatroom={active || ''}
                setActiveChatRoom={setActiveChatRoom}
            />
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
