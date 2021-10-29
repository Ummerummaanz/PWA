import React from 'react';
import './style.css';

interface Props {
  url: string;
  name: string;
}

const Avatar: React.FC<Props> = ({ url, name }: Props) => {
  return (
    <div className="feature-header-toolbar__avatar">
      <img data-testid="avatar__image" src={url} alt={name} />
    </div>
  );
};

export default Avatar;
