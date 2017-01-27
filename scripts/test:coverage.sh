#!/usr/bin/env bash
set -e

TEST_TYPE="${1}"
EXTRA_ARGS=("${@:2}")
if [[ "${TEST_TYPE}" == "" ]]; then
  echo "Usage: npm run test:coverage unit"
  exit 1
fi

source ./scripts/include/node.sh

nyc \
  --require ts-node/register \
  --extension .ts \
  --include src/ \
  --exclude dist/ \
  --exclude typings/ \
  --all \
  --reporter html \
  --reporter lcov \
  --report-dir coverage/"${TEST_TYPE}" \
  npm run test:"${TEST_TYPE}" \
  "${EXTRA_ARGS[@]}"

if [[ "${CIRCLE_TEST_REPORTS}" == "" ]]; then
  open ./coverage/"${TEST_TYPE}"/index.html
else
  codecov --file=./coverage/"${TEST_TYPE}"/lcov.info
fi
