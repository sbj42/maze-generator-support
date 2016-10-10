var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('assert');

var Maze = require('../src/Maze');
var dirs = require('../src/directions');

function isMaze(m) {
    return m.width && m.height && m.cell && m.getPassage && m.setPassage;
}
function isCell(c) {
    return c.north && c.east && c.south && c.west;
}
function cellPassageCount(c) {
    return (c.north() ? 1 : 0) + (c.east() ? 1 : 0) + (c.south() ? 1 : 0) + (c.west() ? 1 : 0);
}

describe('Maze', function() {

    function gen(width, height) {
        return new Maze(width, height);
    }

    it('should throw for an invalid size', function() {
        assert.throws(function() { gen(-1, 10); });
        assert.throws(function() { gen(10, -1); });
    });

    it('should return a maze of the given size', function() {
        var m1 = gen(20, 20);
        assert.ok(isMaze(m1));
        assert.equal(20, m1.width());
        assert.equal(20, m1.height());

        var m2 = gen(3, 17);
        assert.ok(isMaze(m2));
        assert.equal(3, m2.width());
        assert.equal(17, m2.height());
    });

    it('can make an empty grid', function() {
        assert.ok(isMaze(gen(0, 100)));
        assert.ok(isMaze(gen(100, 0)));
    });

    describe('#cell()', function() {

        it('should return a cell for interior coordinates', function() {
            var m1 = gen(4, 6);
            for (var y = 0 ; y < m1.height(); y ++) {
                for (var x = 0; x < m1.width(); x ++) {
                    assert.ok(isCell(m1.cell(x, y)), 'not a cell');
                }
            }
        });

        it('should return a cell for exterior coordinates', function() {
            var m1 = gen(11, 12);
            assert.ok(isCell(m1.cell(-1, -1)));
            assert.ok(isCell(m1.cell( 1, -1)));
            assert.ok(isCell(m1.cell(-1,  1)));
            assert.ok(isCell(m1.cell(11,  8)));
            assert.ok(isCell(m1.cell( 8, 12)));
            assert.ok(isCell(m1.cell(11, 12)));
        });

    }); // #cell()

    it('should start with no passages', function() {
        var m1 = gen(12, 8);
        var x, y;
        for (y = 0 ; y < m1.height(); y ++) {
            for (x = 0; x < m1.width(); x ++) {
                assert.equal(cellPassageCount(m1.cell(x, y)), 0);
            }
        }
        for (y  = 0 ; y < m1.height(); y ++) {
            for (x = 0; x < m1.width(); x ++) {
                for (var i = 0; i < dirs.ALL.length; i ++) {
                    assert.equal(m1.getPassage(x, y, dirs.ALL[i]), false);
                }
            }
        }
    });

    it('should have no passages in exterior cells', function() {
        var m1 = gen(7, 5);
        assert.equal(cellPassageCount(m1.cell(-1, -1)), 0);
        assert.equal(cellPassageCount(m1.cell( 1, -1)), 0);
        assert.equal(cellPassageCount(m1.cell(-1,  1)), 0);
        assert.equal(cellPassageCount(m1.cell( 7,  3)), 0);
        assert.equal(cellPassageCount(m1.cell( 3,  5)), 0);
        assert.equal(cellPassageCount(m1.cell( 7,  5)), 0);

        assert.equal(m1.getPassage(-1, -1, dirs.SOUTH), false);
        assert.equal(m1.getPassage( 1, -1, dirs.SOUTH), false);
        assert.equal(m1.getPassage(-1,  1, dirs.EAST), false);
        assert.equal(m1.getPassage( 7,  3, dirs.NORTH), false);
        assert.equal(m1.getPassage( 3,  5, dirs.WEST), false);
        assert.equal(m1.getPassage( 7,  5, dirs.WEST), false);
    });

    describe('#setPassage()', function() {

        it('should add or remove a passage in the interior', function() {
            var m1 = gen(3, 6);
            for (var i = 0; i < dirs.ALL.length; i ++) {
                var dir = dirs.ALL[i];
                m1.setPassage(1, 1, dir);
                assert.equal(m1.getPassage(1, 1, dir), true);
                assert.equal(m1.getPassage(1, 1, dirs.opposite(dir)), false);
                assert.equal(cellPassageCount(m1.cell(1, 1)), 1);
                m1.setPassage(1, 1, dir, false);
                assert.equal(m1.getPassage(1, 1, dir), false);
                assert.equal(cellPassageCount(m1.cell(1, 1)), 0);
            }
        });

        it('should throw when adding a passage on the edge', function() {
            var m1 = gen(5, 9);
            assert.throws(function() { m1.setPassage(0, 0, dirs.NORTH); });
            assert.throws(function() { m1.setPassage(0, 0, dirs.WEST); });
            assert.throws(function() { m1.setPassage(3, 0, dirs.NORTH); });
            assert.throws(function() { m1.setPassage(0, 5, dirs.WEST); });
            assert.throws(function() { m1.setPassage(4, 8, dirs.SOUTH); });
            assert.throws(function() { m1.setPassage(4, 8, dirs.EAST); });
            assert.throws(function() { m1.setPassage(2, 8, dirs.SOUTH); });
            assert.throws(function() { m1.setPassage(4, 3, dirs.EAST); });
        });

        it('should throw when adding a passage in the exterior', function() {
            var m1 = gen(9, 5);
            assert.throws(function() { m1.setPassage(-1, -1, dirs.NORTH); });
            assert.throws(function() { m1.setPassage(-1, 0, dirs.EAST); });
            assert.throws(function() { m1.setPassage(10, 4, dirs.NORTH); });
            assert.throws(function() { m1.setPassage(6, 5, dirs.WEST); });
            assert.throws(function() { m1.setPassage(1, 100, dirs.SOUTH); });
            assert.throws(function() { m1.setPassage(9, 5, dirs.WEST); });
        });

        it('should affect passages in neighboring cells', function() {
            var m1 = gen(8, 7);
            for (var i = 0; i < dirs.ALL.length; i ++) {
                var dir = dirs.ALL[i];
                var opp = dirs.opposite(dir);
                m1.setPassage(3, 4, dir, true);
                assert.equal(m1.getPassage(3 + dirs.dx(dir), 4 + dirs.dy(dir), opp), true);
                assert.equal(m1.getPassage(3 + dirs.dx(opp), 4 + dirs.dy(opp), dir), false);
                assert.equal(m1.getPassage(3 + dirs.dx(opp), 4 + dirs.dy(opp), opp), false);
                assert.equal(cellPassageCount(m1.cell(3 + dirs.dx(dir), 4 + dirs.dy(dir))), 1);
                m1.setPassage(3, 4, dir, false);
                assert.equal(m1.getPassage(3 + dirs.dx(dir), 4 + dirs.dy(dir), opp), false);
                assert.equal(cellPassageCount(m1.cell(3 + dirs.dx(dir), 4 + dirs.dy(dir))), 0);
            }
        });

    }); // #setPassage()

}); // Maze
