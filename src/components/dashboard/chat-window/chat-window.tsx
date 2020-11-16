/* eslint-disable */

import React, { useState, useContext, useRef, useEffect } from 'react';
import firebase from 'firebase';
// import styling libs
import { Flex } from 'rebass';
import { BsChevronLeft } from 'react-icons/bs';
// import local components
import Message from 'components/message';
import { ChatInput } from 'components/inputs';

import { db } from 'services/firebase';
import { Message as MsgSchema, User as UserSchema } from 'helper/schema';
import User from 'components/user';
import AuthContext from 'services/context';
import { findIndex } from 'lodash';

type Props = {
    /**
     * Unique identifier of the room
     */
    roomId: string;
    /**
     * The user that also in this chatroom, but different than the logged-in user.
     */
    chatPartner: UserSchema;
    /**
     * Function to set the current active chatroom to null.
     */
    goBack: () => void;
};

const ChatWindow: React.FC<Props> = ({ roomId, chatPartner, goBack }) => {
    const [msgs, setMsgs] = useState<MsgSchema[]>([]);
    const { user: loggedInUser } = useContext(AuthContext);

    const bottom = useRef<HTMLInputElement>(null);

    /**
     * Function to scroll to the end of the msg list with smooth behavior
     */
    const scrollToBottom = () => {
        if (msgs) {
            const chatMsgs = document.getElementById('chat-messages');
            if (chatMsgs) {
                chatMsgs.scrollTop = chatMsgs.scrollHeight;
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            scrollToBottom();
        }, 200);
    }, []);

    if (loggedInUser) {
        // initialize database ref.
        const dbRef = db.collection('chatroom').doc(roomId);

        // listening to realtime data update.
        dbRef.onSnapshot((doc) => {
            const data = doc.data();
            const { messages } = data as any;

            // assigning messages data from firestore to MsgSchema and sort it based on its sentAt property
            const msgUpdated = [
                ...messages.map((o: any) => ({
                    ...o,
                    sentAt: o.sentAt.toDate(),
                })),
            ].sort((a, b) => a.sentAt.getTime() - b.sentAt.getTime());

            // if the stringified version of msgUpdated and the msgs state is not the same, update the msfs state
            if (JSON.stringify(msgUpdated) !== JSON.stringify(msgs)) {
                setMsgs(msgUpdated);
            }
        });

        /**
         * Function to create msgId. MsgId must be in every chatroom unique.
         * msgId -> roomID + nums of msg sent.
         */
        const createMsgId = () => {
            if (msgs.length === 0) {
                return `${roomId}0`;
            }

            // get last sent msgID
            const lastSentId = msgs[msgs.length - 1].msgId;

            // get last sent Number by splitting roomId from the string.
            const lastSentNum = lastSentId.split(roomId)[1];

            return `${roomId}${parseInt(lastSentNum, 10) + 1}`;
        };

        /**
         * function to send a message everyrime user submits the form on ChatInput component
         * @param msg mesasge content
         */
        const sendMsg = async (msg: string) => {
            try {
                const msgId = `${createMsgId()}${new Date().getTime()}`;

                // create Msg object
                // TODO: handle error when msg is not sent.
                await dbRef.update({
                    messages: firebase.firestore.FieldValue.arrayUnion({
                        msg,
                        msgId,
                        sentBy: loggedInUser.uid,
                        // creating firestore-compatible date type. -> FieldValue.serverTimestamp() can't be called here
                        sentAt: firebase.firestore.Timestamp.fromDate(
                            new Date()
                        ),
                    }),
                });

                await scrollToBottom();
            } catch (e) {
                console.error(e);
            }
        };

        /**
         * Function to delete a message from the database
         * @param msgId id of the to be deleted message
         */
        const deleteMsg = async (msgId: string) => {
            const toDeleteIndex = findIndex(msgs, (o) => o.msgId === msgId);
            if (toDeleteIndex === -1) {
                return;
            }

            try {
                dbRef.update({
                    messages: firebase.firestore.FieldValue.arrayRemove(
                        msgs[toDeleteIndex]
                    ),
                });
            } catch (err) {
                console.error(err);
            }
        };

        return (
            <Flex
                height="100%"
                width={[
                    'calc(var(--vw, 1vw) * 100)',
                    'calc(var(--vw, 1vw) * 100)',
                    '60%',
                    '70%',
                ]}
                flexDirection="column"
                py={[3]}
                px={[2]}
                bg="white.1"
                flexGrow={1}
                flexShrink={0}
                id="chat-window"
            >
                <Flex
                    alignItems="center"
                    sx={{
                        svg: {
                            height: [16],
                            width: [16],
                            mr: [3],
                            cursor: 'pointer',
                        },
                    }}
                >
                    <BsChevronLeft
                        role="button"
                        aria-label="go back"
                        onClick={goBack}
                    />
                    <User {...chatPartner} variant="big" />
                </Flex>
                <Flex
                    height="100%"
                    my={[3]}
                    flexDirection="column"
                    className="custom-scrollbar"
                    id="chat-messages"
                    px={[3]}
                    sx={{
                        overflowY: 'scroll',
                        overflowX: 'hidden',
                        scrollBehavior: 'smooth',
                    }}
                >
                    {msgs.map((msg) => (
                        <Message
                            key={msg.msgId}
                            {...msg}
                            userId={loggedInUser.uid}
                            deleteMsg={deleteMsg}
                        />
                    ))}
                    <Flex
                        ref={bottom}
                        sx={{ transform: 'translateY(-50vh)' }}
                    />
                </Flex>

                <ChatInput sendMsg={sendMsg} />
            </Flex>
        );
    } else {
        return null;
    }
};

export { ChatWindow };
