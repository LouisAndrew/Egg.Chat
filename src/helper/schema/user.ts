/**
 * User schema to model an actual user.
 *
 * uid: User ID
 * displayImage: url of the display image of this user (taken from google)
 * displayName: Display name of this user (also taken from google)
 * status: Status of this user (see Status enum).
 * chatrooms: Array of room Ids.
 */
interface User {
    uid: string;
    displayImage: string;
    displayName: string;
    status: Status;
    chatrooms: string[];
    lastOnline: Date;
}

/**
 * Enumeration to determine status of an user.
 */
enum Status {
    ONLINE = 'Online',
    OFFLINE = 'Offline',
    BUSY = 'Busy',
}

export { Status };
export type { User };
