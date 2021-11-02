import React from 'react';

import {HideMinor, ViewMinor} from '../../../Icon/icons';
// import {useI18n} from '@shopify/react-i18n';
import {useDevConsole} from '../../../../state/context';
import {useExtensions} from '../../../../utilities/extensionPayload';
import {Action} from '../../Action';

export function ToggleViewAction() {
  const extensions = useExtensions();
  // const [i18n] = useI18n();

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
    <Action source={HideMinor} accessibilityLabel={label} onAction={() => update({extensions})} />
  );
}
