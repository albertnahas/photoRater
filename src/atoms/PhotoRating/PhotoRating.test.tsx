import React from 'react';
import { mount, shallow } from 'enzyme';
import PhotoRating from './PhotoRating';

describe('Photo rating widget', function () {
    it('renders without crashing', () => {
        shallow(<PhotoRating value={0} onRatingChange={() => {}} />);
    });
});
