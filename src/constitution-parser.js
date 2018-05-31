
module.exports = class ConstitutionParser {

    constructor() {
        this.structure = {
            type: 'declaration',
            content: [],
        };

        this.tree = [
            this.structure,
        ];
    }

    get current() {
        return this.tree[0];
    }

    get path() {
        return this.tree
            .map(a => a.type)
            .reverse()
            .join('.');
    }

    addLevel(type, extensions) {
        const value = Object.assign({ type, content: [] }, extensions);

        this.current.content.push(value);
        this.tree.unshift(value);

        console.log(`${this.path} > ${extensions.title}`);
    }

    stepBack(expected) {
        if (!expected) {
            this.tree.shift();
            return;
        }

        while (this.tree.length && this.current.type !== expected) {
            this.tree.shift();
        }
    }

    serialize() {
        return JSON.stringify(this.structure, null, 2);
    }

    processElement(element) {
        switch (element.tagName.toLowerCase()) {
            case 'a':
            case 'form':
                return null;

            case 'h4':
                this.current.anchor = element.textContent;
                break;

            case 'p':
                this.processParagraph(element);
                break;

            default:
                console.error(`UNKNOWN TAG NAME "${element.tagName}"`);
        }
    }

    processParagraph(element) {
        const text = element.textContent;

        switch (element.className.toLowerCase()) {

            case 'parrafo':
            case 'parrafo_2':
                this.current.content.push(text);
                break;

            case 'centro_redonda':
                this.stepBack('declaration');
                this.addLevel('preamble', { title: text });
                break;

            case 'centro_negrita':
                this.stepBack('declaration');
                this.addLevel('constitution', { title: text });
                break;

            case 'titulo':
            case 'titulo_num':
                this.stepBack('constitution');
                this.addLevel('title', { title: text });
                break;

            case 'capitulo':
            case 'capitulo_num':
                this.stepBack('title');
                this.addLevel('chapter', { title: text });
                break;

            case 'titulo_tit':
            case 'capitulo_tit':
                this.current.subtitle = text;
                break;

            case 'seccion':
                this.stepBack('chapter');
                const [ title, subtitle ] = text.split('ª');
                console.log('>>>>>> SECCION', title, '|', subtitle)
                this.addLevel('section', { title: `${title}ª`, subtitle });
                break;

            case 'articulo':
                if (this.current.type === 'article') this.stepBack();
                this.addLevel('article', { title: text });
                break;

            case 'firma_rey':
            case 'firma_ministro':
                this.stepBack('declaration');
                this.addLevel('signature', { title: text });
                break;

            default:
                console.error(`UNKNOWN CLASS NAME "${element.className}"`);
        }
    }

}

/*

Object.assign(exports, {
    processElement,
})


function processElement(element) {
    switch (element.tagName.toLowerCase()) {

        case 'h4':
            // return `<div style="text-align: left">${element.textContent}</div>`;

        case 'a':
        case 'form':
            return null;

        case 'p':
            return processParagraph(element);

    }

}

function processParagraph(element) {
    const text = element.textContent;

    switch (element.className.toLowerCase()) {

        case 'parrafo':
        case 'parrafo_2':
            return `${text}`;

        case 'centro_redonda':
            return `## ${text}`;

        case 'centro_negrita':
            return `# ${text}`;

        case 'titulo':
        case 'titulo_num':
            return `## ${text}`;

        case 'titulo_tit':
        case 'capitulo_tit':
            return `**${text}**`;

        case 'capitulo':
        case 'capitulo_num':
            return `### ${text}`;

        case 'seccion':
            return `#### ${text}`;

        case 'articulo':
            return `###### ${text}`;

        case 'firma_rey':
        case 'firma_ministro':
            return `*${text}*`;

    }

    console.error(`UNKNOWN CLASS NAME "${element.className}"`);
}
*/