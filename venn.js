// vennjs - a Venn diagram shading toy
//
// Written in 2020 by Eliah Kagan <degeneracypressure@gmail.com>.
//
// To the extent possible under law, the author(s) have dedicated all copyright
// and related and neighboring rights to this software to the public domain
// worldwide. This software is distributed without any warranty.
//
// You should have received a copy of the CC0 Public Domain Dedication along
// with this software. If not, see
// <http://creativecommons.org/publicdomain/zero/1.0/>.

(function () {
    'use strict';

    var FILL_COLOR = color(255, 255, 255, 0); // transparent
    var BORDER_COLOR = color(0, 0, 0);
    var UNIVERSE_STROKE_WEIGHT = 1;
    var CLASS_STROKE_WEIGHT = 3;

    var UNIVERSE_LEFTSIDE = 20;
    var UNIVERSE_TOPSIDE = 20;
    var UNIVERSE_WIDTH = 350;
    var UNIVERSE_HEIGHT = 325;

    var makeUniverse = function () {
        fill(FILL_COLOR);
        stroke(BORDER_COLOR);
        strokeWeight(UNIVERSE_STROKE_WEIGHT);
        rect(UNIVERSE_LEFTSIDE, UNIVERSE_TOPSIDE,
                UNIVERSE_WIDTH, UNIVERSE_HEIGHT);

        return function (x, y) {
            return true;
        };
    };

    var makeCircle = function (cx, cy, r) {
        fill(FILL_COLOR);
        stroke(BORDER_COLOR);
        strokeWeight(CLASS_STROKE_WEIGHT);
        ellipse(cx, cy, r * 2, r * 2);

        return function (x, y) {
            return sq(x - cx) + sq(y - cy) <= sq(r);
        };
    };

    // Class complement / boolean negation ("NOT").
    var compl = function (f) {
        return function (x, y) {
            return !f(x, y);
        };
    };

    // Class intersection / boolean conjunction ("AND").
    var intersection = function (f, g) {
        return function (x, y) {
            return f(x, y) && g(x, y);
        };
    };

    // Class union / boolean disjunction ("OR").
    var union = function (f, g) {
        return function (x, y) {
            return f(x, y) || g(x, y);
        };
    };

    // Boolean analogue of material conditional ("ONLY IF").
    var arrow = function (f, g) {
        return union(compl(f), g);
    };

    // Creates a positive Venn diagram shader (usual convention).
    var createShader = function (fgcolor, weight, mesh, ox, oy) {
        return function (f) {
            stroke(fgcolor);
            strokeWeight(weight);

            var xmin = UNIVERSE_LEFTSIDE + ox;
            var xmax = UNIVERSE_LEFTSIDE + UNIVERSE_WIDTH;
            var ymin = UNIVERSE_TOPSIDE + oy;
            var ymax = UNIVERSE_TOPSIDE + UNIVERSE_HEIGHT;

            for (var x = xmin; x <= xmax; x += mesh) {
                for (var y = ymin; y <= ymax; y += mesh) {
                    if (f(x, y)) {
                        point(x, y);
                    }
                }
            }
        };
    };

    // Converts positive to negative shaders and vice versa.
    var negateShader = function (shader) {
        return function (f) {
            return shader(compl(f));
        };
    };

    // A few Venn diagram shaders, positive (usual) convention.
    var ppolka = createShader(color(255, 0, 0), 4, 8, 2, 2);
    var pocean = createShader(color(0, 0, 255), 1, 2, 1, 1);
    var psquid = createShader(color(0, 0, 0), 2, 5, 3, 3);

    // A few Venn diagram shaders, negative (Quine) convention.
    var npolka = negateShader(ppolka);
    var nocean = negateShader(pocean);
    var nsquid = negateShader(psquid);

    (function () {
        var r = 80;

        var v = makeUniverse();
        var f = makeCircle(145, 140, r);
        var g = makeCircle(235, 140, r);
        var h = makeCircle(190, 220, r);

        // \forall x\, [(Sx \wedge Tx) \rightarrow Fx]
        npolka(arrow(intersection(g, h), f));

        // \neg Fj
        nocean(compl(f));

        // Gj
        nsquid(g);
    })();
})();
