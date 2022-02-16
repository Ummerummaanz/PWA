import * as React from 'react';
import { render } from '@testing-library/react';
import Help from '../src/components/Help';

describe('Help', () => {
  it('should load the help icon and have the redirect help url', async () => {
    const { getByTestId, getByAltText, findByTestId } = render(
      <Help url="https://testurl.com" name="test" helpRedirectUrl="https://redirecttesturl.com" />,
    );
    getByTestId('help__image');
    getByAltText('test');
    const link = await findByTestId('redirect__url');
    expect(link.getAttribute('href')).toEqual('https://redirecttesturl.com');
  });
});
