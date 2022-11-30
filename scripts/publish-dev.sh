#!/bin/bash
set -ex

source ./scripts/enable-git-ssh.sh
set-git-ssh

PACKAGE=$1
echo $PACKAGE

case $PACKAGE in
    tester|transformer|as)
        if [[ "$PACKAGE" == "as" ]]; then
            NPM_PACKAGE=@massalabs/as
        else
            NPM_PACKAGE=@massalabs/as-$PACKAGE
            pushd $PACKAGE
        fi
        # remove husky install script
        npm pkg delete scripts.prepare
        npm version --preid dev --no-git-tag-version --no-commit-hooks prepatch
        #Use timestamp as package suffix
        TIME=$(date -u +%Y%m%d%H%M%S)
        sed -i "/version/s/dev.0/dev.$TIME/g" package.json
        PUBLISH_VERSION=$(cat package.json | jq -r '.version')
        echo publishing $NPM_PACKAGE@$PUBLISH_VERSION
        npm publish --access public --tag dev
        ;;
    *)
        echo "Unknown package $PACKAGE"
        exit 1;;
esac
