import React from 'react';
import { IonButton, IonLabel, IonPopover, IonSpinner } from '@ionic/react';
import { FileQueue, Translate, uploadClient } from 'oasis-os-common';

import './style.css';
import { EventEmmiter } from 'oasis-os-utils';
import { useAppState } from 'oasis-os-react';

const Upload: React.FC = () => {
  const [, , app] = useAppState();
  const entryId = app?.meta?.contentId as string;
  const [uploadOpen, setUploadOpen] = React.useState<boolean>(false);
  const [remainingFilesToUpload, setRemainingFilesToUpload] = React.useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = React.useState<number>(0);
  React.useEffect(() => {
    EventEmmiter.on('uploadQueueChanged', (currentQueue) => {
      setRemainingFilesToUpload(uploadClient.uploader.getNotUploadedItems().length);
      setUploadedFiles(
        uploadClient.uploader.getAllItems().length -
          uploadClient.uploader.getNotUploadedItems().length,
      );
      if (uploadClient.uploader.getAllItems().length < 1) {
        setUploadOpen(false);
      }
    });
    setRemainingFilesToUpload(uploadClient.uploader.getNotUploadedItems().length);
    setUploadedFiles(
      uploadClient.uploader.getAllItems().length -
        uploadClient.uploader.getNotUploadedItems().length,
    );
  }, []);
  return (
    <div className="feature-header-toolbar__upload">
      <IonButton
        className="feature-header-toolbar__upload__button"
        shape="round"
        fill="outline"
        color="button-primary"
        data-testid="upload-button"
        onClick={() => setUploadOpen(true)}
      >
        {remainingFilesToUpload > 0 && <IonSpinner name="crescent" />}
        <IonLabel>
          {/* hardcoded as this is not final UI */}
          {remainingFilesToUpload > 0 ? 'Uploading' : `${uploadedFiles} Uploaded`}
        </IonLabel>
      </IonButton>
      <IonPopover
        className="feature-header-toolbar__upload__popover"
        isOpen={uploadOpen}
        trigger="upload-button"
        side="bottom"
        alignment="center"
        mode="ios"
        arrow
      >
        <FileQueue />
      </IonPopover>
    </div>
  );
};

export default Upload;
