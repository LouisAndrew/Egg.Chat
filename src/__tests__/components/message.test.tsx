import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import Message from 'components/message';

describe('Message', () => {
    const Element = <Message />;

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
    });

    it('Should render the message content correctly.', () => {});

    it('Should render the "INCOMING" variant of the component if the message is sent by logged in user.', () => {});

    it('Should render the "SENT" variant of the component if message is not sent by logged in user', () => {});

    it('Should not display menu-arrow when message is not sent by logged in user', () => {});

    it('Should display menu-arrow when the component is hovered if the message is sent by logged in user.', () => {});

    it('Should display menu to delete message when the menu-arrow is clicked.', () => {});

    it('Should calls the deleteMsg when the menu to delete message is clicked.', () => {});

    it('matches snapshot', () => {
        const run = false;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
