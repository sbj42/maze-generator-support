var dirs = {};

/**
 * @typedef {integer} Direction
 */

dirs.NORTH = 0;
dirs.EAST =  1;
dirs.SOUTH = 2;
dirs.WEST =  3;

dirs.ALL = [dirs.NORTH, dirs.EAST, dirs.SOUTH, dirs.WEST];

/**
 * Returns the opposite direction
 *
 * @param {Direction} dir
 * @return {Direction}
 */
dirs.opposite = function(dir) {
    return [dirs.SOUTH, dirs.WEST, dirs.NORTH, dirs.EAST][dir];
};

/**
 * Returns the x component of the direction vector
 *
 * @param {Direction} dir
 * @return {integer}
 */
dirs.dx = function(dir) {
    return [0, 1, 0, -1][dir];
};

/**
 * Returns the y component of the direction vector
 *
 * @param {Direction} dir
 * @return {integer}
 */
dirs.dy = function(dir) {
    return [-1, 0, 1, 0][dir];
};


/**
 * Returns a bitmask for the direction, useful for
 * storing a bunch of direction boolean values in
 * a single integer.
 *
 * @param {Direction} dir
 * @return {integer}
 */
dirs.bitmask = function(dir) {
    return 1 << dir;
};

module.exports = dirs;
