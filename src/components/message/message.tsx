import React, { useState } from 'react';
import { CSSTransition } from 'react-transition-group';
// import styling libs
import { Box, Text, Flex } from 'rebass';
import {
    BsChevronLeft,
    BsFillTrashFill,
    BsXCircleFill,
    BsThreeDots,
    BsX,
} from 'react-icons/bs';
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
            sx={{ position: 'relative' }}
            flexShrink={0}
        >
            {/* render date! */}
            <Text variant="timestamp">{getTime(sentAt)}</Text>
            <Box
                data-testid="wrapper"
                variant={isMsgSent ? 'sent' : 'received'}
                width="fit-content"
                sx={{ transition: '0.2s', borderWidth: showMenu ? 0 : 1 }}
                pr={isMsgSent ? 2 : ''}
                pl={isMsgSent ? '' : 2}
            >
                <Text width="fit-content">{msg}</Text>

                {isMsgSent && (
                    <Flex
                        data-testid="menu-arrow"
                        className="menu-arrow"
                        bg="blue.dark.2"
                        height={24}
                        width={24}
                        alignItems="center"
                        justifyContent="center"
                        sx={{
                            position: 'absolute',
                            left: -3,
                            top: -8,
                            borderRadius: '50%',
                            svg: { path: { fill: 'white.0' } },
                            cursor: 'pointer',
                            opacity: 0,
                            transition: '0.2s',
                        }}
                        onClick={() => setShowMenu(!showMenu)}
                    >
                        {showMenu ? <BsX /> : <BsThreeDots />}
                    </Flex>
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
                                fontSize={[0]}
                                sx={{
                                    cursor: 'pointer',
                                    svg: { mr: 3, flexShrink: 0 },
                                }}
                            >
                                <BsFillTrashFill />
                                Delete Message
                            </Flex>
                        </Flex>
                    </CSSTransition>
                )}
            </Box>
        </Flex>
    );
};

export { Message };
