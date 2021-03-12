#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail
set -o noglob

format() {
  deno fmt src
}

check() {
  deno fmt src --check
}

_set_up_dist() {
  set +o noglob
  mkdir -p dist
  cp -r src/static/* dist
  set -o noglob
}

build() {
  _set_up_dist
  yarn run esbuild src/index.ts --bundle --minify --outfile=dist/index.js
}

dev() {
  _set_up_dist

  yarn run esbuild src/index.ts \
    --servedir=dist \
    --bundle \
    --sourcemap \
    --outfile=dist/index.js \
    --serve=localhost:8080
}

test() {
  set +o noglob
  deno test src/*.spec.ts
  set -o noglob
}

(
  cd $(dirname "$0")
  "$@"
)
