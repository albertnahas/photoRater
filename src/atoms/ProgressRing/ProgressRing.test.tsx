import React from 'react';
import { shallow } from 'enzyme';
import { ProgressRing } from './ProgressRing';

describe('Progress Ring widget', function () {
    it('renders without crashing', () => {
        shallow(<ProgressRing value={0} />);
    });
});
