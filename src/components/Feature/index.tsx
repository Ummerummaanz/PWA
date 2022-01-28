import * as React from 'react';
import { useField } from 'oasis-os-contentful';
import { useEffect } from 'react';
import { getUserProfile, getUserAvatar, UserAvatarResponse } from 'oasis-feature-api';
import { ContentfulIcon } from 'oasis-os-theming';
import Avatar from '../Avatar';
import Greeting from '../Greeting';

const Feature: React.FC = () => {
  const defaultAvatar = useField<ContentfulIcon>('avatar');
  const greetingMessage = useField<string>('greeting');
  const [userName, setUserName] = React.useState<string>('');
  const [avatar, setAvatar] = React.useState<UserAvatarResponse>();

  useEffect(() => {
    getUserProfile().then((profile) => {
      const { firstName, hasAvatarImage } = profile.public;
      firstName && setUserName(` ${firstName}`);
      hasAvatarImage && getUserAvatar().then(setAvatar);
    });
  }, []);

  return (
    <>
      <Avatar
        url={
          avatar?.data
            ? URL.createObjectURL(avatar.data)
            : defaultAvatar.fields.icon.fields.file.url
        }
        name={defaultAvatar.fields.name}
      />
      <Greeting message={`${greetingMessage}${userName}!`} />
    </>
  );
};

export default Feature;
