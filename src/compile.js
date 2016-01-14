"use strict";

import ReactDom from "react-dom";
import Babel, {availablePlugins, transform} from "babel-standalone";
import {tutils} from 'Subschema';
import transformLegacy from "babel-plugin-transform-decorators-legacy";
const {each} = tutils;
availablePlugins['transform-decorators-legacy'] = transformLegacy;
import formTmpl from './form.tmpl';

const babelrc = {
    "presets": [
        "react",
        "es2015",
        "stage-0"
    ],
    "plugins": [
        "transform-decorators-legacy"
    ]
};


export function stringify(name, obj) {

    var str = !obj ? 'null' : typeof obj === 'string' ? obj : JSON.stringify(obj, null, '\t');
    return `var ${name} = ${str};`;
}

export function source(managed, useData, useError, template = formTmpl) {
    var {schema, setup, setupTxt, props, data, errors} = managed;
    var valProps = {
        schema: schema,
        value: useData ? data : {},
        errors: useError ? errors : null
    }
    props = props || {};
    schema = schema || {};

    var propStr = [], vars = [];

    Object.keys(valProps).forEach(function (v) {
        if (!valProps[v] || props[v]) {
            return;
        }
        vars.push(stringify(v, valProps[v]));
        propStr.push(`${v}={${v}}`);
    });

    each(props, (val, v)=> {
        if (val == true) val = v;
        else val = JSON.stringify(val);
        propStr.push(`${v}={${val}}`);
    });

    var codeText = template ? template({
        setupTxt,
        propStr: propStr.join(' '),
        vars: vars.join('\n')
    }) : {
        setupTxt,
        propStr: propStr.join(' '),
        vars: vars.join('\n')
    };
    return codeText;

}

export function compile(src) {
    return transform(src, babelrc);
}

export function toFunc(transpiled) {
    return new Function(['render', 'React', 'Subschema', 'loader', 'Form', 'ValueManager', 'document'], transpiled.code);

}