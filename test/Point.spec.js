'use strict';

import {Point} from '../src/app/Point';

describe('Point Class', () => {
    let point;

    beforeEach(() => {
        point = new Point(2, 5);
    });

    it('is initializable', () => {
        expect(point instanceof Point).toBeTruthy();
    });

    it('returns point coordinates', () => {
        expect(point.x).toBe(2);
        expect(point.y).toBe(5);
    });

    it('returns point id', () => {
        expect(point.id).toBe('25');
    });

    it('allows to clone object', () => {
        const clonedPoint = point.clone();

        expect(clonedPoint instanceof Point).toBeTruthy();
        expect(clonedPoint).not.toBe(point);
        expect(clonedPoint.x).toBe(2);
        expect(clonedPoint.y).toBe(5);
        expect(clonedPoint.id).toBe('25');
    });

    it('moves point', () => {
        const vectorPart = new Point(3, 1),
            newPoint = point.move(vectorPart);

        expect(newPoint.x).toBe(5);
        expect(newPoint.y).toBe(6);
        expect(newPoint.id).toBe('56');
    });

    it('compares points', () => {
        expect(point.isEqual(new Point(2, 5))).toBeTruthy();
        expect(point.isEqual(new Point(3, 5))).toBeFalsy();
        expect(point.isEqual(new Point(2, 6))).toBeFalsy();
    });
});
