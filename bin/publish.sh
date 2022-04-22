#!/bin/sh

set -e

pnpm install

pnpm build

npm publish --access public
cd -

echo "✅ Publish completed"
