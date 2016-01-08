"use strict";

import samples from '../samples';
import project from './src/templates/project';
import path from 'path';
import fs from 'fs';
import mkdirp from 'mkdirp';

function help(error) {
    var code = 0;
    if (error) {
        code = 1;
        console.error(`ERROR: ${error}`);
    }
    console.error(`
Subschema Project Setup
-----------------------
\v-h\t--help\t\tThis helpful message
\v-t\t--template\t\tWhat to use as default template (Basic).
\v-l\t\--list\t\tLists available templates.
\v\t\t\--force\t\tOverride existing files without asking (dangerous).
`);
    process.exit(code);
}

function list() {
    console.log(Object.keys(samples).map(v=> {
        return `\v${v}\t-\t${samples[v].description}`;
    }).join('\n'));

    process.exit(0);
}

function handleArgs(args) {
    if (args.length === 0) {
        return help();
    }
    var sample = samples['Basic'];
    var wf = safeWriteFile;
    for (var i = 0, l = args.length; i < l; i++) {
        var arg = args[i];
        if (/^-h|--help$/.test(arg)) return help();
        if (/^-l|--list$/.test(arg)) return list();
        if (/--force$/.test(arg)) {
            wf = writeFile;

        } else if (/^(-t|--template(=.*)?)$/.test(arg)) {
            var key = arg.split('=', 2)[1] || args[++i];
            sample = samples[key];
            if (!config) {
                help(`Invalid Project Template: "${key}"`)
            }
        } else {
            help(`Unknown option "${arg}"`)
        }
    }

    project(safeWriteFile, {
        project: {},
        sample
    })

}
function _writeFile(fullpath, content, options) {
    mkdirp.sync(path.dirname(fullpath));
    fs.writeFileSync(fullpath, content, 'utf-8');
}

function writeFile(filename, content, options) {
    _writeFile(path.join(process.cwd(), filename), content, options);
}

function safeWriteFile(filename, content, options) {
    var fullpath = path.join(process.cwd(), filename);
    try {
        fs.accessSync(fullpath, fs.F_OK)
        console.warn(`will not overwrite existing file ${fullpath}`);
        return;
    }
    catch (e) {
        //if the file isn't there, we'll make it
    }
    _writeFile(fullpath, content, options);

}

function readPkg() {
    try {
        var pkg = require('./package.json')
    } catch (e) {
        help('No package.json found, consider running "npm init" to create one ');
    }
    return pkg;
}

if (require.main === module) {
    handleArgs(process.argv.slice(2));

} else {
    module.exports = handleArgs;
}
