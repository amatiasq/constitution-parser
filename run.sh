#!/usr/bin/env bash

JSON_DIR=json
MARKDOWN_DIR=constituciones

if [ -d "$JSON_DIR" ]
then
    rm -r "$JSON_DIR"
fi

mkdir "$JSON_DIR"
node ./src/parse-html.js ./fuente/1978.html ${JSON_DIR}/1978.json
node ./src/parse-html.js ./fuente/1992.html ${JSON_DIR}/1992.json
node ./src/parse-html.js ./fuente/2011.html ${JSON_DIR}/2011.json

if [ -d "$MARKDOWN_DIR" ]
then
    rm -r "$MARKDOWN_DIR"
fi

node ./src/markdown-renderer.js ./json/1978.json ${MARKDOWN_DIR}/1978
node ./src/markdown-renderer.js ./json/1992.json ${MARKDOWN_DIR}/1992
node ./src/markdown-renderer.js ./json/2011.json ${MARKDOWN_DIR}/2011
