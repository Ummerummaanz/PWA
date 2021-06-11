/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { App, ProviderProps } from 'oasis-os-react';
import { ContentfulProvider } from 'oasis-os-contentful';
import { Feature } from '../components';

const FeatureApp: React.FC<ProviderProps> = (scaffoldingProps: ProviderProps) => {
  const { id } = scaffoldingProps;

  return (
    // Make sure to always use this spread from the parent app.
    // This helps propagate instantiation instructions from the configuration.
    <App {...scaffoldingProps}>
      <ContentfulProvider id={id}>
        {/* This component is where you start building your Feature logic */}
        <Feature />
      </ContentfulProvider>
    </App>
  );
};

export default FeatureApp;
