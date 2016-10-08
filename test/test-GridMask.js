var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('assert');

var GridMask = require('../src/GridMask');

function isGridMask(m) {
    return m.width && m.height && m.get && m.set;
}

describe('GridMask', function() {

    function gen(width, height, interior, exterior) {
        return new GridMask(width, height, {
            interior: interior,
            exterior: exterior
        });
    }

    it('should throw for an invalid size', function() {
        assert.throws(function() { gen(-1, 10); });
        assert.throws(function() { gen(10, -1); });
    });

    it('should return a maze of the given size', function() {
        var m1 = gen(20, 20);
        assert.ok(isGridMask(m1));
        assert.equal(20, m1.width());
        assert.equal(20, m1.height());

        var m2 = gen(3, 17);
        assert.ok(isGridMask(m2));
        assert.equal(3, m2.width());
        assert.equal(17, m2.height());
    });

    it('can make an empty grid', function() {
        assert.ok(isGridMask(gen(0, 100)));
        assert.ok(isGridMask(gen(100, 0)));
    });

    it('should initialize the interior to false by default', function() {
        var m1 = gen(15, 5);
        for (var y = 0 ; y < m1.height(); y ++) {
            for (var x = 0; x < m1.width(); x ++) {
                assert.equal(m1.get(x, y), false);
            }
        }
    });

    it('should initialize the interior to true if requested', function() {
        var m1 = gen(15, 5, true);
        for (var y = 0 ; y < m1.height(); y ++) {
            for (var x = 0; x < m1.width(); x ++) {
                assert.equal(m1.get(x, y), true);
            }
        }
    });

    it('should have the exterior set to false by default', function() {
        var m1 = gen(15, 5);
        assert.equal(m1.get(-1, -1), false);
        assert.equal(m1.get( 1, -1), false);
        assert.equal(m1.get(-1,  1), false);
        assert.equal(m1.get(15, -1), false);
        assert.equal(m1.get( 5,  5), false);
    });

    it('should have the exterior set to true if requested', function() {
        var m1 = gen(15, 5, null, true);
        assert.equal(m1.get(-1, -1), true);
        assert.equal(m1.get( 1, -1), true);
        assert.equal(m1.get(-1,  1), true);
        assert.equal(m1.get(15, -1), true);
        assert.equal(m1.get( 5,  5), true);
    });

    describe('#set()', function() {

        it('should change the value at the given cell', function() {
            var m1 = gen(7, 9);
            m1.set(3, 4, true);
            assert.equal(m1.get(3, 4), true);
            assert.equal(m1.get(4, 3), false);
            m1.set(3, 4, false);
            assert.equal(m1.get(3, 4), false);
        });

        it('should throw for exterior cells', function() {
            var m1 = gen(9, 7);
            assert.throws(function() { m1.set(-1, -1, true); });
            assert.throws(function() { m1.set( 1, -1, false); });
            assert.throws(function() { m1.set(-1,  1, true); });
            assert.throws(function() { m1.set( 3,  7, false); });
            assert.throws(function() { m1.set( 9,  3, true); });
            assert.throws(function() { m1.set( 9,  7, false); });
        });

    }); // #set()

}); // GridMask
