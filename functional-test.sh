#!/bin/sh -eu

npm pack
mv *.tgz functional-test/
(
  cd functional-test &&
  npm i --no-save *.tgz &&
  rm *.tgz &&
  npm test
)
