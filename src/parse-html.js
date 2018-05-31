const fs = require('fs');
const { JSDOM } = require('jsdom');
const ConstitutionParser = require('./constitution-parser');
const html = fs.readFileSync(process.argv[2]);

const dom = new JSDOM(html).window.document;
const constitution = new ConstitutionParser()

const root = dom.querySelector('#textoxslt');

[...root.children]
    .slice(1)
    .forEach(entry => constitution.processElement(entry));

fs.writeFileSync(process.argv[3], constitution.serialize());
