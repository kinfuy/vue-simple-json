#!/bin/sh

set -e

pnpm i --frozen-lockfile

pnpm build

npm publish --access public
cd -

echo "✅ Publish completed"
