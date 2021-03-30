import * as React from 'react';
import { render } from '@testing-library/react';
import Feature from '../src/components/Feature';

describe('Feature', () => {
  it('should match snapshot', () => {
    const { container } = render(<Feature />);
    expect(container).toMatchSnapshot();
  });
});
