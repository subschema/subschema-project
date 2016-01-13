import React, {DOM, Component} from 'react';
import ReactDOM from 'react-dom';
import expect from 'expect';
import {renderIntoDocument, scryRenderedComponentsWithType as withType, scryRenderedDOMComponentsWithTag as withTag} from 'react-addons-test-utils';

function into(node, debug) {
    debug = document.createElement('div');
    document.body.appendChild(debug)
    return ReactDOM.render(node, debug);
}

class App extends Component {
    render() {
        return <form>
            <button>Hello</button>
            <input name="props"/>
        </form>
    }
}

describe.skip('form test', function () {

    it('should find button', function () {

        var f = into(<App/>, true);
        expect(withTag(f, 'button')[0]).toExist();

    });

});