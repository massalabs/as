#!/bin/bash

color="red"
coverage=$COVERAGE

if [ "$coverage" -ge 80 ]; then
    color="green"
elif [ "$coverage" -ge 70 ]; then
    color="orange"
fi

filename="README.md"

coverageLine=$(sed -n '2p' $filename)

regex="coverage-([0-9]{1,3})%"

if [[ $coverageLine =~ $regex ]]; then
    oldCoverage="${BASH_REMATCH[1]}"
else
    oldCoverage=""
fi

if [ "$oldCoverage" != "$coverage" ] || [ -z "$oldCoverage" ]; then
    echo "updating badge"

    newLine="![check-code-coverage](https://img.shields.io/badge/coverage-$coverage%25-$color)"

    sed -i "2s/.*/$newLine/" $filename

    echo $filename
fi

