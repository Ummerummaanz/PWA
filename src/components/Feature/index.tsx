import * as React from 'react';
import { useField } from 'oasis-os-contentful';

interface MyContentfulModel {
  title: string;
}

const Feature: React.FC = () => {
  // Contentful Provider will make data available in all nested components.
  // Let's grab a field
  const title = useField<MyContentfulModel['title']>('title');

  // Show that field
  return (
    <>
      <h1>Hello from __FEATURE_NAME__</h1>
      <div>{title}</div>
    </>
  );
};

export default Feature;
