"use strict";

import samples from '../samples';

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
    var config = samples['Basic'];

    for (var i = 0, l = args.length; i < l; i++) {
        var arg = args[i];
        if (/^-h|--help$/.test(arg)) return help();
        if (/^-l|--list$/.test(arg)) return list();
        if (/^(-t|--template(=.*)?)$/.test(arg)) {
            var key = arg.split('=', 2)[1] || args[++i];
            config = samples[key];
            if (!config) {
                help(`Invalid Project Template: "${key}"`)
            }
        } else {
            help(`Unknown option "${arg}"`)
        }
    }

    return config;

}

if (require.main === module) {
    handleArgs(process.argv.slice(2));
} else {
    module.exports = handleArgs;
}
