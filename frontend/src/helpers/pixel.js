import { PixelApi } from './pixelStore.js';



const CANVAS_WIDTH = 640;
const CANVAS_HEIGHT = 480;
const MAX_GRID_COLUMNS = 64;
const MAX_GRID_ROWS = 48;
const MIN_GRID_COLUMNS = 4;
const MIN_GRID_ROWS = 3;
const PARSEC_SIZE = 64;

var GRID_COLUMNS = 4; // Current number of columns
var GRID_ROWS = 3; // Current number of rows
var BORDER_RATIO = 1 / 5; // Cursor border relative size
var program; // GLSL program
var currentView = { // Reference is top left corner
    "xParsec": 0,
    "yParsec": 0,
    "pxRow": 0,
    "pxColumn": 0
}



// Cursor variables
var gridCursor = {
    "init": function() {
        this.currentCell[0] = -1;
        this.currentCell[1] = -1;
    },
    "currentCell": [0, 0],
};
var cursorVertices = [];
var cursorColors = [];

// Pixels variables
var pixelsVertices = [
    0.1, 0.1, 0.0,
    0.2, 0.1, 0.0,
    0.2, 0.0, 0.0,
    0.1, 0.1, 0.0,
    0.1, 0.0, 0.0,
    0.2, 0.0, 0.0
];
var pixelColors = [
    0, 1, 1, 0, 1, 1, 0, 1, 1,
    0, 0, 1, 0, 0, 1, 0, 0, 1
];

var canvas;
var gl;

function init() {
    canvas = document.querySelector("#glCanvas");
    gl = canvas.getContext("webgl");



    /*************************************************************************************************************************************************************
     *************************************************************************************************************************************************************
     * 
     * MOUSE EVENT LISTENERS
     * 
     *************************************************************************************************************************************************************
     ************************************************************************************************************************************************************/

    canvas.addEventListener('mousemove', (e) => {
        // Update cursor state
        updateCursorState(e);
    })

    canvas.addEventListener('mouseout', (e) => {
        // Clear cursor
        cursorVertices = [];
        cursorColors = [];
        gridCursor.init();
    })

    canvas.addEventListener('click', (e) => {
        var pixel = getPixelFromView(e); // Get pixel infos on click

        PixelApi.registerPixel(pixel);
    })

    canvas.addEventListener('wheel', (e) => {
        e.preventDefault();

        var pixel = getPixelFromView(e); // Get pixel infos on scroll

        // SCROLL UP
        if (e.deltaY < 0) {
            if (GRID_COLUMNS / 2 < MIN_GRID_COLUMNS || GRID_ROWS / 2 < MIN_GRID_ROWS)
                return;
            GRID_COLUMNS /= 2;
            GRID_ROWS /= 2;
            BORDER_RATIO *= 1.2;

            // Central pixel of the new grid
            let xCenter = Math.floor(GRID_COLUMNS / 2);
            let yCenter = Math.floor(GRID_ROWS / 2);

            currentView.xParsec = pixel.xParsec - (1 + Math.floor((xCenter - pixel.pxColumn) / PARSEC_SIZE));
            currentView.pxColumn = PARSEC_SIZE - (xCenter - pixel.pxColumn);
            currentView.yParsec = pixel.yParsec - (1 + Math.floor((yCenter - pixel.pxRow) / PARSEC_SIZE));
            currentView.pxRow = PARSEC_SIZE - (yCenter - pixel.pxRow);


            console.log(currentView);
        } // SCROLL DOWN
        else {
            if (GRID_COLUMNS * 2 > MAX_GRID_COLUMNS || GRID_ROWS > MAX_GRID_ROWS)
                return;
            GRID_COLUMNS *= 2;
            GRID_ROWS *= 2;
            BORDER_RATIO /= 1.2;

            // Central pixel of the new grid
            let xCenter = Math.floor(GRID_COLUMNS / 2);
            let yCenter = Math.floor(GRID_ROWS / 2);

            currentView.xParsec = pixel.xParsec - (1 + Math.floor((xCenter - pixel.pxColumn) / PARSEC_SIZE));
            currentView.pxColumn = PARSEC_SIZE - (xCenter - pixel.pxColumn);


            currentView.yParsec = pixel.yParsec - (1 + Math.floor((yCenter - pixel.pxRow) / PARSEC_SIZE));
            currentView.pxRow = PARSEC_SIZE - (yCenter - pixel.pxRow);

            console.log(currentView);

        }

        // Update cursor state
        gridCursor.init();
        updateCursorState(e);

    })
}


