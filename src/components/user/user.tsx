import React from 'react';
// import styling libs
import { Flex, Box, Heading, Text, Image } from 'rebass';
// import local components

import { User as UserSchema, Status as StatusEnum } from 'helper/schema';
import { capitalize } from 'lodash';

type Props = UserSchema & {
    variant?: 'big' | 'small';
};

const User: React.FC<Props> = ({
    displayName,
    displayImage,
    status,
    variant = 'small',
}) => {
    return (
        <Flex variant={`user${capitalize(variant)}`}>
            <Image src={displayImage} />
            <Flex
                flexDirection="column"
                justifyContent="space-between"
                className="details"
            >
                <Heading
                    className="user-name"
                    data-testid="user-name"
                    fontSize={variant === 'small' ? [2] : [3, 3, 4]}
                    color={variant === 'small' ? 'white.0' : 'black.1'}
                >
                    {displayName}
                </Heading>
                <Status status={status} variant={variant} />
            </Flex>
        </Flex>
    );
};

const Status: React.FC<{ status: StatusEnum; variant: 'big' | 'small' }> = ({
    status,
    variant,
}) => (
    <Text
        className="status"
        data-testid="status"
        fontSize={variant === 'small' ? [1] : [1]}
        color="black.0"
        sx={{ display: 'flex', alignItems: 'center' }}
    >
        <Flex
            height={variant === 'small' ? [10] : [12]}
            width={variant === 'small' ? [10] : [12]}
            sx={{
                bg:
                    status === StatusEnum.ONLINE
                        ? 'misc.1'
                        : status === StatusEnum.BUSY
                        ? ''
                        : '',
                borderStyle: 'solid',
                borderColor: 'black.0',
                borderWidth: status === StatusEnum.OFFLINE ? 1 : 0,
                borderRadius: '50%',
                mr: [2],
            }}
        />
        {status}
    </Text>
);

export { User };
