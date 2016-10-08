var describe = require('mocha').describe;
var it = require('mocha').it;
var assert = require('assert');

var dirs = require('../src/directions');

describe('directions', function() {

    describe('#ALL', function() {

        it('should have four elements', function() {

            assert.equal(dirs.ALL.length, 4);

        });

    });

    describe('#dx()', function() {

        it('should return the correct values', function() {

            assert.equal(dirs.dx(dirs.NORTH), 0);
            assert.equal(dirs.dx(dirs.EAST), 1);
            assert.equal(dirs.dx(dirs.SOUTH), 0);
            assert.equal(dirs.dx(dirs.WEST), -1);

        });

    });

    describe('#dy()', function() {

        it('should return the correct values', function() {

            assert.equal(dirs.dy(dirs.NORTH), -1);
            assert.equal(dirs.dy(dirs.EAST), 0);
            assert.equal(dirs.dy(dirs.SOUTH), 1);
            assert.equal(dirs.dy(dirs.WEST), 0);

        });

    });

    describe('#opposite()', function() {

        it('should return the correct directions', function() {

            assert.equal(dirs.opposite(dirs.NORTH), dirs.SOUTH);
            assert.equal(dirs.opposite(dirs.EAST), dirs.WEST);
            assert.equal(dirs.opposite(dirs.SOUTH), dirs.NORTH);
            assert.equal(dirs.opposite(dirs.WEST), dirs.EAST);

        });

    });

    describe('#bitmask()', function() {

        it('should union to 15', function() {

            assert.equal(dirs.bitmask(dirs.NORTH) | dirs.bitmask(dirs.EAST) | dirs.bitmask(dirs.SOUTH) | dirs.bitmask(dirs.WEST), 15);

        });

    });

}); // directions
