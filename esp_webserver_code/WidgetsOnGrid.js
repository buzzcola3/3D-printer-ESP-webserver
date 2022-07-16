import {addLineOfcode} from "./ManageCode.js";
import {WidgetStructure} from "./widgets.js";
import {ManageGrid} from "./grid.js";
import {parseWidgetCode} from "./WidgetJsonParser.js";

export class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px', family = 'none'){
        this.gridSegmentWidth = gridSegmentWidth;
        this.gridSegmentHeight = gridSegmentHeight;
        this.gridSegmentTopGap = gridSegmentTopGap;
        this.gridSegmentLeftGap = gridSegmentLeftGap;
        this.targetDivID = targetDivID;
        this.sizeUnit = sizeUnit;

        this.create = this.create;

        let gridID = targetDivID + '_grid';


        WidgetsOnGrid.grid.instances.push({
            treeStructAddr: undefined,
            targetDivID: targetDivID,
            gridID: gridID,
            gridSegmentWidth: gridSegmentWidth,
            gridSegmentHeight: gridSegmentHeight,
            gridSegmentTopGap: gridSegmentTopGap,
            gridSegmentLeftGap: gridSegmentLeftGap,
            sizeUnit: sizeUnit,
            gridWidth: undefined,
            gridHeight: undefined,
            lastKnownPointerPosition: {X: 'unchecked', Y: 'unchecked'},
        });


        let instance = WidgetsOnGrid.assignInstanceNumber(targetDivID)
        let gridInstance = WidgetsOnGrid.grid.instances[instance];
        this.gridInstance = gridInstance;


        let Tree = new WidgetStructure(targetDivID, gridID, ManageGrid.main.getGridEl(gridInstance));
        let gridParentObjAddr = WidgetStructure.getLastest();
        gridInstance.treeStructAddr = gridParentObjAddr;

        window.onresize = WidgetsOnGrid.resizeHandler;
        WidgetsOnGrid.displayGridOnScreen(gridParentObjAddr);

    }

    static grid = {instances: [], widgetSheet: {data: [], busy: false}};

    static assignInstanceNumber(targetDivID){
        let i = 0;
        
        while(1){
            if(WidgetsOnGrid.grid.instances[i].targetDivID === undefined){console.warn('instance could not be assigned'); return -1;}
            if(WidgetsOnGrid.grid.instances[i].targetDivID == targetDivID){return i;}
            i++;
        } 
    }

    static displayGridOnScreen(gridParentObjAddr){
        console.log(WidgetStructure.getAddressObj(gridParentObjAddr).display)
        console.log(WidgetStructure.getAddressObj(gridParentObjAddr));

        WidgetStructure.getAddressObj(gridParentObjAddr).display();

        
    }

    static resizeHandler(){ //mainGrid
        let i = 0;
        while(1){
            if(WidgetsOnGrid.grid.instances[i] === undefined){break;}
            WidgetsOnGrid.grid.instances[i].DivData = ManageGrid.main.update.size(WidgetsOnGrid.grid.instances[i]);
            i++;
        }
    }

}
window.WidgetsOnGrid = WidgetsOnGrid;