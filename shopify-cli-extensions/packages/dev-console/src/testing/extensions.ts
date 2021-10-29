import {ExtensionPayload, Status} from '../types';

type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};

let id = 0;

function pad(num: number) {
  return `00000000000${num}`.slice(-12);
}

export function mockExtension(obj: DeepPartial<ExtensionPayload> = {}): ExtensionPayload {
  const uuid = `00000000-0000-0000-0000-${pad(id++)}`;
  return {
    type: 'purchase_option',
    assets: {
      main: {
        name: 'main',
        url: `https://secure-link.com/extensions/${uuid}/assets/main.js`,
      },
    } as any,
    development: {
      hidden: false,
      status: Status.Success,
      resource: {
        url: 'resourceUrl',
      },
      root: {
        url: `https://secure-link.com/extensions/${uuid}`,
      },
      renderer: {
        name: 'render name',
        version: '1.0.0',
      },
      ...((obj.development || {}) as any),
    },
    uuid,
    version: 'extension version',
    ...obj,
  };
}

export function mockExtensions(): ExtensionPayload[] {
  return [mockExtension()];
}
