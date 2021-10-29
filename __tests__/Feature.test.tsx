import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { getUserProfile } from 'oasis-feature-api';
import Feature from '../src/components/Feature';

const defaultAvatar = {
  fields: {
    title: 'avatar',
    file: {
      url: 'https://test/avatar',
    },
  },
};

const file = new File([''], 'avatar.png');
const apiAvatar = { hashCode: '1234', data: file };

jest.mock('oasis-os-contentful', () => ({
  useField: jest.fn((field: string) => {
    if (field === 'avatar') return defaultAvatar;
    if (field === 'greeting') return 'hello';
    return undefined;
  }),
}));

jest.mock('oasis-feature-api', () => ({
  getUserProfile: jest.fn(),
  getUserAvatar: jest.fn(() => {
    return Promise.resolve(apiAvatar);
  }),
}));

describe('Feature', () => {
  it.each([
    ['with Avatar', true],
    ['without Avatar', false],
  ])('should get welcome message %s', async (_, hasAvatarImage) => {
    (getUserProfile as jest.Mock).mockReturnValue(
      Promise.resolve({
        public: { firstName: 'test', hasAvatarImage },
      }),
    );
    const { container, getByTestId, getByAltText } = render(<Feature />);
    getByTestId('avatar__image');
    getByTestId('greeting_message');
    getByAltText('avatar');
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
