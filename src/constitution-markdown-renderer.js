const leftPad = require('left-pad');
const path = require('path');

module.exports = function process(root, entry) {
    if (typeof entry === 'string') {
        return entry;
    }

    const content = entry.content || [];

    if (!entry.subtitle && !content.length) {
        return entry.title;
    }

    const section = new ConstitutionSection(root, entry);

    if (!content.length) {
        return section;
    }

    for (const item of content) {
        section.add(process(section.getChildPath(item.title), item));
    }

    return section;
}

class ConstitutionSection {

    constructor(root, { type, title, subtitle }) {
        this.root = root;
        this.type = type;
        this.title = title;
        this.subtitle = subtitle;
        this.sections = [];
        this.content = [];
    }

    get hasSections() {
        return this.sections.length !== 0;
    }

    getFileName() {
        return this.hasSections
            ? path.join(this.root, 'Index.md')
            : `${this.root}.md`;
    }

    getChildPath(name) {
        const index = this.sections.length;
        const number = leftPad(index + 1, 2, '0');

        return path.join(this.root, `${number}. ${name}`);
    }

    getFiles() {
        const files = {};

        for (const section of this.sections) {
            Object.assign(files, section.getFiles());
        }

        files[this.getFileName()] = this.getFileContent();

        return files;
    }

    get link() {
        const text = this.subtitle
            ? `${this.title}: ${this.subtitle}`
            : this.title;

        return `[${text}](${this.getFileName()})`;
    }

    getIndex() {
        const index = [];

        index.push(`- ${this.link}`);

        for (const section of this.sections) {
            const subIndex = section.getIndex();

            for (const sub of subIndex) {
                index.push(`    ${sub}`);
            }
        }

        return index;
    }

    getFileContent() {
        let wasIndex = false;
        const content = [];

        if (this.title) {
            content.push(`# ${this.title}\n`);
        }

        if (this.subtitle) {
            content.push(`## ${this.subtitle}\n`);
        }

        for (const entry of this.content) {
            if (wasIndex) {
                content.push('');
            }

            if (typeof entry === 'string') {
                content.push(`${entry}\n`);
                continue;
            }

            for (const item of entry.getIndex()) {
                wasIndex = true;
                content.push(item.replace(this.root, '.'));
            }
        }

        return content.join('\n');
    }

    add(value) {
        this.content.push(value);

        if (typeof value !== 'string') {
            this.sections.push(value);
        }
    }

}
