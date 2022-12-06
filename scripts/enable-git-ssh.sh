#!/bin/bash

set-git-ssh () {
    if [[ -n "$CI" ]];then
        git config user.email "massa-as-ci@massa.net"
        git config user.name "massa-as-ci"
    fi
}

