import { resolve } from 'path';
import { copyFile } from 'fs/promises';
import { buildOutpath, enterPath, rootpath } from './utils/path';
export const copyFiles = () =>
  Promise.all([
    copyFile(resolve(enterPath, 'package.json'), resolve(buildOutpath, 'package.json')),
    copyFile(resolve(rootpath, 'README.md'), resolve(buildOutpath, 'README.md'))
  ]);
