"use strict";

import indexTmpl from './page/index.html.tmpl';
import {source, compile} from '../compile';

export default function (data, keys, type = "blob") {

    var scripts = data.scripts || (data.scripts = {});
    var src = scripts.source = `
"use strict";
import React, {Component} from "react";
import Subschema,{Form, loader, valueManager, loaderFactory} from "Subschema";
import {render} from "react-dom";

${source(data.sample, data.useData, data.useError)}
    `;
    scripts.compiled = compile(src).code;
    var content = indexTmpl(data);
    return type === "blob" ? new Blob([content], {type: "text/html;charset=utf-8"}) : content;
}