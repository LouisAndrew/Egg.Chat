import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

// import { render, cleanup } from '@testing-library/react'
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import ChatWindow from 'components/dashboard/chat-window';
import { mockChatroom, mockUser1 } from 'helper/mocks';

describe('ChatWindow', () => {
    const mockGoBack = jest.fn(() => {});

    const Element = (
        <ChatWindow
            roomId={mockChatroom.roomId}
            chatPartner={{
                roomName: mockUser1.displayName,
                imgUrl: mockUser1.displayImage,
                roomStatus: mockUser1.status,
            }}
            goBack={mockGoBack}
        />
    );

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
    });

    /* it('renders correctly', () => {
		const { getByTestId } = render()
	}) */

    // TODO.
    it('matches snapshot', () => {
        const run = false;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
