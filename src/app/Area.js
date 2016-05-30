'use strict';

import {Point} from './Point';

const AREA_MAP_SIZE = Symbol('Area Map Size'),
    AREA_FIELDS = Symbol('Area Fields'),
    AREA_POINTS = Symbol('Area Points');

export class Area {
    /**
     * @param {number} mapSize
     */
    constructor (mapSize) {
        this[AREA_MAP_SIZE] = mapSize;
        this[AREA_FIELDS] = new Map();
        this[AREA_POINTS] = new WeakMap();

        for (let x = 0; x < this[AREA_MAP_SIZE]; ++x) {
            for (let y = 0; y < this[AREA_MAP_SIZE]; ++y) {
                const point = new Point(x, y);

                this[AREA_FIELDS].set(`${x}${y}`, point);
                this[AREA_POINTS].set(point, null);
            }
        }
    }

    /**
     * @returns {Array[]}
     */
    get points () {
        const points = [];

        for (let point of this[AREA_FIELDS].values()) {
            points.push([point, this[AREA_POINTS].get(point)]);
        }

        return points;
    }

    /**
     * @returns {Point[]}
     */
    get filledRowsAndCells () {
        const points = [];

        for (let x = 0; x < this[AREA_MAP_SIZE]; ++x) {
            for (let isVertical of [true, false]) {
                const rowLinePoints = [];

                for (let y = 0; y < this[AREA_MAP_SIZE]; ++y) {
                    rowLinePoints.push(
                        this[AREA_FIELDS].get(isVertical ? `${x}${y}` : `${y}${x}`)
                    );
                }

                const rowLineColors = rowLinePoints
                    .map(point => this[AREA_POINTS].get(point))
                    .filter(color => null !== color);

                if (rowLineColors.length === rowLinePoints.length) {
                    points.push(...rowLinePoints);
                }
            }
        }

        return points.filter((value, index, self) => {
            return self.indexOf(value) === index;
        });
    }

    /**
     * @param {Shape} shape
     * @param {Point} point
     * @throws {RangeError}
     * @returns {void}
     */
    appendShape (shape, point) {
        if (false === this.canAppendShape(shape, point)) {
            throw new RangeError('Shape cannot be inserted here.');
        }

        for (let item of shape.points) {
            const movedPoint = item.move(point),
                pointToSet = this[AREA_FIELDS].get(movedPoint.id);

            this[AREA_POINTS].set(pointToSet, shape.color);
        }
    }

    /**
     * @param {Shape} shape
     * @param {Point} point
     * @returns {boolean}
     */
    canAppendShape (shape, point) {
        for (let item of shape.points) {
            const movedPoint = item.move(point),
                pointToCheck = this[AREA_FIELDS].get(movedPoint.id);

            if (null !== this[AREA_POINTS].get(pointToCheck)) {
                return false;
            }
        }

        return true;
    }

    /**
     * @param {Shape} shape
     * @returns {boolean}
     */
    canAppendShapeAnywhere (shape) {
        let upLimitPoint = shape.points.reduce((prev, current) => {
                return (prev.y < current.y) ? prev : current;
            }),
            leftLimitPoint = shape.points.reduce((prev, current) => {
                return (prev.x < current.x) ? prev : current;
            }),
            downLimitPoint = shape.points.reduce((prev, current) => {
                return (prev.y > current.y) ? prev : current;
            }),
            rightLimitPoint = shape.points.reduce((prev, current) => {
                return (prev.x > current.x) ? prev : current;
            });

        downLimitPoint = this[AREA_MAP_SIZE] - downLimitPoint.y;
        rightLimitPoint = this[AREA_MAP_SIZE] - rightLimitPoint.x;

        for (let x = leftLimitPoint.x; x < rightLimitPoint; ++x) {
            for (let y = upLimitPoint.y; y < downLimitPoint; ++y) {
                if (true === this.canAppendShape(shape, new Point(x, y))) {
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * @param {Point} points
     * @returns {void}
     */
    clearFields (...points) {
        for (let point of points) {
            this[AREA_POINTS].set(point, null);
        }
    }
}
