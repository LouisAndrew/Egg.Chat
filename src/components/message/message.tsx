import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
// import styling libs
import { Box, Text, Flex } from 'rebass';
import { BsChevronLeft, BsFillTrashFill, BsXCircleFill } from 'react-icons/bs';
// import local components
import { Message as MsgSchema } from 'helper/schema';
import { getTime } from 'helper/util/get-time';

type Props = MsgSchema & {
    /**
     * ID of the user logged in on this session.
     */
    userId: string;
    /**
     * Status of the message.
     */
    status?: MsgStatus;
    deleteMsg: (msgId: string) => void;
};

export enum MsgStatus {
    /**
     * New msg from other user
     */
    NEW,
    /**
     * Message is being sent (in process)
     */
    SENDING,
    /**
     * Message is successfully sent
     */
    SENT,
    /**
     * Message is sent.
     */
    READ,
}

/**
 * Message component to show a message sent by user.
 */
const Message: React.FC<Props> = ({
    sentAt,
    sentBy,
    userId,
    msg,
    msgId,
    deleteMsg,
}) => {
    const [showMenu, setShowMenu] = useState(false);

    const isMsgSent = sentBy === userId;

    return (
        <Flex
            flexDirection={isMsgSent ? 'row' : 'row-reverse'}
            my={[2]}
            width="fit-content"
            alignSelf={isMsgSent ? 'flex-end' : 'flex-start'}
        >
            {/* render date! */}
            <Text variant="timestamp">{getTime(sentAt)}</Text>
            <Box
                data-testid="wrapper"
                variant={isMsgSent ? 'sent' : 'received'}
                width="fit-content"
                sx={{ transition: '0.2s', borderWidth: showMenu ? 0 : 1 }}
            >
                <Text width="fit-content">{msg}</Text>
                {isMsgSent && (
                    <Box
                        data-testid="menu-arrow"
                        className="menu-arrow"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            right: 8,
                            height: '100%',
                            cursor: 'pointer',
                            opacity: 0,
                            transition: '0.2s',
                            '&:hover': {
                                right: 16,
                            },
                            svg: {
                                height: '100%',
                            },
                        }}
                        onClick={() => setShowMenu(true)}
                    >
                        <BsChevronLeft />
                    </Box>
                )}

                {/* enable menu to be shown if the msg is sent by logged in user */}
                {isMsgSent && (
                    <CSSTransition
                        in={showMenu}
                        timeout={200}
                        classNames="menu"
                        unmountOnExit={true}
                    >
                        <Flex alignItems="center" variant="deleteMenu">
                            <Flex
                                data-testid="menu-delete"
                                onClick={() => {
                                    deleteMsg(msgId);
                                }}
                                alignItems="center"
                                width="100%"
                                sx={{ cursor: 'pointer', svg: { mr: 3 } }}
                            >
                                <BsFillTrashFill />
                                Delete Message
                            </Flex>
                            <BsXCircleFill
                                className="close"
                                onClick={() => setShowMenu(false)}
                            />
                        </Flex>
                    </CSSTransition>
                )}
            </Box>
        </Flex>
    );
};

export { Message };
