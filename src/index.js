"use strict";
import {loaderFactory} from 'Subschema';
import Download from './Download';

var loader = loaderFactory();

loader.addType({
    Download
});

export default loader;