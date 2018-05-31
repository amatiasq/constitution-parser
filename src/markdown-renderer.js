const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');
const render = require('./constitution-markdown-renderer');

const input = process.argv[2];
const output = process.argv[3];
const json = fs.readFileSync(input);
const declaration = JSON.parse(json);
const root = render(output, declaration);
const files = root.getFiles();

Object.keys(files).forEach(route => {
    mkdirp.sync(path.dirname(route));
    fs.writeFileSync(route, files[route]);
});
