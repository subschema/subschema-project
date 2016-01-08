import React from 'react';
import fixtures from '../samples';
import generate from '../src/generate';
import {compile, source} from '../src/compile';
import project from '../src/templates/project/index';
import expect from 'expect';
import TestUtils from 'react-addons-test-utils';
import JSZip from 'jszip';
import support, {into, renderPage, execMock, testEachSample} from './support';

describe('samples', function () {
    this.timeout(50000);

    describe('page', function () {
        testEachSample((ds, sample)=> {
            it(`should render "${sample}"`, ()=> {
                var blob = generate(ds, 'page', 'string');
                expect(blob).toExist();
            });

            it(`should execute "${sample}"`, ()=> {
                renderPage(ds, (node)=> {
                    var r = into(node, true);
                    expect(r).toExist();
                });
            })
        });
    });

    describe('project', function () {
        testEachSample((ds, sample)=> {
            it(`should create "${sample}"`, ()=> {
                var blob = generate(ds, 'project', 'zip-base64');
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
    });
});