'use strict';

const POINT_X = Symbol('Point X'),
    POINT_Y = Symbol('Point Y');

export class Point {
    /**
     * @param {number} x
     * @param {number} y
     */
    constructor (x, y) {
        this[POINT_X] = x;
        this[POINT_Y] = y;
    }

    /**
     * @returns {number}
     */
    get x () {
        return this[POINT_X];
    }

    /**
     * @returns {number}
     */
    get y () {
        return this[POINT_Y];
    }

    /**
     * @returns {string}
     */
    get id () {
        return `${this.x}${this.y}`;
    }

    /**
     * @returns {Point}
     */
    clone () {
        return new Point(this.x, this.y);
    }

    /**
     * Vector begins at (0, 0).
     *
     * @param {Point} vector
     */
    move (vector) {
        return new Point(
            this.x + vector.x,
            this.y + vector.y
        );
    }

    /**
     * @param {Point} point
     * @returns {boolean}
     */
    isEqual (point) {
        return this.x === point.x
            && this.y === point.y;
    }
}
