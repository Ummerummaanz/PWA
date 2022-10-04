import React from 'react';
import { Translate } from 'oasis-os-common';
import { useAppState } from 'oasis-os-react';
import './style.css';

interface Props {
  message: string;
}

const Greeting: React.FC<Props> = ({ message }: Props) => {
  const [, , app] = useAppState();
  const entryId = app?.meta?.contentId as string;
  return (
    <div className="feature-header-toolbar__greeting__message" data-testid="greeting_message">
      <Translate id={`${entryId}.greetingMessage`} />&nbsp;{message}
    </div>
  );
};

export default Greeting;
