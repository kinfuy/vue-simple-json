#!/bin/sh

set -e

pnpm i --frozen-lockfile

pnpm build

cd dist
npm publish --access public
cd -

echo "✅ Publish completed"
