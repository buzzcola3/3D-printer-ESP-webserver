import {ManageCss} from "./ManageCss.js";
import {ManageDiv} from "./ManageDiv.js";
import {ManageGrid} from "./grid.js";


class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        this.gridSegmentWidth = gridSegmentWidth;
        this.gridSegmentHeight = gridSegmentHeight;
        this.gridSegmentTopGap = gridSegmentTopGap;
        this.gridSegmentLeftGap = gridSegmentLeftGap;

        this.targetDivID = targetDivID;
        this.sizeUnit = sizeUnit;
        
        let targetCssID = 'gridStyle_' + targetDivID;


        WidgetsOnGrid.gridInstances.push({
            targetDivID: targetDivID,
            targetCssID: targetCssID,
            gridSegmentWidth: gridSegmentWidth,
            gridSegmentHeight: gridSegmentHeight,
            gridSegmentTopGap: gridSegmentTopGap,
            gridSegmentLeftGap: gridSegmentLeftGap,
            sizeUnit: sizeUnit,
        });

        window.onresize = WidgetsOnGrid.resizeHandler;

        ManageGrid.main.create(targetDivID, targetCssID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit);
    }

    static resizeHandler(){
        let i = 0;
        while(1){
            if(WidgetsOnGrid.gridInstances[i] === undefined){break;}
            ManageGrid.main.update.size(WidgetsOnGrid.gridInstances[i].targetDivID, WidgetsOnGrid.gridInstances[i].targetCssID, WidgetsOnGrid.gridInstances[i].gridSegmentWidth, WidgetsOnGrid.gridInstances[i].gridSegmentHeight, WidgetsOnGrid.gridInstances[i].gridSegmentTopGap, WidgetsOnGrid.gridInstances[i].gridSegmentLeftGap, WidgetsOnGrid.gridInstances[i].sizeUnit);
            i++;
        }
        console.log(WidgetsOnGrid.gridInstances)
    }

    static gridInstances = []
}

let fff = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
let ffg = new WidgetsOnGrid('mainDiv1', 25, 25, 4, 4, 'px')