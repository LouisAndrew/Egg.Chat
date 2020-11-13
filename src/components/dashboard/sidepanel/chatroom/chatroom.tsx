import React, { useState, useEffect } from 'react';
// import styling libs
import { Box, Heading, Text, Flex, Image } from 'rebass';
// import local components

import {
    Chatroom as RoomSchema,
    User as UserSchema,
    Message as MsgSchema,
} from 'helper/schema';
import { getTime } from 'helper/util/get-time';
import { db } from 'services/firebase';

type Props = {
    /**
     * Room id -> Document id on firestore inside chatroom collection
     */
    roomId: string;
    /**
     * Chat partner's id -> id of user that is ALSO in this chatroom but is not the logged in user.
     */
    chatPartnerId: string;
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
    setActiveChatRoom: (roomId: string, user: UserSchema) => void;
};

const Chatroom: React.FC<Props> = ({
    roomId,
    chatPartnerId,
    isActive,
    isNewNotification = false,
    setActiveChatRoom,
    ...rest
}) => {
    // chat partner state.
    const [chatPartner, setChatPartner] = useState<UserSchema | undefined>(
        undefined
    );

    const [lastMsg, setLastMsg] = useState<MsgSchema | undefined>(undefined);

    // Database ref of this room
    const roomDbRef = db.collection('chatroom').doc(roomId);
    // Database ref of the chat partner of this room
    const partnerDbRef = db.collection('user').doc(chatPartnerId);

    /**
     * Fetch data of chat partner of this room
     */
    const fetchChatPartner = async () => {
        const userData: UserSchema = await partnerDbRef.get().then((doc) => {
            const data = doc.data();
            return {
                ...data,
                uid: doc.id,
            } as UserSchema;
        });

        await setChatPartner(userData);
    };

    useEffect(() => {
        fetchChatPartner();

        // listen to realtime update of this room
        const unsubscribe = roomDbRef.onSnapshot((snapshot) => {
            const messages: MsgSchema[] = (snapshot.data() as RoomSchema)
                .messages;

            if (messages.length === 0) {
                setLastMsg(undefined);
                return;
            }

            const lastMsgDb = messages[messages.length - 1];
            setLastMsg({
                ...lastMsgDb,
                sentAt: (lastMsgDb.sentAt as any).toDate(),
            });
        });

        // cleanup work.
        return () => unsubscribe();
    }, []);

    // const isMsgEmpty = messages.length === 0;

    if (chatPartner) {
        const {
            displayImage,
            displayName,
            uid,
            status,
            chatrooms,
        } = chatPartner;

        /**
         * Function to be called when chatroom comopnent is clicked
         */
        const handleClick = () => {
            setActiveChatRoom(roomId, {
                displayImage,
                displayName,
                status,
                uid,
                chatrooms,
            });
        };

        return (
            <Flex
                data-testid={rest['data-testid']}
                variant={isActive ? 'chatroomActive' : 'chatroom'}
                onClick={handleClick}
            >
                <Image
                    src={displayImage}
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
                        {displayName}
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
                    <Text variant="msgPreview" mt="auto" data-testid="last-msg">
                        {lastMsg?.msg}
                    </Text>
                </Flex>
                {lastMsg && (
                    <Text
                        data-testid="last-msg-sent"
                        variant="timestamp"
                        color="black.0"
                        sx={{ mr: 3 }}
                    >
                        {getTime(lastMsg.sentAt)}
                    </Text>
                )}
            </Flex>
        );
    } else {
        return null;
    }
};

export { Chatroom };
