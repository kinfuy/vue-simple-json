import { resolve } from 'path';

import { buildVueLib } from '@alqmc/build-vue';

import { buildOutpath, enterPath, rootpath } from './utils/path';

import type { DefineVueConfig } from '@alqmc/build-vue';

const bulidConfig: DefineVueConfig = {
  baseOptions: {
    input: resolve(enterPath, 'index.ts'),

    pkgPath: resolve(enterPath, 'package.json'),

    enterPath,

    outPutPath: buildOutpath,

    tsConfigPath: resolve(rootpath, 'tsconfig.json'),
  },
};

export const build = async () => {
  await buildVueLib(bulidConfig);
};
