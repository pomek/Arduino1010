'use strict';

import {Point} from '../../src/app/Point';

export default {
    toBeEqualWithPoint () {
        return {
            /**
             * @param {Point} actual
             * @param {number} x
             * @param {number} y
             * @returns {Object}
             */
            compare (actual, x, y) {
                const result = {};

                if (false === actual instanceof Point) {
                    result.pass = false;
                    result.message = `Expected ${(actual).constructor.name} to be instance of Point class.`;

                    return result;
                }

                result.pass = actual.isEqual(new Point(x, y));

                if (false === result.pass) {
                    result.message = `Expected Point (${actual.x}, ${actual.y}) will be equal to Point (${x}, ${y})`;
                }

                return result;
            }
        };
    }
};

