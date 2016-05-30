'use strict';

const SHAPE_COLOR = Symbol('Shape Color'),
    SHAPE_POINTS = Symbol('Shape Points');

export class Shape {
    /**
     * @param {Color} color
     * @param {Point} points
     */
    constructor (color, ...points) {
        this[SHAPE_COLOR] = color;
        this[SHAPE_POINTS] = points;
    }

    /**
     * @returns {Color}
     */
    get color () {
        return this[SHAPE_COLOR];
    }

    /**
     * @returns {Point[]}
     */
    get points () {
        return this[SHAPE_POINTS];
    }

    /**
     * @returns {Shape}
     */
    clone () {
        const points = this.points.map(item => item.clone());

        return new Shape(this.color.clone(), ...points);
    }
}
