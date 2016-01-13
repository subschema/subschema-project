import React, {DOM} from 'react';
import App from '../public/App.jsx';
import expect from 'expect';
import support, {into} from './support';
import TestUtils, {scryRenderedComponentsWithType as withType, scryRenderedDOMComponentsWithTag as withTag, Simulate} from 'react-addons-test-utils';

var {click, change} = Simulate;
describe.only('App', function () {
    this.timeout(50000);
    /* it('should render app', (done)=> {
     var b, f;

     function saveAs(blob, filename) {
     expect(blob).toExist();
     expect(filename).toExist();
     b = blob;
     f = filename;
     }

     var app = into(<App saveAs={saveAs}/>, true);
     expect(app).toExist('should have rendered app')
     var buttons = withTag(app, 'button');
     var select = withTag(app, 'select')[0];

     expect(select).toExist('should have a select');

     expect(buttons.length).toBe(2, 'should find 2 buttons');

     click(buttons[0]);

     expect(b).toExist('should have blob');

     expect(f).toExist('should have filename');

     var url = URL.createObjectURL(b);


     var other = window.open(url);
     other.onload = function () {
     other.close();
     done();
     };
     other.onerror = function (e) {
     done(e);
     };
     });*/
    describe('options', function () {
        var b, f;

        function saveAs(blob, filename) {
            expect(blob).toExist();
            expect(filename).toExist();
            b = blob;
            f = filename;
        }

        var app = into(<App saveAs={saveAs}/>, true);
        var buttons = withTag(app, 'button');
        var select = withTag(app, 'select')[0];
        var options = withTag(app, 'option').map(v=>v.value);

        options.forEach(function (value) {
            it(`should change the option  ${value}`, function () {
                change(select, {
                    target: {
                        value
                    }
                });
            });
            it(`should download page ${value}`, function (done) {
                click(buttons[0]);

                expect(b).toExist('should have blob');

                expect(f).toExist('should have filename');

                var url = URL.createObjectURL(b), other = window.open(url);

                var err;
                other.onerror = function (e) {
                    console.log('errror for ', value, e);
                    err = e;
                    done(err);
                }

                other.addEventListener("DOMContentLoaded", (e)=> {
                    console.log('content loaded for ', value, e);
                    setTimeout(()=> {
                        if (!err) {
                            other.close();
                        } else {
                            done();
                        }
                    }, 500);
                }, false);


            });
        });
    })
})
;

