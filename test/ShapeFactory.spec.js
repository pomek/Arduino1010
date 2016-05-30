'use strict';

import {ShapeFactory} from '../src/app/ShapeFactory';
import {Shape} from '../src/app/Shape';
import {Config} from './stub/gui/config';

describe('ShapeFactory Class', () => {
    let shapeFactory;

    beforeEach(() => {
        shapeFactory = new ShapeFactory(Config.BLOCKS);
    });

    it('is initializable', () => {
        expect(shapeFactory instanceof ShapeFactory).toBeTruthy();
    });

    it('make random object', () => {
        const shapes = [
            shapeFactory.make(),
            shapeFactory.make()
        ];

        expect(shapes[0] instanceof Shape).toBeTruthy();
        expect(shapes[1] instanceof Shape).toBeTruthy();
        expect(shapes[0]).not.toBe(shapes[1]);
    });
});
