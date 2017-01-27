#!/usr/bin/env bash
set -e

source ./scripts/include/node.sh

FILES=("${@}")
if [[ "${#FILES[@]}" = "0" ]]; then
  FILES+=($(
    find \
      test/unit \
      -name "*.ts" -or -name "*.tsx"
  ))
fi

OPTIONS=(
  --compilers ts:ts-node/register
  --require test/env/unit
)

mocha "${OPTIONS[@]}" "${FILES[@]}"