/*************************************************************************************************************************************************************
 *************************************************************************************************************************************************************
 * 
 * GAME LOGICS
 * 
 *************************************************************************************************************************************************************
 ************************************************************************************************************************************************************/



function main() {

    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;

    if (!gl) {
        alert("Impossible d'initialiser WebGL. Votre navigateur ou votre machine peut ne pas le supporter.");
        return;
    }

    gl.viewport(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Init shader program
    createProgram();
    gl.useProgram(program);


    // Use a callback instead of a loop
    window.requestAnimationFrame(draw);
}

function drawPixels() {
    if (pixelsVertices.length != 0) {
        renderVertices(pixelsVertices, pixelColors);
        gl.drawArrays(gl.TRIANGLES, 0, pixelsVertices.length / 3);
    }
}

function drawCursor() {
    // Render if needed
    if (cursorVertices.length != 0) {
        renderVertices(cursorVertices, cursorColors);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, cursorVertices.length / 3);
    }

}

function draw(timestamp) {
    gl.clearColor(1.0, 1.0, 1.0, 1.0); // Blank background
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Draw pixels
    drawPixels();
    // Draw cursor
    drawCursor();

    window.requestAnimationFrame(draw);
}

/**
 * 
 * @param {center coordinate of the cursor} x 
 * @param {center coordinate of the cursor} y 
 */
function createCursor(x, y) {
    [cursorVertices, cursorColors] = createCursorBorderVertices(x, y, GRID_COLUMNS, GRID_ROWS);
}

function getMouseInfo(mouseEvent) {
    const rect = canvas.getBoundingClientRect();
    var x = mouseEvent.clientX - rect.left;
    var y = mouseEvent.clientY - rect.top;

    // Get cell coordinates
    var cell_x = Math.trunc(x / (CANVAS_WIDTH / GRID_COLUMNS));
    var cell_y = Math.trunc(y / (CANVAS_HEIGHT / GRID_ROWS));

    x = x / rect.width * 2 - 1;
    y = y / rect.height * (-2) + 1;

    var ct_x = cell_x * (2.0 / GRID_COLUMNS) + (2.0 / GRID_COLUMNS) / 2 - 1.0;
    var ct_y = -(cell_y * (2.0 / GRID_ROWS) + (2.0 / GRID_ROWS) / 2 - 1.0);

    return [cell_x, cell_y, ct_x, ct_y];
}

function updateCursorState(mouseEvent) {
    var [cell_x, cell_y, ct_x, ct_y] = getMouseInfo(mouseEvent);

    // Update cursor state only if different than current state
    if (gridCursor.currentCell[0] != cell_x ||
        gridCursor.currentCell[1] != cell_y) {
        gridCursor.currentCell = [cell_x, cell_y];
        // console.log("[INFO] Cursor state has changed");
        createCursor(ct_x, ct_y);
    }

    //

}

function getPixelFromView(mouseEvent) {
    var [cell_x, cell_y, ct_x, ct_y] = getMouseInfo(mouseEvent);
    var pixel = {};
    // x-axis
    let X = currentView.pxColumn + cell_x
    let Y = currentView.pxRow + cell_y;
    pixel["xParsec"] = currentView.xParsec + Math.floor(X / PARSEC_SIZE);
    pixel["pxColumn"] = X % PARSEC_SIZE;
    pixel["yParsec"] = currentView.yParsec + Math.floor(Y / PARSEC_SIZE);
    pixel["pxRow"] = Y % PARSEC_SIZE;

    return pixel;
}


/*************************************************************************************************************************************************************
 *************************************************************************************************************************************************************
 * 
 * PRIMITIVES GENERATION
 * 
 *************************************************************************************************************************************************************
 ************************************************************************************************************************************************************/


/**
 * 
 * @param {rectangle center coordinate} x 
 * @param {rectangle center coordinate} y 
 * @param {number of columns in the grid} nCols 
 * @param {number of rows in the grid} nRows 
 * @returns 
 */
