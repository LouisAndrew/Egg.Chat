import React from 'react';
import ReactDOM from 'react-dom';
import renderer from 'react-test-renderer';

import { render, cleanup } from '@testing-library/react';
// import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

import User from 'components/user';
import { mockUser1 } from 'helper/mocks';
import WithTheme from 'helper/util/with-theme';

describe('User', () => {
    const mockUserExtended = {
        ...mockUser1,
        displayImage: 'http://localhost/src',
    };

    const Element = (
        <WithTheme>
            <User {...mockUserExtended} />
        </WithTheme>
    );

    afterEach(cleanup);

    it('renders without crashing', () => {
        const div = document.createElement('div');
        ReactDOM.render(Element, div);
    });

    it('Should render the user name, image and status correctly', () => {
        const { getByTestId, getByRole } = render(Element);

        const name = getByTestId('user-name');
        const img = getByRole('img');
        const status = getByTestId('status');

        expect(name).toHaveTextContent(mockUser1.displayName);
        expect((img as HTMLImageElement).src).toBe(
            mockUserExtended.displayImage
        );
        expect(status).toHaveTextContent(mockUser1.status);
    });

    // it('Should render the component in its SMALL variant if variant props is not given.', () => {
    //     const { getByRole } = render(Element);

    //     const img = getByRole('img');

    //     expect(img).toHaveStyle('height: 85px;');
    // });

    // it('Should render the comoponent in its BIG variant if variant props is given as big', () => {
    //     const { getByRole } = render(Element);

    //     const img = getByRole('img');

    //     expect(img).toHaveStyle('height: 100px;');
    // });

    it('matches snapshot', () => {
        const run = true;

        if (run) {
            const tree = renderer.create(Element).toJSON();
            expect(tree).toMatchSnapshot();
        }
    });
});
