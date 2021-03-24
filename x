#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail
set -o noglob

_set_up_dist() {
  set +o noglob
  mkdir -p dist
  cp -r src/static/* dist
  set -o noglob
}

cmd:format() {
  deno fmt src
}

cmd:check() {
  deno fmt src --check
}

cmd:build() {
  _set_up_dist
  yarn run esbuild src/index.ts --bundle --minify --outfile=dist/index.js
}

cmd:dev() {
  _set_up_dist

  yarn run esbuild src/index.ts \
    --servedir=dist \
    --bundle \
    --sourcemap \
    --outfile=dist/index.js \
    --serve=localhost:8080
}

cmd:test() {
  set +o noglob
  deno test src/*.spec.ts
  set -o noglob
}

cmd:publish() {
  cmd:check
  cmd:build
  git branch -D built
  git checkout -b built main
  cp -r dist docs
  echo 'vector.demo.camp' > docs/CNAME
  git add docs
  git commit -m 'Add built copy'
  git push -f origin built
  git checkout main
}

(
  cd $(dirname "$0")
  "cmd:$@"
)
