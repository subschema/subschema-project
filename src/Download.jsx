"use strict";
import React, {Component} from 'react';
import JSZip from 'jszip';
import {saveAs} from 'browser-filesaver';
import generate from './generate';
import {PropTypes} from 'Subschema';


export default class Download extends Component {
    static propTypes = {
        downloadAs: PropTypes.oneOf(Object.keys(generate)),
        fileName: PropTypes.string,
        data: PropTypes.listener,
        onError: PropTypes.func
    };

    static defaultProps = {
        downloadAs: 'page',
        data: "..",
        onError(e){
            if (e) {
                alert(`Error: ${e.message}`);
            }
        }
    };

    constructor(...args) {
        super(...args);
        this.state = {};

    }

    handleClick = e => {
        e && e.preventDefault();
        if (this.state.busy) return;
        this.setState({busy: true});
        this.props.onError(null);
        var {fileName, data, downloadAs, templates} = this.props;
        var ext = downloadAs === 'page' ? 'html' : 'zip';
        if (!fileName) {
            fileName = `${downloadAs}.${ext}`;
        } else {
            fileName = `${fileName}.${ext}`;
        }
        try {
            var blob = generate(data, downloadAs, ext + '-blob');
            saveAs(blob, fileName);
        } catch (e) {
            console.log('error saving', e);
            this.props.onError(e);
        } finally {
            this.setState({busy: false});
        }
    };

    render() {
        return <button onClick={this.handleClick}
                       className={this.state && this.state.busy ? 'download-busy' : 'download-not-busy' }>
            {this.props.downloadAs === 'project' ?  'Project' :  'Page'}
        </button>
    }
}
