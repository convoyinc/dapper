#!/usr/bin/env bash
set -e

source ./scripts/include/node.sh

OPTIONS=(
  --config ./webpack.config.ts
  --port 3010
  --progress
  --quiet
)

NO_OPEN=no
for arg in "${@}"; do
  if [[ "${arg}" = "no-open" ]]; then
    NO_OPEN=yes
  fi
done

# We open the browser by default
if [[ "${NO_OPEN}" = "no" ]]; then
  OPTIONS+=(--open)
fi

webpack-dev-server "${OPTIONS[@]}"
