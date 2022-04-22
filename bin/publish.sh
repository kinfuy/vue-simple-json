#!/bin/sh

set -e

npm install --no-frozen-lockfile --ignore-scripts

npm build

cd dist
npm publish --access public
cd -

echo "✅ Publish completed"
