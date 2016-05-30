'use strict';

import {Color} from './Color';
import {Config} from './gui/config';

const GRID_HELPER_CONTEXT = Symbol('Grid Helper Context');

export class GridHelper {
    /**
     * @param {CanvasRenderingContext2D} context
     */
    constructor (context) {
        this[GRID_HELPER_CONTEXT] = context;
    }

    /**
     * @param {Map} canvasPosition
     * @param {boolean|null} isSuccess
     * @param {Point} points
     */
    drawBorder (canvasPosition, isSuccess, ...points) {
        this[GRID_HELPER_CONTEXT].save();
        this[GRID_HELPER_CONTEXT].lineWidth = 2;

        if (true === isSuccess) {
            this[GRID_HELPER_CONTEXT].strokeStyle = Config.COLOR.GREEN;
        } else if (false === isSuccess) {
            this[GRID_HELPER_CONTEXT].strokeStyle = Config.COLOR.RED;
        } else {
            this[GRID_HELPER_CONTEXT].strokeStyle = Config.COLOR.WHITE;
        }

        points.forEach(item => {
            const position = canvasPosition.get(item.id);
            this[GRID_HELPER_CONTEXT].strokeRect(position.x - 2, position.y - 2, Config.STROKE_SIZE, Config.STROKE_SIZE);
        });

        this[GRID_HELPER_CONTEXT].restore();
    }

    /**
     * @param {Map} canvasPosition
     * @param {Point} points
     */
    clearBlocks (canvasPosition, ...points) {
        const color = new Color(255, 255, 255);

        points.forEach(item => {
            this.drawBlock(item, canvasPosition, color);
        });
    }

    /**
     * @param {Point} point
     * @param {Map} canvasPosition
     * @param {Color} color
     */
    drawBlock (point, canvasPosition, color) {
        this[GRID_HELPER_CONTEXT].save();

        const block = new Path2D(),
            canvasCords = canvasPosition.get(point.id),
            blockSize = canvasPosition.get('COLUMN_SIZE');

        block.rect(canvasCords.x, canvasCords.y, blockSize, blockSize);

        this[GRID_HELPER_CONTEXT].fillStyle = `#${color.hex}`;
        this[GRID_HELPER_CONTEXT].fill(block);
        this[GRID_HELPER_CONTEXT].restore();
    }
}
