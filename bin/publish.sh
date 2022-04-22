#!/bin/sh

set -e

npm install

npm build

cd dist
npm publish --access public
cd -

echo "✅ Publish completed"
