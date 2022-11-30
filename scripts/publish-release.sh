#!/bin/bash
set -ex

source ./scripts/enable-git-ssh.sh
set-git-ssh

PACKAGE=$1

case $PACKAGE in
    tester|transformer)
        cd $PACKAGE
        ;&
    as)
        npm pkg delete scripts.prepare # remove husky install script
        npm publish
        ;;
    *)
        echo "Unknown package $PACKAGE"
        exit 1
        ;;
esac
