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

    updated_file=$(sed "2s/.*/$new_line/" $filename)

    encodedContent=$(echo "$updated_file" | base64 --wrap=0)

    response=$(curl -s -H "Authorization: token $GITHUB_TOKEN" \
    https://api.github.com/repos/$GITHUB_REPOSITORY/contents/README.md?ref=$GITHUB_REF)

    sha=$(echo "$response" | jq -r '.sha')
    url=$(echo "$response" | jq -r '.url')

    curl -s -H "Authorization: token $GITHUB_TOKEN" \
    -X PUT -d "{\"message\":\"Update README\",\"content\":\"$encodedContent\",\"sha\":\"$sha\",\"branch\":\"$GITHUB_REF\"}" \
    $url
fi
