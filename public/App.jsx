"use strict";
import gf from './global-fix';
import React, {Component} from 'react';
import Subschema, {loader, ValueManager,PropTypes,resolvers, Form} from 'Subschema';
import JSONArea from './JSONArea';
import samples from 'subschema-test-support-samples';
import camelCase from 'lodash/string/camelCase';
import kebabCase from 'lodash/string/kebabCase';
import generate from '../src/generate';
import {saveAs} from 'browser-filesaver';
import DownloadButton from '../src/components/DownloadButton.jsx';
import ExportButtons from '../src/components/ExportButtons.jsx';
resolvers.type.defaultPropTypes.defaultValue = PropTypes.expression;

loader.addType({JSONArea, ExportButtons});
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
            title: 'JavaScript Variable Name',
            help: 'A javascript friendly version of your project name'
        },
        userOrOrg: {
            type: "Text",
            title:"Username or organization",
            help: "Username or organization to publish module"
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
                        help: "NPM package version"
                    },
                    repository: {
                        type: 'Text',
                        defaultValue: "https://github.com/{userOrOrg}/{project.name}"
                    },
                    "publishConfig": {
                        type: 'Object',
                        subSchema: {
                            "registry": {
                                type: "Text",
                                defaultValue: "https://registry.npmjs.org"
                            }

                        }
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
                        type: 'JSONArea',
                        name: 'sample_props'
                    },
                    data: 'JSONArea',
                    errors: 'JSONArea',
                    setupTxt: 'TextArea'
                }
            }
        },
        downloadBtn: {
            type: "ExportButtons",
            template: false
        }
    },
    "template": "WizardTemplate",
    "fieldsets": [{
        legend: "Choose a base sample",
        fields: "samples,userOrOrg"
    }, {
        legend: "Project",
        fields: "project"
    }, {
        legend: "Download",
        fields: "downloadBtn",
        buttons: [{
            action: "previous",
            label: "Previous"
        }]
    }]
};

var valueManager = ValueManager({
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
    };

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
