import * as React from 'react';
import { findByTestId, render, waitFor } from '@testing-library/react';
import { getUserAvatar, getUserProfile } from 'oasis-feature-api';
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


jest.mock('oasis-os-common', () => ({
  ...jest.requireActual('oasis-os-common'),
  Translate: jest.fn(({ id }) => {
    return 'Hello';
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

const file = new File([''], 'avatar.png');
const avatar = { hashCode: '1234', data: file };
jest.spyOn(React, 'useState').mockReturnValueOnce([avatar, () => jest.fn()]);

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
  window.URL.createObjectURL = jest.fn();
  it.each([
    ['with Avatar', true],
    ['without Avatar', false],
  ])('should get welcome message %s', async (_, hasAvatarImage) => {
    (getUserProfile as jest.Mock).mockReturnValue(
      Promise.resolve({
        public: { firstName: 'test', hasAvatarImage },
      }),
    );
    hasAvatarImage &&
      (getUserAvatar as jest.Mock).mockReturnValue(
        Promise.resolve({ hashCode: '1234', data: file }),
      );
    const { container, getByTestId } = render(<Feature />);
    getByTestId('avatar__image');
    getByTestId('greeting_message');
    getByTestId('redirect__url');
    getByTestId('help__image');
    await waitFor(() => {
      expect(container).toMatchSnapshot();
    });
  });
});
