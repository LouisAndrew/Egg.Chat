import React, { useState } from 'react';
// import styling libs
import { Button, Box } from 'rebass';
import { Input } from '@rebass/forms';
import { BsPencilSquare } from 'react-icons/bs';
// import local components

type Props = {
    /**
     * Function to be called when the form is submitted.
     */
    sendMsg: (msg: string) => void;
};

/**
 * Input component on ChatWindow Component
 * Usage: Enables user to input a msg (text msg)
 */
const ChatInput: React.FC<Props> = ({ sendMsg }) => {
    const [text, setText] = useState<string>('');

    const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
        if (text !== null) {
            event.preventDefault();
            sendMsg(text);
            setText('');
        }
    };

    return (
        <Box
            as="form"
            onSubmit={handleSubmit}
            bg="#fff"
            sx={{
                display: 'flex',
                borderWidth: 1,
                borderStyle: 'solid',
                borderColor: 'black.0',
                borderRadius: 8,
                p: 1,
            }}
        >
            <Input
                placeholder="Type Here"
                value={text}
                onChange={(e) => setText(e.target.value)}
                variant="variants.chatInput"
            />
            <Button type="submit">
                SEND <BsPencilSquare />
            </Button>
        </Box>
    );
};

export { ChatInput };
