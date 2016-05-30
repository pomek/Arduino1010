'use strict';

import {Color} from '../src/app/Color';
import {Point} from '../src/app/Point';
import {GridHelper} from '../src/app/GridHelper';
import {Context} from './stub/Context';

describe('Grid Helper Class', () => {
    let point,
        context = new Context(),
        canvasPosition = new Map(),
        points = [
            point = new Point(0, 0),
            new Point(0, 1),
            new Point(1, 0),
            new Point(1, 1)
        ],
        gridHelper;

    beforeEach(() => {
        gridHelper = new GridHelper(/* <CanvasRenderingContext2D> */ context);

        canvasPosition.set('00', new Point(5, 5));
        canvasPosition.set('01', new Point(15, 5));
        canvasPosition.set('10', new Point(5, 15));
        canvasPosition.set('11', new Point(15, 15));
        canvasPosition.set('COLUMN_SIZE', 8);
    });

    it('is initializable', () => {
        expect(gridHelper instanceof GridHelper).toBeTruthy();
    });

    it('draws a border', () => {
        spyOn(context, 'save');
        spyOn(context, 'strokeRect');
        spyOn(context, 'restore');

        gridHelper.drawBorder(canvasPosition, null, ...points);

        expect(context.save).toHaveBeenCalled();
        expect(context.strokeRect).toHaveBeenCalledWith(3, 3, 55, 55);
        expect(context.strokeRect).toHaveBeenCalledWith(13, 3, 55, 55);
        expect(context.strokeRect).toHaveBeenCalledWith(3, 13, 55, 55);
        expect(context.strokeRect).toHaveBeenCalledWith(13, 13, 55, 55);
        expect(context.restore).toHaveBeenCalled();
    });

    it('draws a block', () => {
        spyOn(context, 'save');
        spyOn(context, 'fill');
        spyOn(context, 'restore');

        gridHelper.drawBlock(point, canvasPosition, new Color(255, 0, 0));

        expect(context.save).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
        expect(context.restore).toHaveBeenCalled();
    });
});
