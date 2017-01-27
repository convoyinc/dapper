#!/usr/bin/env bash
set -e

source ./scripts/include/node.sh

FILES=("${@}")
if [[ "${#FILES[@]}" = "0" ]]; then
  FILES+=($(
    find \
      scripts src test typings \
      -name "*.ts" -or -name "*.tsx"
  ))
fi

OPTIONS=(
  --format codeFrame
)

tslint "${OPTIONS[@]}" "${FILES[@]}"
