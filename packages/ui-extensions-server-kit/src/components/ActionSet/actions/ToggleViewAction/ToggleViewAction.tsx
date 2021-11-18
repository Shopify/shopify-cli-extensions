import React from 'react';
import {HideMinor, ViewMinor} from 'components/Icon/icons';
import {useDevConsole} from 'state/context';
import {useExtensions} from 'utilities/extensionPayload';

import {Action} from '../../Action';

export function ToggleViewAction() {
  const extensions = useExtensions();

  const allExtensionAreVisible = extensions.every(
    (extensionManifest) => !extensionManifest.development.hidden,
  );

  return allExtensionAreVisible ? <HideAction label="Hide" /> : <ShowAction label="Show" />;
}

interface Props {
  label: string;
}

function HideAction({label}: Props) {
  const extensions = useExtensions();
  const {update} = useDevConsole();

  return (
    <Action
      source={ViewMinor}
      accessibilityLabel={label}
      onAction={() =>
        update({
          extensions: extensions.map((extension) => ({...extension, development: {hidden: true}})),
        })
      }
    />
  );
}

function ShowAction({label}: Props) {
  const extensions = useExtensions();
  const {update} = useDevConsole();
  return (
    <Action
      forceVisible
      source={HideMinor}
      accessibilityLabel={label}
      onAction={() =>
        update({
          extensions: extensions.map((extension) => ({...extension, development: {hidden: false}})),
        })
      }
    />
  );
}
