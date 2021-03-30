import * as React from 'react';
import ReactDOM from 'react-dom';
import { onFeaturesReady, isSSR } from 'oasis-os-react';

import App from './FeatureApp';

const root = document.getElementById('root');

if (isSSR() || root?.childElementCount === 0) {
  ReactDOM.render(<App />, root);
} else {
  onFeaturesReady(() => {
    ReactDOM.hydrate(<App />, root);
  });
}
