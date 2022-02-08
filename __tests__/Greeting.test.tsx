import * as React from 'react';
import { render } from '@testing-library/react';
import Greeting from '../src/components/Greeting';

describe('Feature', () => {
  it('should have greeting message', () => {
    const { container, getByTestId } = render(<Greeting message="test" />);
    getByTestId('greeting_message');
    expect(container).toMatchSnapshot();
  });
});
