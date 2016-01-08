#!/usr/bin/env node
"use strict";

import project from 'fixtures';

function help(error) {
    if (error) {
        console.error(`ERROR: ${error}`);
    }
    console.error(`
Subschema Project Setup
-----------------------
-h\t--help\t\tThis helpful message
-t\t--template\t\tWhat to use as default template (Basic).
-l\t\--list\t\tLists available templates.
`);
    if (error) {
        return process.exit(1);
    }
    process.exit(0);
}

function list() {
    console.log(Object.keys(project).map(v=> {
        return `${v}\t${project[v].description}`;
    }).join('\n'));

    process.exit(0);
}

function handleArgs(args) {
    var config;

    for (var i = 0, l = args.length; i < l; i++) {
        var arg = args[i];
        if (/^-h|--help$/.test(arg)) help();
        if (/^-l|--list$/.test(arg)) list();
        if (/^(-t|--template(=.*)?)$/.test(arg)) {
            var key = arg.split('=', 2)[1] || args[++i];
            config = project[key];
            if (!config) {
                help(`Invalid Project Template: "${key}"`)
            }
        }
    }
    return config || project['Basic'];

}

if (require.main === module) {
    handleArgs(process.argv.slice(2));
} else {
    module.exports = handleArgs;
}
