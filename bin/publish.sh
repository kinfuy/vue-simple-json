#!/bin/sh

set -e

yarn

yarn build

npm publish --access public
cd -

echo "✅ Publish completed"
