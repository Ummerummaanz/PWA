import * as React from 'react';
import { render } from '@testing-library/react';
import Avatar from '../src/components/Avatar';

describe('Feature', () => {
  it('should load the avatar', () => {
    const { getByTestId, getByAltText } = render(<Avatar url="https://testurl.com" name="test" />);
    getByTestId('avatar__image');
    getByAltText('test');
  });
});
