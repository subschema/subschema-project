import expect from 'expect';
import {compile, source} from  '../src/compile';
import ListenerPropertySetup from '!raw!!./fixtures/ListenerProperty-setup.js';
import ListenerProperty from './fixtures/ListenerProperty.js';

describe('compile', function () {

    it('should compile an example', function () {
        ListenerProperty.setupTxt = ListenerPropertySetup;
        //schema = {}, setup = "", setupTxt = "", props = {}, data = {}, errors = {}
        var src = source(ListenerProperty);

        var transpiled = compile(src);
        console.log(transpiled.code);
    });
});