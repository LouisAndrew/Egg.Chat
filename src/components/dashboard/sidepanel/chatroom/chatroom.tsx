import React from 'react';
// import styling libs
import { Box, Heading, Text, Flex, Image } from 'rebass';
// import local components

import { ChatPartnerDetails } from '../../dashboard';
import { Chatroom as RoomSchema } from 'helper/schema';
import { getTime } from 'helper/util/get-time';

type Props = RoomSchema & {
    /**
     * Identifier to identify if this room is currently active at ChatWindow component
     */
    isActive: boolean;
    /**
     * Boolean attr to identify if the message is a new notification
     */
    isNewNotification?: boolean;
    /**
     * Test-id for testing purposes.
     */
    'data-testid': string;
    /**
     * Function to set this room as active in ChatWindow component
     */
    setActiveChatRoom: (roomId: string, args: ChatPartnerDetails) => void;
};

const Chatroom: React.FC<Props> = ({
    roomId,
    roomName,
    messages,
    imgUrl,
    isActive,
    roomStatus,
    isNewNotification = false,
    setActiveChatRoom,
    ...rest
}) => {
    const isMsgEmpty = messages.length === 0;

    /**
     * Function to be called when chatroom comopnent is clicked
     */
    const handleClick = () => {
        if (roomStatus && roomName && imgUrl) {
            setActiveChatRoom(roomId, { roomStatus, roomName, imgUrl });
        }
    };

    return (
        <Flex
            data-testid={rest['data-testid']}
            variant={isActive ? 'chatroomActive' : 'chatroom'}
            onClick={handleClick}
        >
            <Image
                src={imgUrl}
                sx={{ borderRadius: 16, flexGrow: 1 }}
                height={[60]}
                width={[60]}
                minWidth={[60]}
            />
            <Flex
                flexDirection="column"
                justifyContent="space-between"
                height={[60]}
                py={[2]}
                mx={[4]}
                width="100%"
            >
                <Heading
                    variant="userName"
                    sx={{
                        position: 'relative',
                        display: 'inline',
                        width: 'fit-content',
                    }}
                >
                    {roomName}
                    {isNewNotification && (
                        <Box
                            data-testid="new-notification-badge"
                            bg="misc.0"
                            sx={{
                                height: 8,
                                width: 8,
                                position: 'absolute',
                                top: 0,
                                right: -3,
                                borderRadius: '50%',
                            }}
                        />
                    )}
                </Heading>
                {!isMsgEmpty && (
                    <Text variant="msgPreview" mt="auto" data-testid="last-msg">
                        {messages[messages.length - 1].msg}
                    </Text>
                )}
            </Flex>
            {!isMsgEmpty && (
                <Text
                    data-testid="last-msg-sent"
                    variant="timestamp"
                    color="black.0"
                    sx={{ mr: 3 }}
                >
                    {getTime(messages[messages.length - 1].sentAt)}
                </Text>
            )}
        </Flex>
    );
};

export { Chatroom };
