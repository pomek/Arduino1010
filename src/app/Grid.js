'use strict';

import {Config} from './gui/config';
import {Point} from './Point';

const GRID_CONTEXT = Symbol('Grid Context');

export class Grid {
    /**
     * @param {CanvasRenderingContext2D} context
     */
    constructor (context) {
        this[GRID_CONTEXT] = context;
    }

    /**
     * Draw grid on given Canvas Context.
     * Returns object with positions for blocks.
     *
     * @param {number} startX
     * @param {number} startY
     * @param {number} gridSize
     * @param {number} columnSize
     * @param {number} columnPadding
     * @returns {Map}
     */
    draw (startX, startY, gridSize, columnSize, columnPadding) {
        const columnNumber = Math.floor(gridSize / columnSize);

        if (columnNumber < 2) {
            throw new Error('Number of columns has to be bigger or equal to 2.');
        }

        this[GRID_CONTEXT].save();
        this[GRID_CONTEXT].lineWidth = 1;
        this[GRID_CONTEXT].strokeStyle = Config.COLOR.GREY;
        this[GRID_CONTEXT].fillStyle = Config.COLOR.GREY;

        startX += 0.5;
        startY += 0.5;

        this[GRID_CONTEXT].strokeRect(startX, startY, gridSize, gridSize);

        for (let i = 1; i < columnNumber; ++i) {
            const newX = startX + i * columnSize,
                newY = startY + i * columnSize;

            this[GRID_CONTEXT].beginPath();
            this[GRID_CONTEXT].moveTo(newX, startY);
            this[GRID_CONTEXT].lineTo(newX, startY + gridSize);
            this[GRID_CONTEXT].stroke();

            this[GRID_CONTEXT].beginPath();
            this[GRID_CONTEXT].moveTo(startX, newY);
            this[GRID_CONTEXT].lineTo(startX + gridSize, newY);
            this[GRID_CONTEXT].stroke();
        }

        this[GRID_CONTEXT].restore();

        return makeMap(columnNumber, startX, startY, columnSize, columnPadding);
    }
}

/**
 * Draw grid on given Canvas Context.
 * Returns object with positions for blocks.
 *
 * @param {number} columnNumber
 * @param {number} startX
 * @param {number} startY
 * @param {number} columnSize
 * @param {number} columnPadding
 * @returns {Map}
 */
function makeMap (columnNumber, startX, startY, columnSize, columnPadding) {
    const canvasPosition = new Map();
    canvasPosition.set('COLUMN_SIZE', columnSize - 2 * columnPadding);

    for (let x = 0; x < columnNumber; ++x) {
        for (let y = 0; y < columnNumber; ++y) {
            canvasPosition.set(`${x}${y}`, new Point(
                startX + columnPadding + x * columnSize,
                startY + columnPadding + y * columnSize
            ));
        }
    }

    return canvasPosition;
}
