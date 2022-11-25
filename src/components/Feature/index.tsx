import * as React from 'react';
import { useField } from 'oasis-os-contentful';
import { useEffect, useState } from 'react';
import { getUserProfile, getUserAvatar, UserAvatarResponse } from 'oasis-feature-api';
import { dispatch } from 'oasis-os-react';
import { ContentfulIcon } from 'oasis-os-theming';
import { uploadClient } from 'oasis-os-common';
import { EventEmmiter } from 'oasis-os-utils';
import Avatar from '../Avatar';
import Greeting from '../Greeting';
import Help from '../Help';
import './style.css';
import Upload from '../Upload';
import { UploadConfig } from '../../types/upload';

const Feature: React.FC = () => {
  const defaultAvatar = useField<ContentfulIcon>('avatar');
  const helpIcon = useField<ContentfulIcon>('helpIcon');
  const helpRedirectUrl = useField<string>('helpRedirectUrl');
  const [userName, setUserName] = React.useState<string>('');
  const [avatar, setAvatar] = React.useState<UserAvatarResponse>();
  const [filesInUploadQueue, setFilesInUploadQueue] = React.useState<number>(0);
  const [uploadConfig, setUploadConfig] = useState<UploadConfig['response']['upload']>();

  useEffect(() => {
    getUserProfile().then((profile) => {
      const { firstName, hasAvatarImage } = profile.public;
      firstName && setUserName(` ${firstName}`);
      hasAvatarImage && getUserAvatar().then(setAvatar);
    });
    EventEmmiter.on('uploadQueueChanged', (currentQueue) => {
      setTimeout(() => setFilesInUploadQueue(uploadClient.uploader.getAllItems().length), 100);
    });
    async function getUploadConfig() {
      const featureConfig: UploadConfig[] = await dispatch('*', 'getFeaturesConfig');
      const uploadConfigRes = featureConfig[0].response?.upload;
      setUploadConfig(uploadConfigRes);
    }
    getUploadConfig();
  }, []);

  return (
    <div className="feature-header-toolbar__root">
      {uploadConfig?.enabled && filesInUploadQueue > 0 && <Upload />}
      <Avatar
        url={
          avatar?.data
            ? URL.createObjectURL(avatar.data)
            : defaultAvatar.fields.icon.fields.file.url
        }
        name={defaultAvatar.fields.name}
      />
      <Greeting message={`${userName}!`} />
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
