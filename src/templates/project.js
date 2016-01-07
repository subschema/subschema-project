"use strict";

import JSZip from 'jszip';
import templates from './project/index';
import {source} from '../compile';

export default function (data, type = "blob") {
    var zip = new JSZip(), scripts = data.scripts || (data.scripts = {});
    scripts.form = source(data.sample, data.useData, data.useError, null);
    Object.keys(templates).forEach(function (key) {
        var content = templates[key](data)
        zip.file(key, content);
    });
    return zip.generate({type});
}