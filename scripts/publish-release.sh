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
        npm publish --access public
        ;;
    *)
        echo "Unknown package $NPM_PACKAGE"
        exit 1;;
esac
