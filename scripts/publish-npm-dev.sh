#!/bin/bash
set -e

# disable husky
npm pkg delete scripts.prepare

npm ci
npm run build
npm version --ws --preid dev --no-git-tag-version --no-commit-hooks prepatch

#Use timestamp as package suffix
TIME=$(date -u +%Y%m%d%H%M%S)
sed -i "/version/s/dev.0/dev.$TIME/g" packages/*/package.json

for packageDir in packages/*; do
  if [ -d "$packageDir" ]; then
    PACKAGE_NAME=$(cat "$packageDir/package.json" | jq -r '.name')
    PUBLISH_VERSION=$(cat "$packageDir/package.json" | jq -r '.version')
    echo "Publishing ${PACKAGE_NAME}@${PUBLISH_VERSION}"
  fi
done

BRANCH=${GITHUB_REF##*/}
TAG=""
if [[ "$BRANCH" == "buildnet" ]]; then
  TAG="buildnet-"
fi

npm publish --ws --access public --tag ${TAG}dev 