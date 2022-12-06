import React from 'react';
import { IonButton, IonLabel, IonPopover, IonSpinner } from '@ionic/react';
import { Translate, uploadClient } from 'oasis-os-common';

import './style.css';
import { EventEmmiter } from 'oasis-os-utils';
import { useAppState } from 'oasis-os-react';
import { useField } from 'oasis-os-contentful';
import { Icon } from 'oasis-os-theming';

interface Verbiage {
  uploadContent: {
    audioRedirectURL: string;
    photosVideosRedirectURL: string;
    documentsRedirectURL: string;
    closeButtonIcon: string;
    successIcon: string;
    uploadsIcon: string;
    secureFolderRedirectURL: string;
  };
}

const FileQueue = React.lazy(() =>
  import('oasis-os-common').then((module) => ({ default: module['FileQueue'] })),
);
const UploadCancelModal = React.lazy(() =>
  import('oasis-os-common').then((module) => ({ default: module['UploadCancelModal'] })),
);

const Upload: React.FC = () => {
  const [, , app] = useAppState();
  const entryId = app?.meta?.contentId as string;
  const verbiage = useField<Verbiage>('verbiage');
  const [uploadOpen, setUploadOpen] = React.useState<boolean>(false);
  const [remainingFilesToUpload, setRemainingFilesToUpload] = React.useState<number>(0);
  const [uploadedFiles, setUploadedFiles] = React.useState<number>(0);

  React.useEffect(() => {
    EventEmmiter.on('uploadQueueChanged', (currentQueue) => {
      setUploadOpen(true);
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
    setUploadOpen(true);
  }, []);

  return (
    <div className="feature-header-toolbar__upload">
      <IonButton
        className="feature-header-toolbar__upload__button"
        id="upload-button"
        shape="round"
        fill="outline"
        color="button-primary"
        data-testid="upload-button"
        onClick={() => setUploadOpen(true)}
      >
        {remainingFilesToUpload > 0 && <IonSpinner name="crescent" />}
        <IonLabel className="feature-header-toolbar__upload__label">
          {/* hardcoded as this is not final UI */}
          {remainingFilesToUpload > 0 ? (
            <Translate id={`${entryId}.uploadContent.uploadingText`} />
          ) : (
            <>
              <Icon
                data-testid="upload-file__close-button"
                icon={verbiage.uploadContent.uploadsIcon}
              />
              <Translate id={`${entryId}.uploadContent.uploadedText`} />
            </>
          )}
        </IonLabel>
      </IonButton>
      <IonPopover
        className="feature-header-toolbar__upload__popover"
        onDidDismiss={() => setTimeout(() => setUploadOpen(false), 100)}
        isOpen={uploadOpen}
        trigger="upload-button"
        side="bottom"
        alignment="center"
        mode="ios"
        arrow
      >
        <React.Suspense fallback={<p>Error loading</p>}>
          <FileQueue verbiage={verbiage} setUploadOpen={setUploadOpen} />
        </React.Suspense>
      </IonPopover>
      <React.Suspense fallback={<p>Error loading</p>}>
        <UploadCancelModal />
      </React.Suspense>
    </div>
  );
};

export default Upload;
