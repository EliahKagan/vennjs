(function() {
    var circ = function(r, x, y) {
        var weight = 2;

        strokeWeight(weight);
        ellipse(x, y, r * 2, r * 2);
    };

    var fillDots = function(r, x, y) {
        var weight = 3;
        var gap = 2;
        var sep = 8;

        var imin = x - r + gap;
        var imax = x + r - gap;
        var jmin = y - r + gap;
        var jmax = y + r - gap;

        strokeWeight(weight);

        for (var i = imin; i <= imax; i += sep) {
            for (var j = jmin; j <= jmax; j += sep) {
                if (sq(x - i) + sq(y - j) <= sq(r)) {
                    point(i, j);
                }
            }
        }
    };

    (function() {
        var r = 80;
        var x = 150;
        var y = 200;

        circ(r, x, y);
        fillDots(r, x, y);
    })();
})();
