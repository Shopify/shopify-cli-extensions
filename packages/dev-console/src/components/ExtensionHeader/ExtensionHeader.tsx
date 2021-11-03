import React from 'react';
import {useI18n} from '@shopify/react-i18n';

import {ExtensionManifestData} from '../types';
import {Checkbox} from '../CheckBox';
import {ActionSet} from '../ActionSet';

export interface ExtensionHeaderRowProps {
  extensions: ExtensionManifestData[];
  selectedExtensions: ExtensionManifestData[];
  setSelected: (extensions: ExtensionManifestData[]) => void;
  actions: React.ReactElement;
}

export function ExtensionHeaderRow({
  extensions,
  selectedExtensions,
  setSelected,
  actions,
}: ExtensionHeaderRowProps) {
  const [i18n] = useI18n();
  console.log('i18n', i18n);

  const allSelected = selectedExtensions.length === extensions.length;

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected([]);
    } else {
      setSelected(extensions);
    }
  };

  return (
    <tr>
      <th>
        <Checkbox
          checked={allSelected}
          onChange={toggleSelectAll}
          accessibilityLabel={
            allSelected
              ? i18n.translate('bulkActions.deselectAll')
              : i18n.translate('bulkActions.selectAll')
          }
        />
      </th>
      <th>{i18n.translate('extensionList.name')}</th>
      <th>{i18n.translate('extensionList.type')}</th>
      <th>{i18n.translate('extensionList.servedFrom')}</th>
      <th>{i18n.translate('extensionList.status')}</th>
      <th>
        <ActionSet extensions={selectedExtensions}>{actions}</ActionSet>
      </th>
    </tr>
  );
}
