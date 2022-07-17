import {WidgetsOnGrid} from "./WidgetsOnGrid.js";

var printerPowerStatus = 1;

window.printerPowerStatus = printerPowerStatus;


let mainGrid = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
window.mainGrid = mainGrid;

//mainGrid.create('extruderTempreature', 2, 2, 1, 1);
//mainGrid.create('widgetCreator', 5, 6, 4, 1);

mainGrid.tempCreateTest()

//Tomorah, make the grid in grid with removed unnessesarew shat