function createCursorBorderVertices(x, y, nCols, nRows) {
    var vertices = [];
    var colors = [];

    function rColors() {
        colors.push(Math.random());
        colors.push(Math.random());
        colors.push(Math.random());
    }

    var _x = 1.0 / nCols;
    var _y = 1.0 / nRows;

    /**
     * Draw rectangle border such that
     * 1---------3
     * ---2---4---
     * ---8---6---
     * 7---------5
     */
    // 1
    vertices.push(x - _x);
    vertices.push(y + _y);
    vertices.push(0.0);
    rColors();
    // 2
    vertices.push(x - _x + BORDER_RATIO * _x);
    vertices.push(y + _y - BORDER_RATIO * _y);
    vertices.push(0.0);
    rColors();
    // 3
    vertices.push(x + _x);
    vertices.push(y + _y);
    vertices.push(0.0);
    rColors();
    // 4
    vertices.push(x + _x - BORDER_RATIO * _x);
    vertices.push(y + _y - BORDER_RATIO * _y);
    vertices.push(0.0);
    rColors();
    // 5
    vertices.push(x + _x);
    vertices.push(y - _y);
    vertices.push(0.0);
    rColors();
    // 6
    vertices.push(x + _x - BORDER_RATIO * _x);
    vertices.push(y - _y + BORDER_RATIO * _y);
    vertices.push(0.0);
    rColors();
    // 7
    vertices.push(x - _x);
    vertices.push(y - _y);
    vertices.push(0.0);
    rColors();
    // 8
    vertices.push(x - _x + BORDER_RATIO * _x);
    vertices.push(y - _y + BORDER_RATIO * _y);
    vertices.push(0.0);
    rColors();
    // 9
    vertices.push(x - _x);
    vertices.push(y + _y);
    vertices.push(0.0);
    rColors();
    // 10
    vertices.push(x - _x + BORDER_RATIO * _x);
    vertices.push(y + _y - BORDER_RATIO * _y);
    vertices.push(0.0);
    rColors();

    return [vertices, colors];
}

/**
 * 
 * @param {rectangle center coordinate} x 
 * @param {rectangle center coordinate} y 
 * @param {number of columns in the grid} nCols 
 * @param {number of rows in the grid} nRows 
 * @returns 
 */
function createPixelVertices(x, y, nCols, nRows) {
    var vertices = [];
    var colors = [];

    function rColors() {
        colors.push(Math.random());
        colors.push(Math.random());
        colors.push(Math.random());
    }

    var _x = 1.0 / nCols;
    var _y = 1.0 / nRows;

    /**
     * Draw pixel such that
     * 1-----2
     * -------
     * 4-----3
     */
    // 1
    vertices.push(x - _x);
    vertices.push(y + _y);
    vertices.push(0.0);
    rColors();
    // 2
    vertices.push(x + _x);
    vertices.push(y + _y);
    vertices.push(0.0);
    rColors();
    // 3
    vertices.push(x + _x);
    vertices.push(y - _y);
    vertices.push(0.0);
    rColors();
    // 4
    vertices.push(x - _x);
    vertices.push(y - _y);
    vertices.push(0.0);
    rColors();

    return [vertices, colors];
}


/*************************************************************************************************************************************************************
 *************************************************************************************************************************************************************
 * 
 * GLSL
 * 
 *************************************************************************************************************************************************************
 ************************************************************************************************************************************************************/


/**
 * 
 * @param {array of vertices to render} vertices 
 * @param {associated colors array} colors 
 */
function renderVertices(vertices, colors) {
    // WebGL process to render vertices
    var vertex_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, null);

    var color_buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.DYNAMIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, vertex_buffer);


    var coord = gl.getAttribLocation(program, "coordinates");

    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    gl.bindBuffer(gl.ARRAY_BUFFER, color_buffer);

    var color = gl.getAttribLocation(program, "color");
    gl.vertexAttribPointer(color, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(color);
}

function compileShaders() {
    var vertCode =
        'attribute vec3 coordinates;' +
        'attribute vec3 color;' +
        'varying vec3 vColor;' +
        'void main(void)' +
        '{' +
        'gl_Position = vec4(coordinates, 1.0);' +
        'vColor = color;' +
        '}'
    var fragCode = 'precision mediump float;' +
        'varying vec3 vColor;' +
        'void main(void)' +
        '{' +
        'gl_FragColor = vec4(vColor, 1.0);' +
        '}'
    var vertShader = gl.createShader(gl.VERTEX_SHADER);
    var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(vertShader, vertCode);
    gl.shaderSource(fragShader, fragCode);
    gl.compileShader(vertShader);
    gl.compileShader(fragShader);

    return [vertShader, fragShader];
}

function createProgram() {
    program = gl.createProgram();
    var [vertShader, fragShader] = compileShaders();

    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);
}


export { init, main };