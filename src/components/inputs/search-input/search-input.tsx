import React from 'react';
// import styling libs
import { Box } from 'rebass';
import { Input } from '@rebass/forms';
import { BsSearch } from 'react-icons/bs';
// import local components

type Props = {
    /**
     * Function to be called eevrytime the value of input field changes
     * 💡 Function used to search for (added) chatroom
     */
    search: (name: string) => void;
};

/**
 * Search input component, rendered to search for a (already added) chatroom
 */
const SearchInput: React.FC<Props> = ({ search }) => {
    // calls search if event is not null.
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            search(event.target.value);
        }
    };

    return (
        <Box
            as="form"
            variant="inputBox"
            onSubmit={(e) => {
                e.preventDefault();
            }}
        >
            <BsSearch />
            <Input placeholder="SEARCH NAME" onChange={handleChange} />
        </Box>
    );
};

export { SearchInput };
