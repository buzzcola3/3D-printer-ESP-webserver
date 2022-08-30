import {WidgetsOnGrid} from "./WidgetsOnGrid.js";

var printerPowerStatus = 1;

window.printerPowerStatus = printerPowerStatus;


let mainGrid = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
window.mainGrid = mainGrid;

mainGrid.createWidget('widgetCreator', 3, 3, 2, 2);
//mainGrid.create('widgetCreator', 5, 6, 4, 1);

//mainGrid.tempCreateTest()
//mainGrid.tempCreateTest2()

//Tomorah, start making the widgetCreator