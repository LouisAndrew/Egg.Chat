import React, { useState, useEffect } from 'react';
// import styling libs
import { Box } from 'rebass';
import { Input } from '@rebass/forms';
import { BsSearch, BsXCircleFill } from 'react-icons/bs';
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
    const [query, setQuery] = useState('');

    useEffect(() => {
        search(query);
    }, [query, search]);

    // calls search if event is not null.
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event) {
            setQuery(event.target.value);
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
            <Input
                placeholder="SEARCH NAME"
                onChange={handleChange}
                value={query}
            />
            {query && (
                <BsXCircleFill
                    data-testid="search-reset"
                    className="reset"
                    onClick={() => {
                        setQuery('');
                    }}
                />
            )}
        </Box>
    );
};

export { SearchInput };
