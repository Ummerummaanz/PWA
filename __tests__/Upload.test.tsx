import * as React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react';
import Upload from '../src/components/Upload';
import { EventEmmiter } from 'oasis-os-utils';

let mockAllItems: string[] = ['item1', 'item2', 'item3', 'item4'];
let mockNotUploadedItems: string[] = [];
let verbiage = {
  uploadContent: {
    audioRedirectURL: '/testaudio/all',
    photosVideosRedirectURL: '/testaudio/all',
    documentsRedirectURL: '/testaudio/all',
    closeButtonIcon: 'testicon',
    successIcon: 'testicon',
    uploadsIcon: 'testicon',
    secureFolderRedirectURL: '/testaudio/all',
  },
};

jest.mock('oasis-os-common', () => ({
  ...jest.requireActual('oasis-os-common'),
  FileQueue: jest.fn(({ id }) => {
    return <div data-testid="upload-queue" />;
  }),
  uploadClient: {
    uploader: {
      getAllItems: () => mockAllItems,
      getNotUploadedItems: () => mockNotUploadedItems,
    },
  },
}));

jest.mock('oasis-os-contentful', () => ({
  useField: jest.fn((field: string) => {
    if (field === 'verbiage') return verbiage;
    return undefined;
  }),
}));

let mockOnDismiss = false;

jest.mock('@ionic/react', () => ({
  ...jest.requireActual('@ionic/react'),
  IonPopover: (props: any) => {
    if (mockOnDismiss && props.onDidDismiss) props.onDidDismiss();
    return <div className={props.cssClass}>{props.children}</div>;
  },
}));

describe('Help', () => {
  it('should render upload and open popover on click', async () => {
    const { findByTestId, container } = render(<Upload />);
    const button = await findByTestId('upload-button');
    fireEvent.click(button);
    await findByTestId('upload-queue');
  });
  it('should render upload and open popover on click with not uploaded items', async () => {
    mockNotUploadedItems = ['item1', 'item2'];
    const { findByTestId, rerender } = render(<Upload />);
    const button = await findByTestId('upload-button');
    fireEvent.click(button);
    await findByTestId('upload-queue');
  });
  it('should render upload and open popover on click with not uploaded items and then close it on dismiss', async () => {
    jest.useFakeTimers();
    mockNotUploadedItems = ['item1', 'item2'];
    const { findByTestId, rerender } = render(<Upload />);
    const button = await findByTestId('upload-button');
    fireEvent.click(button);
    await findByTestId('upload-queue');
    mockOnDismiss = true;
    rerender(<Upload />);
    jest.runOnlyPendingTimers();
  });
  it('should render upload and open popover on click with not uploaded items and then close popover on queue update and no items', async () => {
    mockNotUploadedItems = ['item1', 'item2'];
    const { findByTestId, rerender } = render(<Upload />);
    const button = await findByTestId('upload-button');
    fireEvent.click(button);
    await findByTestId('upload-queue');
    mockAllItems = [];
    EventEmmiter.emit('uploadQueueChanged', []);
  });
});
