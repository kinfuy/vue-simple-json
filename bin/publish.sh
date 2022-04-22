#!/bin/sh

set -e

pnpm install --no-frozen-lockfil

pnpm build

cd dist
npm publish --access public
cd -

echo "✅ Publish completed"
