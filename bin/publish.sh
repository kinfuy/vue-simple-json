#!/bin/sh

set -e

pnpm install --no-frozen-lockfile --ignore-scripts

pnpm build

cd dist
npm publish --access public
cd -

echo "✅ Publish completed"
