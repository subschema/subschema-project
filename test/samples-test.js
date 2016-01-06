import React from 'react';
import fixtures from './fixtures';
import generate from '../src/templates';
import {compile, source} from '../src/compile';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import {render} from 'react-dom';
import Subschema, {loader, ValueManager, Form} from 'Subschema';

function into(node, debug) {
    if (debug === true) {
        debug = document.createElement('div');
        document.body.appendChild(debug)
        return render(node, debug);
    }
    return TestUtils.renderIntoDocument(node);
}

function data(sample) {
    if (sample.setupFile) {
        sample.sampleTxt = require('!!raw!./fixtures/' + sample.setupFile);
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

    describe.only('page', function () {
        Object.keys(fixtures).forEach((key)=> {
            var ds = data(fixtures[key]);
            it(`should render page ${key}`, ()=> {
                var blob = generate.page(ds, null, 'text');
                expect(blob).toExist();
            });
            it(`should ${key} should exec`, function () {
                var src = compile(source(ds.sample)).code;
                var f = new Function(['render', 'React', 'Subschema', 'loader', 'Form', 'ValueManager'], src);
                var didRender = false;
                f(function (node) {
                    didRender = true;
                    var r = into(node, true);
                    expect(r).toExist();

                }, React, Subschema, loader, Form, ValueManager);
                expect(didRender).toBe(true);
            });
        });
    });
    describe.skip('project', function () {
        Object.keys(fixtures).forEach((key)=> {
            it(`should create project ${key}`, ()=> {
                var blob = generate.project(data(fixtures[key]));
                expect(blob).toExist();
            });
        });
    })
})