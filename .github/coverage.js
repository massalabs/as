let color = "red";

const coverage = parseInt(process.env.COVERAGE);

if (coverage >= 80) {
    color = "green";
} else if (coverage >= 70) {
    color = "orange";
}

const fs = require('fs');

const content = fs.readFileSync('README.md', 'utf8');
const lines = content.split('\n');

const match = lines[1].match(/coverage-(\d{1,3})%/);
const oldCoverage = match ? parseInt(match[1]) : null;

if (oldCoverage != coverage || !oldCoverage) {
  console.log('updating badge');

  const response = await github.repos.getContent({
    owner: context.repo.owner,
    repo: context.repo.repo,
    path: 'README.md',
    ref: context.ref
  });

  lines[1] = `![check-code-coverage](https://img.shields.io/badge/coverage-${coverage}%25-${color})\n`;;
  await github.repos.createOrUpdateFileContents({
    owner: context.repo.owner,
    repo: context.repo.repo,
    path: 'README.md',
    message: 'Update README',
    content: Buffer.from(lines.join('\n')).toString('base64'),
    sha: response.data.sha,
    branch: context.ref
  });
}