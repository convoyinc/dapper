#!/usr/bin/env bash
set -e

source ./scripts/include/node.sh

OPTIONS=()
if [[ "${CIRCLE_BUILD_NUM}" == "" ]]; then
  OPTIONS+=(--progress)
fi

webpack \
  --config ./webpack.config.ts \
  "${OPTIONS[@]}"
