"use strict";

import templates from './project/index';
import {source} from '../compile';

export default function (writeFile, data, type = "blob") {
    var scripts = data.scripts || (data.scripts = {});
    scripts.form = source(data.sample && data.sample.schema || data.sample || data.schema, data.useData, data.useError, null);
    return Promise.all(Object.keys(templates).map(function (key) {
        var content = templates[key](data)
        return writeFile(key, content);
    }));
}