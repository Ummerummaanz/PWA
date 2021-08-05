/**
 * Everything in this file is used only in development and Contentful feature preview
 */
import * as React from 'react';
import { render } from 'react-dom';
import { IonApp, IonContent, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router';
import { useAuth, authClient, AuthClientMethod, AuthProvider, AuthClient } from 'oasis-auth';

import './theme/development.css';

import App from './FeatureApp';

const root = document.getElementById('root');

/**
 * Auth config for WL Core dev lab
 * If using set authEnabled to true and your FA port to 80
 * If there's a need to change the account or re-login
 * just clear the browser cache including cookies and re-load
 */
const authEnabled = false;
const authConfig = {
  host: 'https://common-coredev-eks-wlpc.cloud.synchronoss.net',
  clientUrl: 'http://localhost',
  customHeaders: {
    'X-Client-Identifier': 'pwa',
    'X-Client-Platform': 'Web',
    'X-Application-Identifier': 'PWALite218',
  },
  method: 'manager' as AuthClientMethod,
  userReplace: '{userId}',
  useDB: true,
  hostReplace: '{host}'
};

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

const DevScaffoldingWithAuth = () => {
  const [auth, dispatch] = useAuth();
  React.useEffect(() => {
    async function authenticate() {
      const client: AuthClient = await authClient.init(authConfig, dispatch);
      if (client) {
        await client.authenticate();
      }
    }
    if (!auth.authenticated) {
      authenticate();
    }
  }, []);
  React.useEffect(() => {
    if (auth.session?.accessToken) {
      document.cookie = `NWB=${auth.session.accessToken}; expires=Thu, 31 Dec 2021 12:00:00 UTC; path=/`;
    }
  }, [auth.session?.accessToken]);
  return <>{!auth.authenticated ? null : <DevScaffolding />}</>;
};

if (authEnabled) {
  render(
    <AuthProvider>
      <DevScaffoldingWithAuth />
    </AuthProvider>,
    root,
  );
} else {
  render(<DevScaffolding />, root);
}
