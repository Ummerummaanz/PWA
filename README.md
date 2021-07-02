# Your Feature App (template)

## Getting Started

This repository is a template. You should commit your changes to a separate repository.

#### 1. Initialize the App

1. Run `yarn install`
2. Run `yarn run init {name} {port}`

Where `name` is the name of the feature app (i.e. `backup`) and `port` is the port number the feature app will be running on.

The above will have a simple runnable feature app and will also initialize a new git repository pointing to `oasis/feature-{name}`


##### Verify Feature App name

Open package.json and replace the name with something that matches your Feature App's name. Make sure it starts with `oasis-feature`.

Examples:

- `oasis-feature-welcome`
- `oasis-feature-onboarding`
- `oasis-feature-auth`

Also, make sure you update `"repository"."url"` with the actual location of your Stash repository. It's likely that you'll only need to update the App name and you're set.

You can go through other fields (such as `"description"`) and ensure they are up to date.

#### 2. Set environment variables

You can create a `.env.development` variable that works just in dev environment

The ENV variables you need there are the following:

```
CONTENTFUL_TOKEN=rioXuMFNH69BjTjWojSFZfRENHPKunn4BKi3vUJBD9A
CONTENTFUL_SPACE=awihm2bm53tr
CONTENTFUL_ENVIRONMENT=dev
```

| Variable                 | Description                                                                               |
| ------------------------ | ----------------------------------------------------------------------------------------- |
| `CONTENTFUL_TOKEN`       | Content delivery token. You can obtain it in the API settings of your Contentful account. |
| `CONTENTFUL_SPACE`       | Contentful Space ID.                                                                      |
| `CONTENTFUL_ENVIRONMENT` | Contentful Environment ID.                                                                |

You do not need to use these variables if you App is not using Contentful. Very few Feature Apps do not use Contentful, tho.

#### 3. Register ENV variables with the App

The build system is configured to accept whitelisted ENV variables. You can whitelist them in you package.json file.

```json
{
  "featureApp": {
    "env": [
      // whitelist your environment variables here
      "CONTENTFUL_TOKEN",
      "CONTENTFUL_SPACE",
      "CONTENTFUL_ENVIRONMENT"
    ]
  }
}
```

The `featureApp` key is the dedicated configuration property for Oasis Feature Apps. You can add any environmental variables you may need for your app. Contentful ENV vars are needed to communicate with Contentful.

#### 4. Validate Dev Server port number

The default port number for your development server is 3000. However, sometimes you have to work with multiple Feature Apps and their development servers. In such event you will need to use separate port numbers for each feature.

You can specify the port number in `package.json` as well.

```json
{
  "featureApp": {
    "port": "3000"
  }
}
```

#### 5. Update Development Environment

A part of your codebase hierarchically above `FeatureApp.tsx` is only used in two environments: development and feature preview. Neither will be used to deliver your feature in production.

That's where you can set development configuration.

##### Contentful configuration defaults

It's best to use Contentful for development (instead of providing with mock data manually). Your template comes with DEV_CONTENT_ID where you can update the ID below with something that suits your Contentful data entry.

```jsx
const DEV_CONTENT_ID = process.env.NODE_ENV !== 'production' ? 'ZYKVTU71CQS6ROZDNydgk' : undefined;
```

Production builds will remove this ID as part of the tree shaking algorithm in Webpack.

##### Routing defaults

Your app will be shown as part of a route address. You can mock it for development, which will make it easier for you to use internal routing as well.

```jsx
const ROUTE_PATH = '/my-feature';
```

##### Global styles

Global styles are loaded in `.src/app/theme/development.css`. These styles will help you experience the final look and feel as inherited by the PWA.

⚠️ Do not use this file to add styles for your Feature App. These styles **will not be included** in your production Feature App build.

## Automatic configuration loading

Your Feature App is pre-configured to load Contentful configuration automatically. It can also accept pre-loaded configuration when passed through from a parent app. Luckily, you don't have to worry about that because this template is already set up for that. Just make sure this setup is intact.

