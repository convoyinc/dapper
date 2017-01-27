#!/usr/bin/env bash
set -e

npm run test:style
npm run compile
npm run test:unit
