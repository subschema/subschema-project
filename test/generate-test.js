import expect from 'expect';
import generate from '../src/templates/project';


describe('generate', function() {
    this.timeout(20000);
    it('should generate a zip', e=> {
        var blob = generate({
            schema: {},
            title: 'Hello',
            demo: 'what',
            jsName: 'uhhuh',
            setupTxt: 'Setup Text',
            project: {
                name: 'hello'
            }
        }, void(0), "blob");

        expect(blob).toExist("should return a blob");

    });
});