import { IonButton, IonContent, IonItem, IonList, IonPopover } from '@ionic/react';
import { getUserAvatar, getUserProfile, UserAvatarResponse } from 'oasis-feature-api';
import { uploadClient } from 'oasis-os-common';
import { useField } from 'oasis-os-contentful';
import { dispatch, useAppState } from 'oasis-os-react';
import { ContentfulIcon } from 'oasis-os-theming';
import { EventEmmiter } from 'oasis-os-utils';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { UploadConfig } from '../../types/upload';
import Avatar from '../Avatar';
import Greeting from '../Greeting';
import Help from '../Help';
import Upload from '../Upload';
import './style.css';


const Feature: React.FC = () => {
  const lng =String;
  const defaultAvatar = useField<ContentfulIcon>('avatar');
  const helpIcon = useField<ContentfulIcon>('helpIcon');
  const helpRedirectUrl = useField<string>('helpRedirectUrl');
  const [userName, setUserName] = React.useState<string>('');
  const [avatar, setAvatar] = React.useState<UserAvatarResponse>();
  const [filesInUploadQueue, setFilesInUploadQueue] = React.useState<number>(0);
  const [uploadConfig, setUploadConfig] = useState<UploadConfig['response']['upload']>();
  const [, ,app] =useAppState();
  
  
  useEffect(() => {
    getUserProfile().then((profile) => {
      const { firstName, hasAvatarImage } = profile.public;
      firstName && setUserName(`${firstName}`);
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

    const handleClick =(locale:String ) =>{
     if(locale === "chinese") 
     {

      return dispatch ('*', 'localeInfo', 'en-CH');
    }
    else if(locale === 'japanese') 
    {
      return dispatch ('*', 'localeInfo', 'en-JP');
    }
    else if(locale === 'french')
     {
      return dispatch ('*', 'localeInfo', 'en-FR');
    }
    else 
    dispatch ('*', 'localeInfo','en-US')
  };
  // console.log(handleclickLng , "chinese buuton is clicked");




 
  return (
    <div className="feature-header-toolbar__root">
      {uploadConfig?.enabled && filesInUploadQueue > 0 && <Upload />}
      <IonButton  fill ="clear" id="popover-button">
      <Avatar
        url={
          avatar?.data
            ? URL.createObjectURL(avatar.data)
            : defaultAvatar.fields.icon.fields.file.url
        }
        name={defaultAvatar.fields.name}
      />
      <Greeting message={`${userName}!▼`}/>
   
   
      <IonPopover trigger="popover-button" dismissOnSelect={true}>
        <IonContent>
          <IonList>
            <IonItem button={true} id="nested-trigger" >
              <IonButton fill="default">Language ❯  </IonButton>
            </IonItem>
            <IonItem button={true} detail={false}>
              Settings
            </IonItem>
            <IonItem button={true} detail={false}>
              Help
            </IonItem>
            <IonItem button={true} detail={false}>
             Logout
            </IonItem>

            <IonPopover  trigger="nested-trigger" dismissOnSelect={true} side="end">
              <IonContent>
                <IonList>
                  <IonItem button={true } detail={false}>
                  <IonButton onClick= { ()=> handleClick('english')}>English</IonButton>
                
                  </IonItem>
                  <IonItem button={true} detail={false}>
                  <IonButton onClick= { ()=> handleClick('japanese')}>Japanese </IonButton>
                  </IonItem>
                  <IonItem button={true} detail={false}>
                  <IonButton onClick= { ()=> handleClick('chinese')}> Chinese</IonButton>
                  </IonItem>
                  <IonItem button={true} detail={false}>
                  <IonButton onClick= { ()=> handleClick('french')}>French </IonButton>                  
                  </IonItem>
                </IonList>
              </IonContent>
            </IonPopover>
          </IonList>
        </IonContent>
      </IonPopover>
      </IonButton>
 
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
