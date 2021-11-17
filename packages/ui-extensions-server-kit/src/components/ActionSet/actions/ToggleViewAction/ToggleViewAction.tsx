import React from 'react';
import {HideMinor, ViewMinor} from 'components/Icon/icons';
import {useDevConsole} from 'state/context';
import {useExtensions} from 'utilities/extensionPayload';

import {Action} from '../../Action';
// eslint-disable-next-line @shopify/strict-component-boundaries
// import actionStyles from '../../Action/Action.scss';

export function ToggleViewAction() {
  const extensions = useExtensions();

  const atLeastOneExtensionVisible = extensions.some(
    (extensionManifest) => !extensionManifest.development.hidden,
  );

  return atLeastOneExtensionVisible ? <ShowAction label="Hide" /> : <HideAction label="Show" />;
}

interface Props {
  label: string;
}

function ShowAction({label}: Props) {
  const extensions = useExtensions();
  const {update} = useDevConsole();

  return (
    <Action source={ViewMinor} accessibilityLabel={label} onAction={() => update({extensions})} />
  );
}

function HideAction({label}: Props) {
  const extensions = useExtensions();
  const {update} = useDevConsole();
  return (
    <Action
      forceVisible
      source={HideMinor}
      accessibilityLabel={label}
      onAction={() => update({extensions})}
    />
  );
}
