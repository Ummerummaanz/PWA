import * as React from 'react';
import { render, waitFor } from '@testing-library/react';
import { getUserProfile } from 'oasis-feature-api';
import Feature from '../src/components/Feature';

const defaultAvatar = {
  fields: {
    name: 'avatar',
    icon: {
      fields: {
        file: {
          url: 'https://test/avatar',
        },
      },
    },
  },
};

const file = new File([''], 'avatar.png');
const avatar = { hashCode: '1234', data: file };

jest.mock('oasis-os-contentful', () => ({
  useField: jest.fn((field: string) => {
    if (field === 'avatar') return defaultAvatar;
    if (field === 'greeting') return 'hello';
    if (field === 'helpIcon') return defaultAvatar;
    return undefined;
  }),
}));

jest.mock('oasis-feature-api', () => ({
  getUserProfile: jest.fn(),
  getUserAvatar: jest.fn(() => {
    return Promise.resolve(avatar);
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
    const avatarMock = jest.spyOn(React, 'useState').mockReturnValueOnce([avatar, () => jest.fn()]);
    const { container, getByTestId, findByTestId } = render(<Feature />);
    getByTestId('avatar__image');
    getByTestId('greeting_message');
    getByTestId('redirect__url');
    getByTestId('help__image');
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
