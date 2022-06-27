import {WidgetsOnGrid} from "./WidgetsOnGrid.js";

var printerPowerStatus = 1;

window.printerPowerStatus = printerPowerStatus;


let mainGrid = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
window.mainGrid = mainGrid;

mainGrid.create('powerButton', 2, 2, 1, 1);
