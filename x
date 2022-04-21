#!/bin/bash

set -o errexit
set -o nounset
set -o pipefail
set -o noglob
set -o xtrace

cmd:copy_static() {
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
  cmd:copy_static
  yarn run esbuild src/lib.ts src/demo.ts --bundle --minify --outdir=dist
}

_stop_fswatch() {
  kill $FSWATCH_PID
}

cmd:dev() {
  cmd:copy_static


  trap _stop_fswatch ERR
  fswatch -o src/static | xargs -n1 ./x copy_static &
  FSWATCH_PID=$!

  yarn run esbuild src/lib.ts src/demo.ts \
    --servedir=dist \
    --bundle \
    --sourcemap \
    --outdir=dist \
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
  git branch -D built || true
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
