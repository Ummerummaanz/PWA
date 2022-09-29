import * as React from 'react';
import { Translate } from 'oasis-os-common'
import { useField } from 'oasis-os-contentful';
import { useAppState } from 'oasis-os-react';
import { useEffect } from 'react';
import { getUserProfile, getUserAvatar, UserAvatarResponse } from 'oasis-feature-api';
import { ContentfulIcon } from 'oasis-os-theming';
import Avatar from '../Avatar';
import Greeting from '../Greeting';
import Help from '../Help';
import './style.css';

const Feature: React.FC = () => {
  const [, , app] = useAppState();
  const entryId = app?.meta?.contentId as string;
  const defaultAvatar = useField<ContentfulIcon>('avatar');
  const helpIcon = useField<ContentfulIcon>('helpIcon');
  const helpRedirectUrl = useField<string>('helpRedirectUrl');
  const [userName, setUserName] = React.useState<string>('');
  const [avatar, setAvatar] = React.useState<UserAvatarResponse>();
  const greetingMessage = Translate({ id: `${entryId}.greeting` })?.props?.children as string;

  useEffect(() => {
    getUserProfile().then((profile) => {
      const { firstName, hasAvatarImage } = profile.public;
      firstName && setUserName(` ${firstName}`);
      hasAvatarImage && getUserAvatar().then(setAvatar);
    });
  }, []);

  return (
    <div className="feature-header-toolbar__root">
      <Avatar
        url={
          avatar?.data
            ? URL.createObjectURL(avatar.data)
            : defaultAvatar.fields.icon.fields.file.url
        }
        name={defaultAvatar.fields.name}
      />
      <Greeting message={`${greetingMessage}${userName}!`} />
      {helpIcon && (
        <Help
          url={helpIcon.fields.icon.fields.file.url}
          name={helpIcon.fields.name}
          helpRedirectUrl={helpRedirectUrl}
        />
      )}
    </div>
  );
};

export default Feature;
