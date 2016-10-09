/**
 * @typedef {Object} GridMaskOptions
 * @property {boolean} [interior] The value to intialize interior cells to
 * @property {boolean} [exterior] The value to return for exterior cells
 */

/**
 * A GridMask is a rectangular grid of boolean values.
 *
 * @constructor
 * @param {integer} width
 * @param {integer} height
 * @param {GridMaskOptions} options
 */
function GridMask(width, height, options) {
    if (width < 0 || height < 0)
        throw new Error('invalid size: ' + width + 'x' + height);
    options = options || {};
    var interior = false;
    if (options.interior != null)
        interior = !!options.interior;
    this._width = width;
    this._height = height;
    this._grid = [];
    this._exterior = false;
    if (options.exterior != null)
        this._exterior = !!options.exterior;
    for (var i = 0; i < width * height; i ++) {
        this._grid.push(interior);
    }
}

/**
 * The width of the GridMask
 *
 * @return {integer}
 */
GridMask.prototype.width = function() {
    return this._width;
};

/**
 * The height of the GridMask
 *
 * @return {integer}
 */
GridMask.prototype.height = function() {
    return this._height;
};

/**
 * Returns the boolean value at the specified cell
 *
 * @param {integer} x
 * @param {integer} y
 */
GridMask.prototype.get = function(x, y) {
    if (x < 0 || x >= this.width() || y < 0 || y >= this.height()) {
        return this._exterior;
    }
    return this._grid[y * this.width() + x];
};

/**
 * Sets the boolean value at the specified cell.  Throws an
 * error for coordinates that lie outside the grid.
 *
 * @param {integer} x
 * @param {integer} y
 * @param {boolean} value
 */
GridMask.prototype.set = function(x, y, value) {
    if (x < 0 || x >= this.width() || y < 0 || y >= this.height()) {
        throw new Error('cell out of bounds: ' + x + ',' + y);
    }
    this._grid[y * this.width() + x] = value;
    return this;
};

module.exports = GridMask;
