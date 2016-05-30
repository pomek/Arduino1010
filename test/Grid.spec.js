'use strict';

import {Grid} from '../src/app/Grid';
import {Context} from './stub/Context';
import * as pointsCompare from './matchers/pointsCompare';

describe('Grid Class', () => {
    let context = new Context(),
        grid;

    beforeEach(() => {
        grid = new Grid(/* <CanvasRenderingContext2D> */ context);
    });

    it('is initializable', () => {
        expect(grid instanceof Grid).toBeTruthy();
    });

    it('throws an error when number of columns is too small', () => {
        expect(() => {
            grid.draw(0, 0, 50, 30, 0);
        }).toThrow(new Error('Number of columns has to be bigger or equal to 2.'));
    });

    describe('makes a grid', () => {
        beforeEach(() => {
            jasmine.addMatchers(pointsCompare.default);

            grid = new Grid(/* <CanvasRenderingContext2D> */ context);
        });

        it('and draw it on given context', () => {
            spyOn(context, 'save');
            spyOn(context, 'strokeRect');
            spyOn(context, 'beginPath');
            spyOn(context, 'moveTo');
            spyOn(context, 'lineTo');
            spyOn(context, 'stroke');
            spyOn(context, 'restore');

            grid.draw(0, 0, 102, 33, 1);

            expect(context.strokeRect).toHaveBeenCalledWith(0.5, 0.5, 102, 102);

            expect(context.moveTo).toHaveBeenCalledWith(33.5, 0.5);
            expect(context.lineTo).toHaveBeenCalledWith(33.5, 102.5);
            expect(context.moveTo).toHaveBeenCalledWith(0.5, 33.5);
            expect(context.lineTo).toHaveBeenCalledWith(102.5, 33.5);
            expect(context.moveTo).toHaveBeenCalledWith(66.5, 0.5);
            expect(context.lineTo).toHaveBeenCalledWith(66.5, 102.5);
            expect(context.moveTo).toHaveBeenCalledWith(0.5, 66.5);
            expect(context.lineTo).toHaveBeenCalledWith(102.5, 66.5);

            expect(context.save).toHaveBeenCalledTimes(1);
            expect(context.restore).toHaveBeenCalledTimes(1);

            expect(context.beginPath).toHaveBeenCalledTimes(4);
            expect(context.stroke).toHaveBeenCalledTimes(4);
        });

        it('and returns a map with points\' coordinates', () => {
            const map = grid.draw(0, 0, 102, 33, 1);

            expect(map.size).toBe(10);
            expect(map.get('COLUMN_SIZE')).toBe(31);
            expect(map.get('00')).toBeEqualWithPoint(1.5, 1.5);
            expect(map.get('01')).toBeEqualWithPoint(1.5, 34.5);
            expect(map.get('02')).toBeEqualWithPoint(1.5, 67.5);
            expect(map.get('10')).toBeEqualWithPoint(34.5, 1.5);
            expect(map.get('11')).toBeEqualWithPoint(34.5, 34.5);
            expect(map.get('12')).toBeEqualWithPoint(34.5, 67.5);
            expect(map.get('20')).toBeEqualWithPoint(67.5, 1.5);
            expect(map.get('21')).toBeEqualWithPoint(67.5, 34.5);
            expect(map.get('22')).toBeEqualWithPoint(67.5, 67.5);
        });
    });
});
