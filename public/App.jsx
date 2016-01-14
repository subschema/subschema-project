"use strict";
import React, {Component} from 'react';
import Subschema, {loader, ValueManager,PropTypes, Form} from 'Subschema';
import JSONArea from './JSONArea';
import samples from 'subschema-test-support/samples';
import camelCase from 'lodash/string/camelCase';
import kebabCase from 'lodash/string/kebabCase';
import generate from '../src/generate';
import {saveAs} from 'browser-filesaver';

/*import projectLoader from 'subschema-project';
 loader.addLoader(projectLoader);*/
loader.addType({JSONArea})
//A simple Schema for this configuration
var schema = {
    schema: {
        samples: {
            type: 'Select',
            options: Object.keys(samples),
            placeholder: 'Custom Project'
        },
        jsName: {
            type: "Text",
            help: 'A javascript friendly version of your project name'
        },
        project: {
            type: 'Object',
            subSchema: {
                schema: {
                    name: {
                        type: 'Text',
                        help: "NPM package name"
                    },
                    version: {
                        type: 'Text',
                        help: "NPM pacakge version"
                    }
                }
            }
        },

        sample: {
            type: 'Object',
            subSchema: {
                schema: {
                    description: 'Text',
                    schema: 'JSONArea',
                    props: {
                        type:'JSONArea',
                        name:'sample_props'
                    },
                    data: 'JSONArea',
                    errors: 'JSONArea',
                    setupFile: 'Text',
                    setupTxt: 'TextArea'
                }
            }
        }
    },
    fieldsets: [{
        fields: ['samples', 'jsName', 'project', 'sample'],
        buttons: [

            {
                label: 'Page',
                className: 'btn',
                action: 'page'
            }, {
                label: 'Project',
                className: 'btn',
                action: 'project'
            }, {
                label: 'Open Page',
                className: 'btn',
                action: 'page-open'
            }]
    }]
};

var valueManager = ValueManager({
    schema: {},
    title: 'Hello',
    demo: 'what',
    jsName: 'uhhu',
    project: {
        name: 'hello'
    },
    samples: 'Basic'
});

valueManager.addListener('samples', function (value) {
    var sample = samples[value];
    if (!sample) {
        sample = {
            schema: {},
            setupTxt: '',
            props: null,
            data: {},
            errors: {},
            description: ''
        }
    }
    var {...copy } = sample;
    this.update('sample', null);
    this.update('jsName', value);
    this.update('project.name', 'example-' + kebabCase(copy.name || value));
    this.update('project.description', copy.description);
    this.update('project.version', '1.0.0');
    Object.keys(copy).forEach(k=>this.update(`sample.${k}`, copy[k]));

}, valueManager, true);

export default class App extends Component {
    static defaultProps = {
        saveAs: saveAs
    }
    handleBtnClick = (e, action)=> {
        e && e.preventDefault();
        console.log('action', e.action);
        var type = action === 'project' ? 'zip-blob' : 'html-blob';
        var ext = action === 'project' ? 'zip' : 'html';
        var filename = valueManager.path('project.name');
        filename = `${filename}.${ext}`;

        var blob = generate(valueManager.getValue(), action == 'project' ? 'project' : 'page', type)
        if (action === 'page-open') {
            var url = URL.createObjectURL(blob), other = window.open(url);
            return;
        }
        try {
            this.props.saveAs(blob, filename);
        } catch (err) {
            console.log(err);
            alert('Error saving ' + err.message);
        }
    };

    render() {
        return <div>
            <h3>Subschema Project Setup</h3>
            <Form schema={schema} loader={loader} valueManager={valueManager} onButtonClick={this.handleBtnClick}/>
        </div>
    }
}
