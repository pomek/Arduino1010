'use strict';

import {Point} from './Point';

const CONTROLLER_EVENT_EMITTER = Symbol('Controller Event Emitter'),
    CONTROLLER_AREA = Symbol('Controller Area'),
    CONTROLLER_SELECTED_KEY = Symbol('Controller Selected Key'),
    CONTROLLER_SELECTED_POINT = Symbol('Controller Selected Point'),
    CONTROLLER_AVAILABLE_BLOCKS = Symbol('Controller Available Blocks');

/**
 * @param {Controller} controller
 * @returns {void}
 */
function emitSelectedFieldEvent (controller) {
    controller[CONTROLLER_EVENT_EMITTER].emit(
        'gui.selectProposition',
        controller[CONTROLLER_SELECTED_KEY],
        controller[CONTROLLER_SELECTED_POINT]
    );
}

export class Controller {
    /**
     * @param {EventEmitter} eventEmitter
     * @param {Area} area
     * @param {Map} availableBlocks
     */
    constructor (eventEmitter, area, availableBlocks) {
        this[CONTROLLER_SELECTED_KEY] = null;
        this[CONTROLLER_SELECTED_POINT] = null;

        this[CONTROLLER_EVENT_EMITTER] = eventEmitter;
        this[CONTROLLER_AREA] = area;
        this[CONTROLLER_AVAILABLE_BLOCKS] = availableBlocks;
    }

    /**
     * @returns {Point}
     */
    get selectedPoint () {
        return this[CONTROLLER_SELECTED_POINT];
    }

    /**
     * Returns true if selected key and point are present.
     *
     * @returns {boolean}
     */
    canMoveShape () {
        return !!(this[CONTROLLER_SELECTED_KEY] || this[CONTROLLER_SELECTED_POINT]);
    }

    /**
     * Function allows to chose block from available items
     *
     * @param {number} number
     * @return {void}
     */
    selectProposition (number) {
        if (number === 0) {
            this[CONTROLLER_SELECTED_KEY] = null;
            this[CONTROLLER_SELECTED_POINT] = null;
        } else {
            this[CONTROLLER_SELECTED_KEY] = number;
            this[CONTROLLER_SELECTED_POINT] = new Point(4, 4);
        }

        emitSelectedFieldEvent(this);
    }

    /**
     * Moves up chosen shape if possible.
     *
     * @returns {void}
     */
    moveUp () {
        if (false === this.canMoveShape()) {
            return;
        }

        const selectedPoint = this[CONTROLLER_SELECTED_POINT];

        if (0 === selectedPoint.y) {
            return;
        }

        this[CONTROLLER_SELECTED_POINT] = new Point(selectedPoint.x, selectedPoint.y - 1);
        emitSelectedFieldEvent(this);
    }

    /**
     * Moves left chosen shape if possible.
     *
     * @returns {void}
     */
    moveLeft () {
        if (false === this.canMoveShape()) {
            return;
        }

        const selectedPoint = this[CONTROLLER_SELECTED_POINT];

        if (0 === selectedPoint.x) {
            return;
        }

        this[CONTROLLER_SELECTED_POINT] = new Point(selectedPoint.x - 1, selectedPoint.y);
        emitSelectedFieldEvent(this);
    }

    /**
     * Moves down chosen shape if possible.
     *
     * @return {void}
     */
    moveDown () {
        if (false === this.canMoveShape()) {
            return;
        }

        const selectedPoint = this[CONTROLLER_SELECTED_POINT],
            selectedProposition = this[CONTROLLER_AVAILABLE_BLOCKS].get(
                this[CONTROLLER_SELECTED_KEY]
            ),
            downLimitPoint = selectedProposition.points.reduce((prev, current) => {
                return (prev.y > current.y) ? prev : current;
            });

        if (9 - downLimitPoint.y === selectedPoint.y) {
            return;
        }

        this[CONTROLLER_SELECTED_POINT] = new Point(selectedPoint.x, selectedPoint.y + 1);
        emitSelectedFieldEvent(this);
    }

    /**
     * Moves right chosen shape if possible.
     *
     * @returns {void}
     */
    moveRight () {
        if (false === this.canMoveShape()) {
            return;
        }

        const selectedPoint = this[CONTROLLER_SELECTED_POINT],
            selectedProposition = this[CONTROLLER_AVAILABLE_BLOCKS].get(
                this[CONTROLLER_SELECTED_KEY]
            ),
            rightLimitPoint = selectedProposition.points.reduce((prev, current) => {
                return (prev.x > current.x) ? prev : current;
            });

        if (9 - rightLimitPoint.x === selectedPoint.x) {
            return;
        }

        this[CONTROLLER_SELECTED_POINT] = new Point(selectedPoint.x + 1, selectedPoint.y);
        emitSelectedFieldEvent(this);
    }

    /**
     * Pastes chosen block to map.
     *
     * @returns {boolean}
     */
    pasteBlock () {
        if (false === this.canMoveShape()) {
            return false;
        }

        const selectedKey = this[CONTROLLER_SELECTED_KEY],
            selectedPoint = this[CONTROLLER_SELECTED_POINT],
            selectedProposition = this[CONTROLLER_AVAILABLE_BLOCKS].get(selectedKey);

        try {
            this[CONTROLLER_AREA].appendShape(selectedProposition, selectedPoint);
            this[CONTROLLER_EVENT_EMITTER].emit('gui.appendedShape', selectedProposition.points.length);
        } catch (e) {
            return false;
        }

        this[CONTROLLER_AVAILABLE_BLOCKS].set(selectedKey, null);

        this[CONTROLLER_EVENT_EMITTER].emit('gui.drawBlocks', selectedProposition, selectedPoint);
        this[CONTROLLER_EVENT_EMITTER].emit('gui.removeProposition', selectedProposition, selectedKey);
        this[CONTROLLER_EVENT_EMITTER].emit('gui.makeNewProposition', this[CONTROLLER_AVAILABLE_BLOCKS], selectedKey);
        this[CONTROLLER_EVENT_EMITTER].emit('gui.removeFilledRowsAndCells');
        this.selectProposition(0);

        const canAppendAnyShape = Array.from(this[CONTROLLER_AVAILABLE_BLOCKS].values())
            .some(shape => {
                return this[CONTROLLER_AREA].canAppendShapeAnywhere(shape);
            });

        if (false === canAppendAnyShape) {
            this[CONTROLLER_EVENT_EMITTER].emit('gui.gameOver');
        }

        return true;
    }
}
