'use strict';

import {Shape} from '../src/app/Shape';
import {Color} from '../src/app/Color';
import {Point} from '../src/app/Point';

describe('Shape Class', () => {
    const color = new Color(1, 2, 3),
        points = [
            new Point(0, 0),
            new Point(1, 0),
            new Point(2, 0),
            new Point(0, 1),
            new Point(0, 2)
        ];
    let shape;

    beforeEach(() => {
        shape = new Shape(color, ...points);
    });

    it('is initializable', () => {
        expect(shape instanceof Shape).toBeTruthy();
    });

    it('allows to clone object', () => {
        spyOn(color, 'clone');

        for (let point of points) {
            spyOn(point, 'clone');
        }

        const clonedShape = shape.clone();

        expect(clonedShape instanceof Shape).toBeTruthy();
        expect(clonedShape).not.toBe(shape);
        expect(color.clone).toHaveBeenCalled();

        for (let point of points) {
            expect(point.clone).toHaveBeenCalled();
        }
    });
});
