import {WidgetsOnGrid} from "./WidgetsOnGrid.js";

var printerPowerStatus = 1;

window.printerPowerStatus = printerPowerStatus;


let mainGrid = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
window.mainGrid = mainGrid;

mainGrid.create('powerButton', 2, 2, 1, 1);

//let div = [];
//div[0] = document.createElement('div');
//div[0] = ManageDiv.passed.css.addCode(div[0], 'background-image: url("ref")', 'widgetsStyle');
//div[0] = ManageDiv.passed.css.addCode(div[0], 'transition: 1s', 'widgetsStyle');
//return div[0];