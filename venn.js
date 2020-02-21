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

function setup() {
    'use strict';
    createCanvas(400, 400).parent('venn');
    noLoop();
}

function draw() {
    'use strict';
    background(255);
    main();
}

function main() {
    'use strict';

    const FILL_COLOR = color(255, 255, 255, 0); // transparent
    const BORDER_COLOR = color(0, 0, 0);
    const UNIVERSE_STROKE_WEIGHT = 1;
    const CLASS_STROKE_WEIGHT = 3;

    const UNIVERSE_LEFTSIDE = 20;
    const UNIVERSE_TOPSIDE = 20;
    const UNIVERSE_WIDTH = 350;
    const UNIVERSE_HEIGHT = 325;

    function drawUniverse() {
        fill(FILL_COLOR);
        stroke(BORDER_COLOR);
        strokeWeight(UNIVERSE_STROKE_WEIGHT);
        rect(UNIVERSE_LEFTSIDE, UNIVERSE_TOPSIDE,
            UNIVERSE_WIDTH, UNIVERSE_HEIGHT);

        return (x, y) => true;
    }

    function drawClass(cx, cy, r) {
        fill(FILL_COLOR);
        stroke(BORDER_COLOR);
        strokeWeight(CLASS_STROKE_WEIGHT);
        ellipse(cx, cy, r * 2, r * 2);

        return (x, y) => sq(x - cx) + sq(y - cy) <= sq(r);
    }

    // Class complement / boolean negation ("NOT").
    function compl(f) {
        return (x, y) => !f(x, y);
    }

    // Class intersection / boolean conjunction ("AND").
    function intersection(f, g) {
        return (x, y) => f(x, y) && g(x, y);
    }

    // Class union / boolean disjunction ("OR").
    function union(f, g) {
        return (x, y) => f(x, y) || g(x, y);
    }

    // Boolean analogue of material conditional ("ONLY IF").
    function arrow(f, g) {
        return (x, y) => !f(x, y) || g(x, y);
    }

    // Boolean analogue of biconditional ("IF AND ONLY IF").
    function equiv(f, g) {
        return (x, y) => f(x, y) == g(x, y);
    }

    // Symmetric difference ("XOR").
    function symdiff(f, g) {
        return (x, y) => f(x, y) != g(x, y);
    }

    // Propositional logic aliases.
    const not = compl;
    const and = intersection;
    const or = union;
    const onlyif = arrow;
    const iff = equiv;
    const xor = symdiff;

    // Creates a positive Venn diagram shader (usual convention).
    function makeShader(fgcolor, weight, mesh, ox, oy) {
        return f => {
            stroke(fgcolor);
            strokeWeight(weight);

            const xmin = UNIVERSE_LEFTSIDE + ox;
            const xmax = UNIVERSE_LEFTSIDE + UNIVERSE_WIDTH;
            const ymin = UNIVERSE_TOPSIDE + oy;
            const ymax = UNIVERSE_TOPSIDE + UNIVERSE_HEIGHT;

            for (let x = xmin; x <= xmax; x += mesh) {
                for (let y = ymin; y <= ymax; y += mesh) {
                    if (f(x, y)) {
                        point(x, y);
                    }
                }
            }
        };
    }

    // Converts positive to negative shaders and vice versa.
    function negateShader(shader) {
        return f => shader(compl(f));
    }

    // A few Venn diagram shaders, positive (usual) convention.
    const ppolka = makeShader(color(255, 0, 0), 4, 8, 2, 2);
    const pocean = makeShader(color(0, 0, 255), 1, 2, 1, 1);
    const psquid = makeShader(color(0, 0, 0), 2, 5, 3, 3);

    // A few Venn diagram shaders, negative (Quine) convention.
    const npolka = negateShader(ppolka);
    const nocean = negateShader(pocean);
    const nsquid = negateShader(psquid);

    // Reasoning about safety of giant tomato-juice vats.
    function demoTomatoJuiceDivers(f, g, h) {
        // \forall x\, [(Sx \wedge Tx) \rightarrow Fx]
        npolka(arrow(intersection(g, h), f));

        // \neg Fj
        nocean(compl(f));

        // Gj
        nsquid(g);
    }

    // Reasoning about distributivity.
    function makeDistrbutivityDemo(op1, op2) {
        return (f, g, h) => {
            ppolka(op1(f, op2(g, h)));
            pocean(op2(op1(f, g), op1(f, h)));
        };
    }

    (function () {
        const r = 80;

        const v = drawUniverse();
        const f = drawClass(145, 140, r);
        const g = drawClass(235, 140, r);
        const h = drawClass(190, 220, r);

        //demoTomatoJuiceDivers(f, g, h);
        makeDistrbutivityDemo(iff, xor)(f, g, h);
        //makeDistrbutivityDemo(xor, iff)(f, g, h);
    })();
}
