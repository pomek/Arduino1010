'use strict';

import {Shape} from './Shape';
import {Color} from './Color';
import {Point} from './Point';

const SHAPE_FACTORY_SHAPES = Symbol('Shape Factory Shapes');

export class ShapeFactory {
    /**
     * @param {{color: number[], points: number[]}[]} config
     */
    constructor (config) {
        this[SHAPE_FACTORY_SHAPES] = config.map(shape => {
            const points = shape.points.map(cords => {
                    return new Point(...cords);
                });

            return new Shape(
                new Color(...shape.color),
                ...points
            );
        });

        // @see: http://stackoverflow.com/a/12646864
        for (let i = this[SHAPE_FACTORY_SHAPES].length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = this[SHAPE_FACTORY_SHAPES][i];

            this[SHAPE_FACTORY_SHAPES][i] = this[SHAPE_FACTORY_SHAPES][j];
            this[SHAPE_FACTORY_SHAPES][j] = temp;
        }
    }

    /**
     * @returns {Shape}
     */
    make () {
        const key = this[SHAPE_FACTORY_SHAPES].length * Math.random() << 0;

        return this[SHAPE_FACTORY_SHAPES][key].clone();
    }
}
