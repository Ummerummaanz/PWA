import React from 'react';
import './style.css';

interface Props {
  message: string;
}

const Greeting: React.FC<Props> = ({ message }: Props) => {
  return (
    <div className="feature-header-toolbar__greeting__message" data-testid="greeting_message">
      {message}
    </div>
  );
};

export default Greeting;
