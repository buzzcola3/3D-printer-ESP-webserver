import {addLineOfcode} from "./ManageCode.js";
import {WidgetStructure} from "./widgets.js";
import {ManageGrid} from "./grid.js";
import {parseWidgetCode} from "./WidgetJsonParser.js";

export class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        let gridSizes = {};
        
        gridSizes.gridSegmentWidth = gridSegmentWidth;
        gridSizes.gridSegmentHeight = gridSegmentHeight;
        gridSizes.gridSegmentTopGap = gridSegmentTopGap;
        gridSizes.gridSegmentLeftGap = gridSegmentLeftGap;
        gridSizes.targetDivID = targetDivID;
        gridSizes.sizeUnit = sizeUnit;

        this.gridSizes = gridSizes;


        let gridID = targetDivID + '_grid';


        //create new structure with grid as root element
        const gridMainClassOfTreeStructure = new WidgetStructure(targetDivID, gridID, ManageGrid.main.getGridEl(gridSizes));
        this.gridMainClassOfTreeStructure = gridMainClassOfTreeStructure;

        //get the root element
        let gridParentObj = WidgetStructure.getLastestObject();
        gridParentObj.divCode.id = gridParentObj.addressID;
        gridParentObj.gridSizes = gridSizes;
        this.gridParentObj = gridParentObj;

        //add to list of grids
        WidgetsOnGrid.gridList.push(gridParentObj.address);

        
        window.onresize = WidgetsOnGrid.resizeHandler;

        gridParentObj.display();

        //console.log(WidgetStructure.widgetTree);
        console.log(WidgetsOnGrid.gridList);
    }

    static appendSubGridCode(targetObj, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        let gridSizes = {};
        
        gridSizes.gridSegmentWidth = gridSegmentWidth;
        gridSizes.gridSegmentHeight = gridSegmentHeight;
        gridSizes.gridSegmentTopGap = gridSegmentTopGap;
        gridSizes.gridSegmentLeftGap = gridSegmentLeftGap;
        gridSizes.targetDivID = targetObj.addressID;
        gridSizes.sizeUnit = sizeUnit;

        this.gridSizes = gridSizes;

        targetObj.gridSizes = gridSizes;

        ManageGrid.main.getGridEl(gridSizes, targetObj.divCode)
        
        WidgetsOnGrid.gridList.push(targetObj.address);

        return targetObj;
    }

    static gridList = [] //stores element ID of each grid

    static grid = {instances: [], widgetSheet: {data: [], busy: false}};

    static resizeHandler(){ //mainGrid
        WidgetsOnGrid.gridList.forEach((gridAddr) => {
            ManageGrid.main.update.size(WidgetStructure.getAddressObj(gridAddr).divCode, WidgetStructure.getAddressObj(gridAddr).gridSizes);
        })
    }

    createWidget(widget, height, width, posX, posY){

        let _0 = WidgetStructure.createChild(this.gridParentObj.address)
    
        ManageGrid.create.positionClass(this.gridSizes, 2, 2, {X:2, Y:2}, _0.divCode)
        
        let _00 = WidgetStructure.createChild(_0.address)
        WidgetsOnGrid.appendSubGridCode(_00, 20, 20, 2, 2);

        _0.display();
        _00.display();

        WidgetsOnGrid.fetchWidgetDataFromJson(widget);

    }

//    tempCreateTest(height = 2, width = 2, posX = 3, posY = 2){
//        console.log('TEST:')
//        let TLpos = {X: posX, Y: posY}
//
//        let _ = this.gridInstance.treeStructAddr;
//
//        let element = ManageGrid.create.positionClass(this.gridInstance, width, height, TLpos);
//        let _0 = this.gridMainClassOfTreeStructure.createChild(_, element)
//        
//
//        _0.display();
//        let widgetEX = new WidgetsOnGrid(_0.addressID, 27, 27, 0, 0);
//        widgetEX.tempCreateTest2();
//
//        console.log(WidgetStructure.widgetTree)
//        console.log(_0)
//        console.log('!TEST')
//    }


    static async fetchWidgetDataFromJson(widgetName, retry = 0){
        if(WidgetsOnGrid.grid.widgetSheet.busy == true){
            retry++;
            if(retry ==  20){console.error('failed To fetch the Widget'); return;}
            setTimeout( function(){WidgetsOnGrid.fetchWidgetDataFromJson(widgetName, retry)}, 100);
            return;
        };
        console.log('fetching: ' + widgetName)
        WidgetsOnGrid.grid.widgetSheet.busy = true;

        let data = await fetch('./widgets.json')
        let out = await data.json();
        {
            if(await out[widgetName] === undefined){console.error("widget not found")}
            else{
                WidgetsOnGrid.grid.widgetSheet.busy = false;

                WidgetsOnGrid.grid.widgetSheet.data.push(out[widgetName]);
                

                return;
            }
        }
    }
}
window.WidgetsOnGrid = WidgetsOnGrid;