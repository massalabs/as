#!/bin/bash
set -ex

# for packageDir in packages/*; do
#     if [ -d "$packageDir" ]; then
#         PACKAGE_NAME=$(cat "$packageDir/package.json" | jq -r '.name')
#         PUBLISH_VERSION=$(cat "$packageDir/package.json" | jq -r '.version')

#         npm dist-tag add "$PACKAGE_NAME@$PUBLISH_VERSION" buildnet
#         npm dist-tag add "$PACKAGE_NAME@$PUBLISH_VERSION" testnet
#     fi
# done

cd ./packages/as-types
pwd
npm publish --access public --tag latest
npm dist-tag add "@massalabs/as-types@2.0.0" buildnet