```jsx
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
```

## Using Configuration in your Feature App

You can use the `useField` hook from `oasis-os-contentful` to extract fields from previously obtained configuration data.

Take a look at this example that shows how you can do that, respecting type safety as well.

```jsx
import * as React from 'react';
import { useField } from 'oasis-os-contentful';

// You can describe your entire data model here
interface MyContentfulModel {
  title: string;
}

const Feature: React.FC = () => {
  // Contentful Provider will make data available in all nested components.
  // Let's grab a field
  const title = useField < MyContentfulModel['title'] > 'title';

  // Show that field
  return (
    <>
      <h1>Hello</h1>
      {/* The `title` field will show automatically once Contentful data is received. */}
      <div>{title}</div>
    </>
  );
};

export default Feature;
```

## Using API calls in your Feature App

### Setup

API requests require an API token and a user ID. In order to set this up within a local development environment you'd need to request those. This may differ based on the API environment your're calling, by default it's setup for DEV (https://common-coredev-eks-wlpc.cloud.synchronoss.net) which should be fine for most cases.

1. Add `oasis-feature-api` as a dependency.

```bash
yarn add oasis-feature-api
```

2. Setup the API client as a shared singleton dependency in `package.json`. if you're unsure of the version to share, just use the same value that is found within `dependencies` section.

```json
{
  ...

  "featureApp": {
    ...

    "shares": {
      "oasis-feature-api": {
        "singleton": true,
        "version": "^0.0.3"
      }
    }
  },

  ...
}
```

3. Make a cURL request and generate a new token. You can use a different user ID (X-NewBay-User-Uid header) if you'd like.

```bash
curl -i -d "grant_type=http%3A%2F%2Fpurl.oclc.org%2Fwebdata%2Fauth%2Fccoe&assertion=enriched" -H "X-NewBay-User-Uid: 100000008" https://common-coredev-eks-wlpc.cloud.synchronoss.net/atp/oauth2/token
```

4. Extract `access_token` and `lcid` from the JSON response.
5. Insert the above into `.env.development` file into `API_TOKEN` and `API_USER_ID` variables respectively.
6. Initialize the API client within `src/app/bootstrap.tsx` file.

```typescript
import { apiClient } from 'oasis-feature-api';

...

apiClient.init({
  host: '', // we're proxying through webpack dev server
  token: process.env.API_TOKEN || '',
  userId: process.env.API_USER_ID || '',
  clientPlatform: 'foo',
  clientIdentifier: 'bar',
});
```

### Configuration


To use the current dev API environment, define the below variables in .env.development

```typescript
DEV_SERVER_PROXY_TARGETS=["https://common-coredev-eks-wlpc.cloud.synchronoss.net"]
DEV_SERVER_PROXY_CONTEXTS=[["/dv"]]
```

If you'd like to make requests against a different API environment (i.e. QA or any other) you'd have to edit `.env.development` file:

1. Edit the `DEV_SERVER_PROXY_TARGETS` variable. It is an string array of hosts the webpack server will be proxying to localhost.
2. Edit the `DEV_SERVER_PROXY_CONTEXTS` variable. It is an array of string arrays of endpoints the webpack server will be proxying to localhost. The nested array corresponds to the length of hosts defined in step (1).

For example, if we'd like to proxy https://foo.dev/accounts, https://foo.dev/users and https:/bar.dev/clients we'd have the following setup:

```typescript
DEV_SERVER_PROXY_TARGETS=["https://foo.dev", "https://bar.dev"]
DEV_SERVER_PROXY_CONTEXTS=[["/accounts", "/users"], ["/clients"]]
```

Note that if you have nested endpoint path like `/users/12345/data` you only have to specify the `/users` part

Update the package.json file with the below proxy configuration

```typescript
"proxy": {
      "secure": true,
      "changeOrigin": true
    }
```