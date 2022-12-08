#!/bin/bash
set -ex

source ./scripts/enable-git-ssh.sh
set-git-ssh

PACKAGE=$1

npm pkg delete scripts.prepare # remove husky install script
npm ci
npm run build

case $PACKAGE in
    transformer)
        cd $PACKAGE
        ;&
    as)
        npm publish
        ;;
    *)
        echo "Unknown package $PACKAGE"
        exit 1
        ;;
esac
