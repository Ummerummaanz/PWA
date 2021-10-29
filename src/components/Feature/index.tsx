import * as React from 'react';
import { useField } from 'oasis-os-contentful';
import { useEffect } from 'react';
import { getUserProfile, getUserAvatar, UserAvatarResponse } from 'oasis-feature-api';
import Avatar from '../Avatar';
import Greeting from '../Greeting';

type ImageAsset = {
  fields: {
    title: string;
    file: {
      url: string;
    };
  };
};

const Feature: React.FC = () => {
  const defaultAvatar = useField<ImageAsset>('avatar');
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
        url={avatar?.data ? URL.createObjectURL(avatar.data) : defaultAvatar.fields.file.url}
        name={defaultAvatar.fields.title}
      />
      <Greeting message={`${greetingMessage}${userName}!`} />
    </>
  );
};

export default Feature;
