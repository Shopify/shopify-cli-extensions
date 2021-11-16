import {createContext, useContext} from 'react';

import {ExtensionPayload} from '../types';

export const ExtensionContext = createContext<ExtensionPayload[]>([]);
export function useExtensions() {
  const data = useContext(ExtensionContext);

  if (!data) {
    throw new Error('Missing ExtensionContext');
  }
  return data;
}
