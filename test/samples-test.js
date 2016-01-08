import React from 'react';
import ReactDOM from 'react-dom';
import fixtures from '../samples';
import generate from '../src/generate';
import {compile, source} from '../src/compile';
import project from '../src/templates/project/index';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import {render} from 'react-dom';
import JSZip from 'jszip';
import Subschema, {loader, loaderFactory,DefaultLoader,ValueManager,decorators, Form} from 'Subschema';

function mockRequire(mod) {
    if (mod == 'react') {
        return React;
    }
    if (mod == 'react-dom') {
        return ReactDOM;
    }
    if (mod == 'Subschema') {
        return Subschema;
    }
    if (window && window[mod]) {
        return window[mod];
    }
    throw new Error(`Unknown module "${mod}"`)
};
var oloader = loader;
var {provide} = decorators;
function into(node, debug) {
    if (debug === true) {
        debug = document.createElement('div');
        document.body.appendChild(debug)
        return render(node, debug);
    }
    return TestUtils.renderIntoDocument(node);
}

function execMock(gen) {
    var exports = {};
    new Function(['exports', 'require'], gen.code)(exports, mockRequire);
    return exports.default;
}
function data(fix) {
    var {setupFile, ...sample} = fix;

    if (setupFile) {
        sample.setupTxt = require('!!raw!../samples/' + setupFile);
    }

    return {
        schema: {},
        title: 'Hello',
        demo: 'what',
        jsName: 'uhhu',
        project: {
            name: 'hello'
        },
        sample
    }
}
describe('samples', function () {
    var currentLoader;
    this.timeout(50000);
    beforeEach(done=> {
        currentLoader = provide.defaultLoader = loaderFactory([DefaultLoader]);
        done();
    });

    afterEach(done=> {
        currentLoader = provide.defaultLoader = oloader;
        done()
    });

    describe('page', function () {
        Object.keys(fixtures).forEach((key)=> {
            var ds = data(fixtures[key]);

            it(`should render "${key}"`, ()=> {
                var blob = generate(ds, 'page', 'string');
                expect(blob).toExist();
            });

            it(`should execute "${key}"`, function () {
                var src = compile(source(ds.sample)).code;

                var f = new Function(['render', 'React', 'Subschema', 'loader', 'Form', 'ValueManager', 'document'], src);
                var didRender = false;
                f(function (node) {
                    didRender = true;
                    var r = into(node, true);
                    expect(r).toExist();
                }, React, Subschema, currentLoader, Form, ValueManager, {
                    getElementById(id){
                        expect(id).toBe('content');
                    }
                });
                expect(didRender).toBe(true);
            });
        });
    });
    describe('project', function () {
        Object.keys(fixtures).forEach((key)=> {
            it(`should create "${key}"`, ()=> {
                var blob = generate(data(fixtures[key]), 'project', 'zip-base64');
                expect(blob).toExist();

                var unzip = new JSZip(blob, {base64: true});
                expect(unzip).toExist();

                Object.keys(project).forEach((key)=> {
                    expect(unzip.file(key)).toExist(`expected ${key} to Exist`);
                });

                var App = unzip.file("public/App.jsx").asText();
                expect(App).toExist();

                var gen = compile(App);
                expect(gen).toExist();

                var Component = execMock(gen);
                expect(Component).toExist('Component should be returned');
            });
        });
    })
})