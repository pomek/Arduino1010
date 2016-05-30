'use strict';

import {Color} from '../src/app/Color';

describe('Color Class', () => {
    let color;

    beforeEach(() => {
        color = new Color(255, 100, 50);
    });

    it('is initializable', () => {
        expect(color instanceof Color).toBeTruthy();
    });

    it('returns color\'s details', () => {
        expect(color.r).toBe(255);
        expect(color.g).toBe(100);
        expect(color.b).toBe(50);
    });

    it('allows to clone object', () => {
        const clonedColor = color.clone();

        expect(clonedColor instanceof Color).toBeTruthy();
        expect(clonedColor).not.toBe(color);
        expect(clonedColor.hex).toBe(color.hex);
    });

    it('returns color as hex string', () => {
        expect(color.hex).toBe('ff6432');
        expect(new Color(255, 0, 0).hex).toBe('ff0000');
    });
});
