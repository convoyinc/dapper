#!/usr/bin/env bash

(( __NODE_INCLUDED__ )) && return
__NODE_INCLUDED__=1

if [[ ! -f ./.nvmrc ]]; then
  echo ".nvmrc is missing from the repo root (or paths are screwed up?)"
  exit 1
fi

CURRENT_NODE_VERSION=$(node --version 2> /dev/null || echo 'none')
DESIRED_NODE_VERSION=v$(cat ./.nvmrc)
if [[ "${CURRENT_NODE_VERSION}" != "${DESIRED_NODE_VERSION}" ]]; then
  echo "Wrong node version. Found '${CURRENT_NODE_VERSION}', expected '${DESIRED_NODE_VERSION}'"
  exit 1
fi

export PATH=$(npm bin):$PATH
