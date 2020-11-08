import React, { useState } from 'react';
// import styling libs
import { Box, Button } from 'rebass';
import { Input } from '@rebass/forms';
import { BsFillPersonPlusFill, BsXCircleFill } from 'react-icons/bs';
// import local components

type Props = {
    /**
     * Function to be called when the form is submitted.
     * 💡 Function serves to search for user on the database
     */
    search: (query: string) => void;
};

/**
 * Component to search for a user(not added yet.)
 */
const AddChatroomInput: React.FC<Props> = ({ search }) => {
    const [query, setQuery] = useState('');

    const handleSubmit = (event: React.FormEvent<HTMLDivElement>) => {
        event.preventDefault();
        search(query);
    };

    return (
        <Box onSubmit={handleSubmit} as="form" variant="inputBox">
            <BsFillPersonPlusFill />
            <Input
                placeholder="SEARCH BY USERNAME/ID"
                onChange={(e) => setQuery(e.target.value)}
                value={query}
            />
            {query && (
                <BsXCircleFill
                    className="reset"
                    data-testid="addchatroom-reset"
                    onClick={() => {
                        setQuery('');
                    }}
                />
            )}
            <Button type="submit" variant="secondary">
                SEARCH
            </Button>
        </Box>
    );
};

export { AddChatroomInput };
