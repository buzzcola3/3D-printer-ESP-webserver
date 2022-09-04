import {WidgetsOnGrid} from "./WidgetsOnGrid.js";

var printerPowerStatus = 1;

window.printerPowerStatus = printerPowerStatus;


let mainGrid = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
window.mainGrid = mainGrid;

mainGrid.createWidget('widgetCreator', 5, 5, 1, 1);
//mainGrid.create('widgetCreator', 5, 6, 4, 1);

//mainGrid.tempCreateTest()
//mainGrid.tempCreateTest2()

//Tomorah, start making the widgetCreator