import React, { useState } from 'react';
import firebase from 'firebase';
// import styling libs
import { Box, Flex } from 'rebass';
// import local components
import Message from 'components/message';
import { ChatInput } from 'components/inputs';

import { db } from 'services/firebase';
import { Message as MsgSchema, User as UserSchema } from 'helper/schema';
import User from 'components/user';

type Props = {
    roomId: string;
    chatPartner: UserSchema;
};

const ChatWindow: React.FC<Props> = ({ roomId, chatPartner }) => {
    const [msgs, setMsgs] = useState<MsgSchema[]>([]);
    const loggedInUser = 'ABCD';

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
            // create Msg object
            // TODO: handle error when msg is not sent.
            const newMsg = await dbRef.update({
                messages: firebase.firestore.FieldValue.arrayUnion({
                    msg,
                    msgId: createMsgId(),
                    sentBy: loggedInUser,
                    // creating firestore-compatible date type. -> FieldValue.serverTimestamp() can't be called here
                    sentAt: firebase.firestore.Timestamp.fromDate(new Date()),
                }),
            });
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <Flex height="100%" width="100%" flexDirection="column" p={[2]}>
            <User {...chatPartner} variant="big" />
            <Box height="100%" my={[2]}>
                {msgs.map((msg) => (
                    <Message
                        key={msg.msgId}
                        {...msg}
                        userId={loggedInUser}
                        deleteMsg={(msgId: string) => {
                            console.log(msgId);
                        }}
                    />
                ))}
            </Box>

            <ChatInput sendMsg={sendMsg} />
        </Flex>
    );
};

export { ChatWindow };
