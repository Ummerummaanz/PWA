import * as React from 'react';
import { render } from '@testing-library/react';
import Greeting from '../src/components/Greeting';

jest.mock('oasis-os-common', () => ({
  ...jest.requireActual('oasis-os-common'),
  Translate: jest.fn(({ id }) => {
    return "hello";
  }),
}));

jest.mock('oasis-os-react', () => ({
  ...jest.requireActual('oasis-os-react'),
  dispatch: jest.fn(),
  useAppState: jest.fn(() => {
    return [
      undefined,
      undefined,
      {
        meta: { contentId: 'foo' },
      },
    ];
  }),
}));

describe('Feature', () => {
  it('should have greeting message', () => {
    const { container, getByTestId } = render(<Greeting message="test" />);
    getByTestId('greeting_message');
    expect(container).toMatchSnapshot();
  });
});
