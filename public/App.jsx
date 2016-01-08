"use strict";
import React, {Component} from 'react';
import Subschema, {loader, ValueManager, Form} from 'Subschema';
import JSONArea from './JSONArea';
import samples from '../samples';
import camelCase from 'lodash/string/camelCase';
import kebabCase from 'lodash/string/kebabCase';


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
                    props: 'JSONArea',
                    data: 'JSONArea',
                    errors: 'JSONArea',
                    setupFile: 'Text',
                    setupTxt: 'TextArea'
                }
            }
        },
        /*        download: {
         type: 'Download',
         downloadAs: 'project',
         help: 'Download as a project (.zip)'
         },
         page: {
         type: 'Download',
         downloadAs: 'page',
         help: 'Download as a project (.html)'
         }*/
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
            sampleTxt: '',
            props: null,
            data:{},
            errors:{}
        }
    }
    if (sample.setupFile) {
        this.update('sample.setupTxt', require('!!raw!../samples/' + sample.setupFile));
    }
    this.update('jsName', value);
    this.update('project.name', 'example-' + kebabCase(sample.name || value));
    this.update('project.description', sample.description);
    this.update('project.version', '1.0.0');
    Object.keys(sample).forEach(k=>this.update(`sample.${k}`, sample[k]));

}, valueManager, true);

export default class App extends Component {
    handleBtnClick = (e, action)=> {
        e && e.preventDefault();
        console.log('action', e.action);
    }

    render() {
        return <div>
            <h3>Subschema Project Setup</h3>
            <Form schema={schema} loader={loader} valueManager={valueManager} onButtonClick={this.handleBtnClick}/>
        </div>
    }
}
