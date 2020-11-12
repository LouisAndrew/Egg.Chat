import React, { useState } from 'react';

import { User as UserSchema } from 'helper/schema';

type Context = {
    user?: UserSchema;
    lastOnline?: Date;
    signIn: (user: UserSchema) => void;
    signOut: () => void;
};

const AuthContext = React.createContext<Context>({
    user: undefined,
    lastOnline: undefined,
    signIn: () => {
        /** */
    },
    signOut: () => {
        /** */
    },
});

const AuthProvider: React.FC<{ children: any }> = ({ children }) => {
    const [user, setUser] = useState<UserSchema | undefined>(undefined);
    const [lastOnline, setLastOnline] = useState<Date | undefined>(undefined);

    const signIn = (user: UserSchema) => {
        setUser(user);
        setLastOnline(new Date());
    };

    const signOut = () => {
        setUser(undefined);
        setLastOnline(undefined);
    };

    return (
        <AuthContext.Provider value={{ user, lastOnline, signIn, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export { AuthProvider };
export default AuthContext;
