import {createContext, useContext} from 'react';

import {ExtensionPayload} from '../types';

export const ExtensionPayloadContext = createContext<ExtensionPayload[]>([]);
export function useExtensions() {
  const data = useContext(ExtensionPayloadContext);

  if (!data) {
    throw new Error('Missing ExtensionPayloadContext');
  }
  return data;
}
