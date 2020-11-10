import React, { useState } from 'react';
// import firebase from 'firebase';
// import styling libs
import { Box } from 'rebass';
// import local components
import Message from 'components/message';

import { db } from 'services/firebase';
import { Message as MsgSchema } from 'helper/schema';

const ChatWindow: React.FC<unknown> = () => {
    const [msgs, setMsgs] = useState<MsgSchema[]>([]);

    const dbRef = db.collection('chatroom').doc('EFGH');

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

    return (
        <Box>
            <Box>Messages</Box>
            <Box>
                {msgs.map((msg) => (
                    <Message
                        key={msg.msgId}
                        {...msg}
                        userId="ABCD"
                        deleteMsg={(msgId: string) => {
                            console.log(msgId);
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export { ChatWindow };
