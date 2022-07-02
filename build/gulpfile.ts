import { parallel, series } from 'gulp';
import { run, withTask } from '@alqmc/build-utils';
import { zip } from './buildZip';
import { copyFiles } from './copyfile';
import { build } from './build';
import { buildStyles } from './buildStyle';

export default series(
  withTask('update:version', () => run('pnpm run update:version')),
  withTask('clear', () => run('pnpm run clear')),
  build,
  parallel(buildStyles, copyFiles),
  zip
);
