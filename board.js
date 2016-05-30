'use strict';

const five = require('johnny-five'),
    board = new five.Board();

const BLINK_TIME = 500;

module.exports = (socket) => {
    let isInitializable = false,
        previousValue = null,
        joystick = null,
        resetButton,
        putButton = null,
        greenLed = null,
        ledMap = new Map(),
        buttonMap = new Map(),
        joystickEnabled = true,
        redLed_1 = null,
        redLed_2 = null;

    socket.on('connection', socket => {
        reloadGame();

        if (isInitializable) {
            socket.emit('control.ready');
        }

        socket.on('control.pastedItem', () => {
            clearLeds();
        });

        socket.on('control.gameOver', () => {
            greenLed.stop();
            greenLed.off();

            redLed_1.blink(BLINK_TIME);

            setTimeout(() => {
                redLed_2.blink(BLINK_TIME);
            }, BLINK_TIME);
        });
    });

    board.on('ready', function () {
        isInitializable = true;
        socket.emit('control.ready');

        greenLed = new five.Led(1).off();
        redLed_1 = new five.Led(2).off();
        redLed_2 = new five.Led(3).off();
        joystick = new five.Joystick({
            pins: ['A0', 'A1']
        });
        putButton = new five.Button(4);
        resetButton = new five.Button(13);

        greenLed.blink(BLINK_TIME);

        const config = [
            {led: 11, button: 12, value: 1},
            {led: 8, button: 9, value: 2},
            {led: 6, button: 7, value: 3}
        ];

        config.forEach((item, index) => {
            const led = new five.Led(item.led),
                button = new five.Button(item.button);

            ledMap.set(index, led);
            buttonMap.set(index, button);

            button.on('up', () => {
                for (let ledItem of ledMap.values()) {
                    ledItem.off();
                }

                if (previousValue === item.value) {
                    previousValue = 0;
                } else {
                    led.on();
                    previousValue = item.value;
                }

                socket.emit('control.selectProposition', previousValue);
            });
        });

        joystick.on('change', function () {
            if (false === joystickEnabled) {
                return;
            }

            let movedPoint = false;

            if (this.x > 0.7) {
                movedPoint = true;
                socket.emit('control.moveRight');
            } else if (this.x < -0.7) {
                movedPoint = true;
                socket.emit('control.moveLeft');
            }

            if (this.y > 0.7) {
                movedPoint = true;
                socket.emit('control.moveDown');
            } else if (this.y < -0.7) {
                movedPoint = true;
                socket.emit('control.moveUp');
            }

            if (movedPoint) {
                joystickEnabled = false;

                setTimeout(() => {
                    joystickEnabled = true;
                }, 200);
            }
        });

        putButton.on('up', () => {
            socket.emit('control.pasteBlock');
        });

        resetButton.on('up', () => {
            socket.emit('control.restart');
        });
    });

    function clearLeds () {
        if (!isInitializable) {
            return;
        }

        previousValue = null;

        for (let ledItem of ledMap.values()) {
            ledItem.off();
        }
    }

    function reloadGame () {
        clearLeds();

        if (redLed_1) {
            redLed_1.stop();
            redLed_1.off();
        }

        if (redLed_2) {
            redLed_2.stop();
            redLed_2.off();
        }

        if (greenLed) {
            greenLed.blink(BLINK_TIME);
        }
    }
};
