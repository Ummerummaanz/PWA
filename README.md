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
