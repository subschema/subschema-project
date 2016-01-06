"use strict";
import React, {Component} from 'react';
import Subschema, {loader, ValueManager, Form} from 'Subschema';
import projectLoader from 'subschema-project';
import JSONArea from './JSONArea';
import ListenerProperty from '../test/fixtures/ListenerProperty';
import ListenerPropertySetup from '!!raw!../test/fixtures/ListenerProperty-setup';

ListenerProperty.setupTxt = ListenerPropertySetup;

loader.addLoader(projectLoader);
loader.addType({JSONArea})
//A simple Schema for this configuration
var schema = {
    schema: {
        schema: {
            type: 'Object'
        },
        title: {
            type: 'Text'
        },
        demo: {
            type: 'Text'
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
        project: {
            type: 'Object',
            subSchema: {
                schema: {
                    name: {
                        type: 'Text'
                    }
                }
            }
        },
        download: {
            type: 'Download',
            downloadAs: 'project',
            help: 'Download as a project (.zip)'
        },
        page: {
            type: 'Download',
            downloadAs: 'page',
            help: 'Download as a project (.html)'
        }
    }
}

var valueManager = ValueManager({
    schema: {},
    title: 'Hello',
    demo: 'what',
    jsName: 'uhhu',
    project: {
        name: 'hello'
    },
    sample: ListenerProperty
});

export default class App extends Component {

    render() {
        return <div>
            <h3>Subschema Project Setup</h3>
            <Form schema={schema} loader={loader} valueManager={valueManager}/>
        </div>
    }
}
