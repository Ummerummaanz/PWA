/**
 * Everything in this file is used only in development and Contentful feature preview
 */
import * as React from 'react';
import { render } from 'react-dom';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router';

import './theme/development.css';

import App from './FeatureApp';

const root = document.getElementById('root');

/**
 * Use a sample Content ID for your Feature App for development
 * Webpack will strip this line in production build
 *
 * You can also pass contentId GET param like this:
 *    http://localhost:3000/?contentId=ZYKVTU71CQS6ROZDNydgk
 */
const DEV_CONTENT_ID = process.env.NODE_ENV !== 'production' ? 'ZYKVTU71CQS6ROZDNydgk' : undefined;

/**
 * This is the root path (route) of your feature.
 * You can leave as is or change to something else.
 * For best compatibility, do not use the root (`/`)
 */
const ROUTE_PATH = '/my-feature';

const DevScaffolding = () => (
  <IonApp>
    <IonContent>
      {/* This is a sample router implementation for development purposes. */}
      <IonReactRouter>
        <IonRouterOutlet>
          {/* Switch ensures that just one of the routes is rendered. */}
          {/* This way we load App when the root route is used, */}
          {/* which allows for scaffolding of sub-routes. */}
          <Switch>
            <Route path={ROUTE_PATH}>
              <App id={DEV_CONTENT_ID} />
            </Route>

            {/* Ensure the root path is used for maximum routing compatibility */}
            <Redirect from="/" to={ROUTE_PATH} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonContent>
  </IonApp>
);

render(<DevScaffolding />, root);
