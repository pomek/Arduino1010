'use strict';

import * as EventEmitter from 'event-emitter';
import {Area} from './app/Area';
import {Controller} from './app/Controller';
import {Grid} from './app/Grid';
import {GridHelper} from './app/GridHelper';
import {ShapeFactory} from './app/ShapeFactory';
import {Config} from './app/gui/config';

const context = document.getElementById('arduino1010').getContext('2d'),
    event = EventEmitter.default(),
    availableBlocks = new Map(),
    canvasPositionMap = new Map(),
    gridFactory = new Grid(context),
    gridHelper = new GridHelper(context),
    socket = io('http://localhost:3050');

canvasPositionMap.set(0, gridFactory.draw(10, 10, 600, Config.GRID_SIZE, 4.5));
canvasPositionMap.set(1, gridFactory.draw(700, 17, 150, Config.SMALL_BLOCK_SIZE, 2.5));
canvasPositionMap.set(2, gridFactory.draw(700, 217, 150, Config.SMALL_BLOCK_SIZE, 2.5));
canvasPositionMap.set(3, gridFactory.draw(700, 417, 150, Config.SMALL_BLOCK_SIZE, 2.5));

context.font = "48px serif";
context.fillText("1.", 650, 50);
context.fillText("2.", 650, 250);
context.fillText("3.", 650, 450);

const gameArea = new Area(Config.MAP_SIZE),
    gameController = new Controller(event, gameArea, availableBlocks),
    shapeFactory = new ShapeFactory(Config.BLOCKS);

let points = 0,
    previousPoints = null;

event.on('gui.makeNewProposition', (availableBlocks, selectedKey) => {
    const newShape = shapeFactory.make();
    availableBlocks.set(selectedKey, newShape);

    newShape.points.forEach(point => {
        gridHelper.drawBlock(
            point,
            canvasPositionMap.get(selectedKey),
            newShape.color
        );
    });
});

event.on('gui.drawBlocks', (selectedShape, selectedPoint) => {
    selectedShape.points.forEach(point => {
        gridHelper.drawBlock(
            point.move(selectedPoint),
            canvasPositionMap.get(0),
            selectedShape.color
        );
    });
});

event.on('gui.removeProposition', (selectedShape, selectedIndex) => {
    gridHelper.clearBlocks(
        canvasPositionMap.get(selectedIndex),
        ...selectedShape.points
    );
});

event.on('gui.removeFilledRowsAndCells', () => {
    const pointsToRemove = gameArea.filledRowsAndCells;

    gridHelper.clearBlocks(canvasPositionMap.get(0), ...pointsToRemove);
    gameArea.clearFields(...pointsToRemove);
});

event.on('gui.selectProposition', (selectedKey, selectedPoint) => {
    const mainCanvasMap = canvasPositionMap.get(0);

    if (previousPoints) {
        gridHelper.drawBorder(mainCanvasMap, null, ...previousPoints);
        previousPoints = null;
    }

    const selectedShape = availableBlocks.get(selectedKey);

    if (!selectedShape || !selectedPoint) {
        return;
    }

    const status = gameArea.canAppendShape(selectedShape, selectedPoint);

    previousPoints = selectedShape.points.map(point => {
        return point.move(selectedPoint);
    });

    gridHelper.drawBorder(mainCanvasMap, status, ...previousPoints);
});

event.on('gui.gameOver', () => {
    socket.emit('control.gameOver');
    document.querySelector('.js-game-over').classList.remove('layer--hide');
});

event.on('gui.appendedShape', earnedPoints => {
    points += earnedPoints;

    document.querySelector('.js-score').innerText = points.toString();
});

socket.on('control.ready', () => {
    document.querySelector('.js-loader').classList.add('layer--hide');
});

socket.on('control.moveUp', () => {
    gameController.moveUp();
});

socket.on('control.moveLeft', () => {
    gameController.moveLeft();
});

socket.on('control.moveRight', () => {
    gameController.moveRight();
});

socket.on('control.moveDown', () => {
    gameController.moveDown();
});

socket.on('control.pasteBlock', () => {
    const result = gameController.pasteBlock();

    if (true === result) {
        socket.emit('control.pastedItem', null);
    }
});

socket.on('control.selectProposition', number => {
    gameController.selectProposition(number);

    if (0 === number) {
        socket.emit('control.selectedColor', null);
    } else {
        const shape = availableBlocks.get(number);
        socket.emit('control.selectedColor', shape.color.hex);
    }
});

socket.on('control.restart', () => {
    window.location.reload();
});

event.emit('gui.makeNewProposition', availableBlocks, 1);
event.emit('gui.makeNewProposition', availableBlocks, 2);
event.emit('gui.makeNewProposition', availableBlocks, 3);
