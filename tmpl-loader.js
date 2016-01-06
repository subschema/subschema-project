"use strict";

var template = require('lodash/string/template');

/*{ escape: /<%-([\s\S]+?)%>/g,
 evaluate: /<%([\s\S]+?)%>/g,
 interpolate: /<%=([\s\S]+?)%>/g,
 variable: '',
 imports: { _: { escape: [Function: escape] } } }*/
// var t = template('@hello@', { interpolate:/@([\s\S]+?)@/g })
var options = {
    interpolate: /@([\s\S]+?)@/g,
    escape: /@-([\s\S]+?)@/g,
    imports: {
        _: {
            escape: function (value) {
                return JSON.stringify(value, null, 2);
            }
        }
    }
}

module.exports = function (content) {
    this.cacheable && this.cacheable();
    var tmpl = template(content, options);
    return 'var _ = { escape: function (value) {        return JSON.stringify(value, null, 2);} }; module.exports = ' + tmpl.source + ';';
}