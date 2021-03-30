/* eslint-disable react/jsx-props-no-spreading */
import * as React from 'react';
import { App } from 'oasis-os-react';
import Feature from '../components/Feature';

const FeatureApp: typeof App = ({ ...fromParentApp }) => (
  <App config={{ id: 'feature-#__FEATURE_NAME__#' }} {...fromParentApp}>
    <Feature />
  </App>
);

export default FeatureApp;
