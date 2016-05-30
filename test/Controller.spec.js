'use strict';

import * as EventEmitter from 'event-emitter';
import * as pointsCompare from './matchers/pointsCompare';
import {Area} from '../src/app/Area';
import {Color} from '../src/app/Color';
import {Controller} from '../src/app/Controller';
import {Point} from '../src/app/Point';
import {Shape} from '../src/app/Shape';
import {Config} from './stub/gui/config';

describe('Controller Class', () => {
    const event = EventEmitter.default(),
        area = new Area(Config.MAP_SIZE),
        availableShapes = new Map();

    let controller,
        shape;

    beforeEach(() => {
        jasmine.addMatchers(pointsCompare.default);

        controller = new Controller(event, area, availableShapes);

        availableShapes.set(1, shape = new Shape(
            new Color(255, 0, 0),
            ...[
                new Point(1, 1),
                new Point(1, 2),
                new Point(2, 1),
                new Point(2, 2)
            ]
        ));
    });

    it('is initializable', () => {
        expect(controller instanceof Controller).toBeTruthy();
    });

    it('emits event after shape selection', () => {
        spyOn(event, 'emit');

        controller.selectProposition(0);
        expect(controller.selectedPoint).toBe(null);
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', null, null);

        controller.selectProposition(1);
        expect(controller.selectedPoint).toBeEqualWithPoint(4, 4);
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', 1, jasmine.any(Point));
    });

    it('cannot move shape when shape is not selected', () => {
        expect(controller.canMoveShape()).toBeFalsy();
    });

    it('can move shape when has been selected', () => {
        controller.selectProposition(1);
        expect(controller.canMoveShape()).toBeTruthy();
    });

    it('emits event after changing shape position', () => {
        spyOn(event, 'emit');

        controller.selectProposition(1);

        controller.moveUp();
        expect(controller.selectedPoint).toBeEqualWithPoint(4, 3);
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', 1, jasmine.any(Point));

        controller.moveLeft();
        expect(controller.selectedPoint).toBeEqualWithPoint(3, 3);
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', 1, jasmine.any(Point));

        controller.moveDown();
        expect(controller.selectedPoint).toBeEqualWithPoint(3, 4);
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', 1, jasmine.any(Point));

        controller.moveRight();
        expect(controller.selectedPoint).toBeEqualWithPoint(4, 4);
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', 1, jasmine.any(Point));
    });

    it('does not emit event during move the empty shape', () => {
        spyOn(event, 'emit');

        controller.moveUp();
        controller.moveLeft();
        controller.moveDown();
        controller.moveRight();

        expect(event.emit).not.toHaveBeenCalled();
    });

    it('does not emit event when shape cannot be moved', () => {
        spyOn(event, 'emit');

        controller.selectProposition(1); // [1]
        controller.moveUp(); // 4, 3 [2]
        controller.moveUp(); // 4, 2 [3]
        controller.moveUp(); // 4, 1 [4]
        controller.moveUp(); // 4, 0 [5]
        expect(controller.selectedPoint).toBeEqualWithPoint(4, 0);
        controller.moveUp(); // 4, 0 [5]
        expect(controller.selectedPoint).toBeEqualWithPoint(4, 0);
        expect(event.emit).toHaveBeenCalledTimes(5);


        controller.moveLeft(); // 3, 0 [6]
        controller.moveLeft(); // 2, 0 [7]
        controller.moveLeft(); // 1, 0 [8]
        controller.moveLeft(); // 0, 0 [9]
        expect(controller.selectedPoint).toBeEqualWithPoint(0, 0);
        controller.moveLeft(); // 0, 0 [9]
        expect(controller.selectedPoint).toBeEqualWithPoint(0, 0);
        expect(event.emit).toHaveBeenCalledTimes(9);

        controller.moveRight(); // 1, 0 [10]
        controller.moveRight(); // 2, 0 [11]
        controller.moveRight(); // 3, 0 [12]
        controller.moveRight(); // 4, 0 [13]
        controller.moveRight(); // 5, 0 [14]
        controller.moveRight(); // 6, 0 [15]
        controller.moveRight(); // 7, 0 [16]
        expect(controller.selectedPoint).toBeEqualWithPoint(7, 0);
        controller.moveRight(); // 7, 0 [16]
        expect(controller.selectedPoint).toBeEqualWithPoint(7, 0);
        expect(event.emit).toHaveBeenCalledTimes(16);

        controller.moveDown(); // 7, 1 [17]
        controller.moveDown(); // 7, 2 [18]
        controller.moveDown(); // 7, 3 [19]
        controller.moveDown(); // 7, 4 [20]
        controller.moveDown(); // 7, 5 [21]
        controller.moveDown(); // 7, 6 [22]
        controller.moveDown(); // 7, 7 [23]
        expect(controller.selectedPoint).toBeEqualWithPoint(7, 7);
        controller.moveDown(); // 7, 7 [23]
        expect(controller.selectedPoint).toBeEqualWithPoint(7, 7);
        expect(event.emit).toHaveBeenCalledTimes(23);
    });

    it('does not emit event during paste the empty shape', () => {
        spyOn(event, 'emit');

        controller.pasteBlock();

        expect(event.emit).not.toHaveBeenCalled();
    });

    it('emits event after paste shape (game is in progress)', () => {
        spyOn(area, 'canAppendShapeAnywhere').and.returnValue(true);

        spyOn(area, 'appendShape');
        spyOn(availableShapes, 'set');
        spyOn(event, 'emit');

        controller.selectProposition(1);

        expect(controller.pasteBlock()).toBeTruthy();
        expect(area.appendShape).toHaveBeenCalledWith(shape, jasmine.any(Point));
        expect(availableShapes.set).toHaveBeenCalledWith(1, null);
        expect(event.emit).toHaveBeenCalledWith('gui.appendedShape', 4);
        expect(event.emit).toHaveBeenCalledWith('gui.drawBlocks', shape, jasmine.any(Point));
        expect(event.emit).toHaveBeenCalledWith('gui.removeProposition', shape, 1);
        expect(event.emit).toHaveBeenCalledWith('gui.makeNewProposition', availableShapes, 1);
        expect(event.emit).toHaveBeenCalledWith('gui.removeFilledRowsAndCells');
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', null, null);
        expect(event.emit).not.toHaveBeenCalledWith('gui.gameOver');
    });

    it('emits event after paste shape (game is over)', () => {
        spyOn(area, 'canAppendShapeAnywhere').and.returnValue(false);
        spyOn(area, 'appendShape');
        spyOn(availableShapes, 'set');
        spyOn(event, 'emit');

        controller.selectProposition(1);

        expect(controller.pasteBlock()).toBeTruthy();
        expect(area.appendShape).toHaveBeenCalledWith(shape, jasmine.any(Point));
        expect(availableShapes.set).toHaveBeenCalledWith(1, null);
        expect(event.emit).toHaveBeenCalledWith('gui.appendedShape', 4);
        expect(event.emit).toHaveBeenCalledWith('gui.drawBlocks', shape, jasmine.any(Point));
        expect(event.emit).toHaveBeenCalledWith('gui.removeProposition', shape, 1);
        expect(event.emit).toHaveBeenCalledWith('gui.makeNewProposition', availableShapes, 1);
        expect(event.emit).toHaveBeenCalledWith('gui.removeFilledRowsAndCells');
        expect(event.emit).toHaveBeenCalledWith('gui.selectProposition', null, null);
        expect(event.emit).toHaveBeenCalledWith('gui.gameOver');
    });
});
