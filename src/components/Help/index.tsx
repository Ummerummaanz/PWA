import React from 'react';
import './style.css';

interface Props {
  url: string;
  name: string;
  helpRedirectUrl: string;
}

const Help: React.FC<Props> = ({ url, name, helpRedirectUrl }: Props) => {
  return (
    <div className="feature-header-toolbar__help">
      <a href={helpRedirectUrl} target="_blank" data-testid="redirect__url" rel="noreferrer">
        <img data-testid="help__image" src={url} alt={name} />
      </a>
    </div>
  );
};

export default Help;
