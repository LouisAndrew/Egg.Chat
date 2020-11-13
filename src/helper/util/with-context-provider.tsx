import React from 'react';
import AuthContext from 'services/context';
import { mockUser1 } from 'helper/mocks';

/**
 * HOC to provide context for testing purposes.
 * @param el React element
 */
const withContextProvider = (el: any) => (
    <AuthContext.Provider
        value={{ user: mockUser1, signIn: () => {}, signOut: () => {} }}
    >
        {el}
    </AuthContext.Provider>
);

export default withContextProvider;
