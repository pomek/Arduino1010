'use strict';

import {Area} from '../src/app/Area';
import {Color} from '../src/app/Color';
import {Shape} from '../src/app/Shape';
import {Point} from '../src/app/Point';
import {Config} from './stub/gui/config';

describe('Area Class', () => {
    let area;

    const redColor = new Color(255, 0, 0),
        points = [
            new Point(0, 0),
            new Point(1, 1),
            new Point(2, 2),
            new Point(0, 2),
            new Point(2, 0)
        ];

    beforeEach(() => {
        area = new Area(Config.MAP_SIZE);
    });

    it('is initializable', () => {
        expect(area instanceof Area).toBeTruthy();
    });

    it('has empty all fields', () => {
        const nonEmptyPoints = area.points.filter(item => null !== item[1]);

        expect(nonEmptyPoints).toBeArrayOfSize(0);
    });

    it('allows to append shape', () => {
        const timesShape = new Shape(redColor, ...points);

        expect(area.canAppendShape(timesShape, new Point(2, 4))).toBeTruthy();
    });

    it('apends shape', () => {
        const timesShape = new Shape(redColor, ...points),
            cornerPoint = new Point(2, 4);

        area.appendShape(timesShape, cornerPoint);
        expect(area.canAppendShape(timesShape, cornerPoint)).toBeFalsy();
    });

    it('does not allows append shape when any field is not free', () => {
        const timesShape = new Shape(redColor, ...points),
            cornerPoint = new Point(2, 4);

        area.appendShape(timesShape, cornerPoint);

        //--. 00.01.02.03.04.05.06.07.08.09.
        //00. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
        //01. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
        //02. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
        //03. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
        //04. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //05. [ ][ ][ ][X][ ][ ][ ][ ][ ][ ]
        //06. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //07. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
        //08. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]
        //09. [ ][ ][ ][ ][ ][ ][ ][ ][ ][ ]

        expect(area.canAppendShape(timesShape, new Point(2, 6))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(4, 4))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(3, 5))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(0, 4))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(0, 6))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(4, 6))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(2, 2))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(3, 3))).toBeFalsy();
        expect(area.canAppendShape(timesShape, new Point(1, 4))).toBeTruthy();
        expect(area.canAppendShape(timesShape, new Point(2, 3))).toBeTruthy();
    });

    it('throws an error when item cannot be append', () => {
        const timesShape = new Shape(redColor, ...points),
            cornerPoint = new Point(2, 4);

        area.appendShape(timesShape, cornerPoint);

        expect(() => {
            area.appendShape(timesShape, cornerPoint);
        }).toThrow(new RangeError('Shape cannot be inserted here.'));
    });

    describe('returns points which fill all rows or columns', () => {
        let filledRowsAndCells;

        beforeEach(() => {
            area = new Area(Config.MAP_SIZE);

            const horizontalPoints = [],
                verticalPoints = [];

            for (let i = 0; i < 10; ++i) {
                verticalPoints.push(new Point(0, i));

                // Blank place for line crossing
                if (2 === i || 4 === i) {
                    continue;
                }

                horizontalPoints.push(new Point(i, 0));
            }

            const horizontalLine = new Shape(redColor, ...horizontalPoints),
                verticalLine = new Shape(redColor, ...verticalPoints);

            area.appendShape(horizontalLine, new Point(0, 2));
            area.appendShape(horizontalLine, new Point(0, 4));
            area.appendShape(verticalLine, new Point(2, 0));
            area.appendShape(verticalLine, new Point(4, 0));

            filledRowsAndCells = area.filledRowsAndCells;
        });

        //--. 00.01.02.03.04.05.06.07.08.09.
        //00. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //01. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //02. [X][X][X][X][X][X][X][X][X][X]
        //03. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //04. [X][X][X][X][X][X][X][X][X][X]
        //05. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //06. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //07. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //08. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]
        //09. [ ][ ][X][ ][X][ ][ ][ ][ ][ ]

        it('as array', () => {
            expect(filledRowsAndCells).toBeArrayOfSize(36);
        });

        const fields = [
            '20', '21', '22', '23', '24', '25', '26', '27', '28', '29',
            '40', '41', '42', '43', '44', '45', '46', '47', '48', '49',
            '02', '12', '22', '32', '42', '52', '62', '72', '82', '92',
            '04', '14', '24', '34', '44', '54', '64', '74', '84', '94'
        ];

        fields.forEach((field) => {
            it(`- check ${field}`, () => {
                filledRowsAndCells = filledRowsAndCells.map(point => point.id);

                expect(filledRowsAndCells.indexOf(field)).not.toBe(-1);
            });
        });
    });

    it('clears taken fields', () => {
        const points = [];

        for (let i = 0; i < 5; ++i) {
            points.push(new Point(0, i));
        }

        const lineShape = new Shape(redColor, ...points);

        for (let cords of [[0, 0], [0, 5], [3, 0], [3, 5], [4, 2]]) {
            area.appendShape(lineShape, new Point(...cords));
        }

        let filledRowsAndCells = area.filledRowsAndCells,
            nonEmptyPoints = area.points.filter(item => null !== item[1]);

        expect(filledRowsAndCells).toBeArrayOfSize(20);
        expect(nonEmptyPoints).toBeArrayOfSize(25);

        area.clearFields(...filledRowsAndCells);

        filledRowsAndCells = area.filledRowsAndCells;
        nonEmptyPoints = area.points.filter(item => null !== item[1]);

        expect(filledRowsAndCells).toBeArrayOfSize(0);
        expect(nonEmptyPoints).toBeArrayOfSize(5);
    });

    it('add shape somewhere', () => {
        const shape = new Shape(redColor, ...points);

        expect(area.canAppendShapeAnywhere(shape)).toBeTruthy();
    });

    it('cannot add shape anywhere', () => {
        let shapePoints = [];

        for (let x = 0; x < 9; ++x) {
            for (let y = 0; y < 9; ++y) {
                shapePoints.push(new Point(x, y));
            }
        }

        let shape = new Shape(redColor, ...shapePoints);
        area.appendShape(shape, new Point(1, 1));

        shape = new Shape(redColor, new Point(0, 0), new Point(1, 1));
        expect(area.canAppendShapeAnywhere(shape)).toBeFalsy();
    });
});
