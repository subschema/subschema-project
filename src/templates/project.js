"use strict";

import JSZip from 'jszip';
import templates from './project';
import {source} from '../compile';

export default function (data, keys = Object.keys(templates), type = "blob") {
    var zip = new JSZip(), scripts = data.scripts || (data.scripts = {});
    scripts.form = source(data.sample, data.useData, data.useError, null);
    keys.forEach(function (key) {
        if (key == 'public/App.jsx') return;
        var content = templates[key](data)
        zip.file(key, content);
    });
    return zip.generate({type});
}