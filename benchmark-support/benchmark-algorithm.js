var benchmark = require('benchmark');
var Maze = require('../src/Maze');

function makeRandom(seed) {
    var randomjs = require('random-js');
    var engine = randomjs.engines.mt19937().seed(seed);
    var real = randomjs.real(0, 1);
    return function() {
        return real(engine);
    };
}

function benchmarkAlgorithm(algorithmName, algorithm) {

    function run(width, height, seed) {
        var options = {};
        if (seed)
            options.random = makeRandom(seed);
        else
            options.random = Math.random;
        var maze = new Maze(width, height);
        algorithm(maze, options);
        return maze;
    }

    /*eslint no-console: "off"*/
    /*global console*/
    console.info(new benchmark(algorithmName+'#10x10', function() {
        run(10, 10, 1);
    }).run().toString());
    console.info(new benchmark(algorithmName+'#50x50', function() {
        run(50, 50, 1);
    }).run().toString());
    console.info(new benchmark(algorithmName+'#100x100', function() {
        run(100, 100, 1);
    }).run().toString());
}

module.exports = benchmarkAlgorithm;
