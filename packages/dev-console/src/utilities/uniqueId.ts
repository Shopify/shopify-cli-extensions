import {useRef} from 'react';

let index = 0;
export function useUniqueId(prefix: string, overrideId?: string) {
  const idRef = useRef(`${prefix}-${index++}`);
  return overrideId ?? idRef.current;
}
