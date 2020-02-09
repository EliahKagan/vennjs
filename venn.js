(function () {
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

    var compl = function (f) {
        return function (x, y) {
            return !f(x, y);
        };
    };

    var intersect = function (f, g) {
        return function (x, y) {
            return f(x, y) && g(x, y);
        };
    };

    var union = function (f, g) {
        return function (x, y) {
            return f(x, y) || g(x, y);
        };
    };

    var makeShader = function (fgcolor, weight, mesh, ox, oy) {
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

    var polka = makeShader(color(255, 0, 0), 4, 8, 2, 2);
    var ocean = makeShader(color(0, 0, 255), 1, 2, 1, 1);
    var squid = makeShader(color(0, 0, 0), 2, 5, 3, 3);

    (function () {
        var r = 80;

        var v = makeUniverse();
        var f = makeCircle(145, 140, r);
        var g = makeCircle(235, 140, r);
        var h = makeCircle(190, 220, r);

        polka(compl(f));
        ocean(f);
        squid(v);
    })();
})();
