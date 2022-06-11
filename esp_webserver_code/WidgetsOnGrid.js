import {ManageCss} from "./ManageCss.js";
import {ManageDiv} from "./ManageDiv.js";
import {ManageGrid} from "./grid.js";

//test
var printerPowerStatus = 1;
//!test

class WidgetsOnGrid{
    constructor(targetDivID, gridSegmentWidth, gridSegmentHeight, gridSegmentTopGap, gridSegmentLeftGap, sizeUnit = 'px'){
        this.gridSegmentWidth = gridSegmentWidth;
        this.gridSegmentHeight = gridSegmentHeight;
        this.gridSegmentTopGap = gridSegmentTopGap;
        this.gridSegmentLeftGap = gridSegmentLeftGap;

        let child = document.createElement('div');
        child.id = targetDivID + '_grid';
        document.getElementById(targetDivID).appendChild(child)

        let gridID = child.id;
        this.gridID = gridID;

        this.targetDivID = targetDivID;
        this.sizeUnit = sizeUnit;
        
        let targetCssID = 'gridStyle_' + targetDivID;
        this.targetCssID = targetCssID;


        WidgetsOnGrid.gridInstances.push({ // ----------------<-----------------<------- USE THIZ
            widgetList: [],
            targetDivID: targetDivID,
            targetCssID: targetCssID,
            gridID: gridID,
            gridSegmentWidth: gridSegmentWidth,
            gridSegmentHeight: gridSegmentHeight,
            gridSegmentTopGap: gridSegmentTopGap,
            gridSegmentLeftGap: gridSegmentLeftGap,
            sizeUnit: sizeUnit,
            gridWidth: undefined,
            gridHeight: undefined,
        });

        let instance = WidgetsOnGrid.assignInstanceNumber(targetDivID)
        this.instance = instance;

        window.onresize = WidgetsOnGrid.resizeHandler;

        ManageGrid.main.create(WidgetsOnGrid.gridInstances[instance]);
    }

    

    create(widget, height, width, posX, posY){
        let gridInstance = WidgetsOnGrid.gridInstances[this.instance]

        let targetWidgetIndex = WidgetsOnGrid.getListId(widget, height, width, posX, posY, gridInstance);
        WidgetsOnGrid.checkFixInputSize(gridInstance.widgetList, targetWidgetIndex);
        WidgetsOnGrid.getGridPositionClass(gridInstance, targetWidgetIndex);

        let newWidgetDiv;
        newWidgetDiv = WidgetsOnGrid.createWidgetContent(gridInstance.widgetList, targetWidgetIndex);
        newWidgetDiv = WidgetsOnGrid.appendWidgetSize(newWidgetDiv, gridInstance.widgetList, targetWidgetIndex);
        newWidgetDiv = WidgetsOnGrid.appendElementAttributes(newWidgetDiv, gridInstance.widgetList, targetWidgetIndex);
        WidgetsOnGrid.placeDivOnScreen(newWidgetDiv, this.gridID);

        gridInstance.widgetList[targetWidgetIndex].WidgetData.jsSetup();
    }

    move(index, newTopLeftPosition){
        let gridInstance = WidgetsOnGrid.gridInstances[this.instance]

        let width = gridInstance.widgetList[index].Width
        let height = gridInstance.widgetList[index].Height
    
        let oldPositionClassName = gridInstance.widgetList[index].gridPositionClass;
        let newPositionClassName = ManageGrid.get.positionClass(gridInstance, newTopLeftPosition, width, height);
    
        if(newPositionClassName === undefined){return;}
        if(oldPositionClassName == newPositionClassName){return;}
    
        removeGridPositionClass(index);
        gridInstance.widgetList[index].gridPositionClass = newPositionClassName;
    
        ManageCss.byId.replace(oldPositionClassName, newPositionClassName, 'widgetID_' + index)
    }


    static gridInstances = [];

    static assignInstanceNumber(targetDivID){
        let i = 0;
        
        while(1){
            if(WidgetsOnGrid.gridInstances[i].targetDivID === undefined){console.warn('instance could not be assigned'); return -1;}
            if(WidgetsOnGrid.gridInstances[i].targetDivID == targetDivID){return i;}
            i++;
        }
        
    }

    static resizeHandler(){ //mainGrid
        let i = 0;
        while(1){
            if(WidgetsOnGrid.gridInstances[i] === undefined){break;}
            ManageGrid.main.update.size(WidgetsOnGrid.gridInstances[i]);
            i++;
        }
    }

    static getGridPositionClass(instance, index){
        let height = instance.widgetList[index].Height;
        let width = instance.widgetList[index].Width;
        let topLeft = instance.widgetList[index].TopLeftPosition;
    
        let gridClassName = ManageGrid.get.positionClass(instance, topLeft, width, height);
        instance.widgetList[index].gridPositionClass = gridClassName;
    }


    static getListId(widget, height, width, posX, posY, instance){
        console.log(instance.widgetList);
        console.log(instance)
        let newWidget = {
            Index: undefined,
            rotated: 0,
            Height: height,
            Width: width,
            gridPositionClass: undefined,
            WidgetData: undefined,
            //duplicateOf: getDuplicateWidgetIndex(widget),
            TopLeftPosition: {X: posX, Y: posY,},
        }
    
        let id = 0;
        while(1){
            if(typeof instance.widgetList[id] === 'undefined' || instance.widgetList[id].Index == -1){
                newWidget.Index = id;
                instance.widgetList[id] = newWidget;
                break;
            }
            id++;
        }

        instance.widgetList[id].WidgetData = WidgetsOnGrid.getWidgetData(widget, id, instance);
        WidgetsOnGrid.widgetCode.push({widget: widget, code: instance.widgetList[id].WidgetData.jsFunction});

        console.log(WidgetsOnGrid.widgetCode)
        return id;
    }

    static widgetCode = [];

    static runWidgetCode(widgetName){
        console.log('widgetClicked: ' + widgetName)
        let i = 0;
        while(1){
            if(WidgetsOnGrid.widgetCode[i] === undefined){return;}
            if(WidgetsOnGrid.widgetCode[i].widget == widgetName){break;}
            i++;
        }
        WidgetsOnGrid.widgetCode[i].code();
    }

    static createWidgetContent(widgetList, index){
        let widgetStructure = widgetList[index].WidgetData.widgetStructure();
        if(widgetStructure === undefined){return document.createElement('div');}
        return widgetStructure;
    }

    static appendWidgetSize(newWidgetDiv, widgetList, index){
        newWidgetDiv.classList.add(widgetList[index].gridPositionClass);
        return newWidgetDiv;
    }

    static appendElementAttributes(currentDiv, widgetList, index){
        let code = widgetList[index].WidgetData.divHTML;

        if(code.indexOf('=') == -1){return -1;}

        let attName = code.slice(0, code.indexOf('='))

        code = code.slice(code.indexOf('=')+1)

        let endChar = 0;
        let i = 0;
        while(1){
            if(code.charAt(i) == ''){break;}
            while(1){
                if(code.charAt(i) == ''){break;}
    
                if(code.charAt(i) == '('){
                    while(1){
                        if(code.charAt(i) == ')'){break;}
                        i++;
                        if(code.charAt(i) == ''){console.warn('element attribute syntax Error'); break;}
                    }
                }
                if(code.charAt(i) == '"'){endChar = i; currentDiv.setAttribute(attName, code.slice(0+1,i));}
                i++;
            }
            
            code = code.slice(endChar+1);
            i++;
        }
        return currentDiv;
    }

    static placeDivOnScreen(currentDiv, targetElementID){
        console.log(currentDiv);
        document.getElementById(targetElementID).appendChild(currentDiv);
    }

    static checkFixInputSize(widgetList, index){
        let minWidth = widgetList[index].WidgetData.sizeLimits.MinWidth;
        let maxWidth = widgetList[index].WidgetData.sizeLimits.MaxWidth;
        let minHeight = widgetList[index].WidgetData.sizeLimits.MinHeight;
        let maxHeight = widgetList[index].WidgetData.sizeLimits.MaxHeight;
    
        let targetWidth = widgetList[index].Width;
        let targetHeight = widgetList[index].Height;
    
        if(targetWidth < minWidth){console.warn('Widget width of ' + targetWidth + ' is too small, using: ' + minWidth); targetWidth = minWidth;}
        if(targetWidth > maxWidth){console.warn('Widget width of ' + targetWidth + ' is too large, using: ' + maxWidth); targetWidth = maxWidth;}
    
        if(targetHeight < minHeight){console.warn('Widget height of ' + targetHeight + ' is too small, using: ' + minHeight); targetHeight = minHeight;}
        if(targetHeight > maxHeight){console.warn('Widget height of ' + targetHeight + ' is too large, using: ' + maxHeight); targetHeight = maxHeight;}
    
        widgetList[index].Width = targetWidth;
        widgetList[index].Height = targetHeight;

        WidgetsOnGrid.checkAspectRatio(widgetList, index);

        return;
    }

    static checkAspectRatio(widgetList, index){

        console.log(widgetList[index].WidgetData.acceptableAspectRatios[0])
    
        let i = 0;
    
        while(1){
            if(widgetList[index].WidgetData.acceptableAspectRatios[i] === undefined){break;}
    
            let targetAspectRatioWidth = widgetList[index].WidgetData.acceptableAspectRatios[i].width;
            let targetAspectRatioHeight = widgetList[index].WidgetData.acceptableAspectRatios[i].height;
    
            let targetWidth = widgetList[index].Width;
            let targetHeight = widgetList[index].Height;
        
            if(targetAspectRatioWidth/targetAspectRatioHeight == targetWidth/targetHeight){return;}
            i++;
        }
    
        console.warn('wrong aspectRatio');
    }

    static getWidgetData(name, index, instance){
        function widgetStructure(){}
        function jsFunction(){}
        function jsSetup(){}
        function jsUnsetup(){}
    
        let divHTML = '';
        let widget = {name: name, sizeLimits: 'unknown', acceptableAspectRatios: [undefined], widgetStructure, jsSetup, jsUnsetup, jsFunction, divHTML}
    
    
        let currentWidget = 'widgetID_' + index;
    
        if(name == 'powerButton'){
    
            widget.sizeLimits = {MinWidth: 1, MaxWidth: 6, MinHeight: 1, MaxHeight: 6};
            widget.acceptableAspectRatios = [{width: 1, height: 1}];
    
            widget.widgetStructure = function(){
                let div = [];
    
                div[0] = document.createElement('div')
                div[0] = ManageDiv.passed.css.addCode(div[0], 'background-image: url("powerRed.svg")', 'widgetsStyle');
                div[0] = ManageDiv.passed.css.addCode(div[0], 'transition: 1s', 'widgetsStyle');
                return div[0];
            }
    
            widget.jsFunction = function(){
                console.log('powerButton sz Hi');
                if(printerPowerStatus == 1){printerPowerStatus = 0, ManageDiv.existing.css.replaceClass('background-image: url("powerGreen.svg")', 'background-image: url("powerRed.svg")', 'widgetsStyle'); return;}
                if(printerPowerStatus == 0){printerPowerStatus = 1, ManageDiv.existing.css.replaceClass('background-image: url("powerRed.svg")', 'background-image: url("powerGreen.svg")', 'widgetsStyle'); return;}
            }
    
            widget.jsSetup = function(){
                if(printerPowerStatus == 1){ManageDiv.existing.css.replaceClass('background-image: url("powerRed.svg")', 'background-image: url("powerGreen.svg")', 'widgetsStyle'); return;}
                if(printerPowerStatus == 0){ManageDiv.existing.css.replaceClass('background-image: url("powerGreen.svg")', 'background-image: url("powerRed.svg")', 'widgetsStyle'); return;}
            }
    
            widget.divHTML = 'onclick="WidgetsOnGrid.runWidgetCode(' + ('"' + name + '"') + ')"'
    
            return widget;
        }
    
        if(name == 'extruderTempreature'){
    
            widget.sizeLimits = {MinWidth: 2, MaxWidth: 2, MinHeight: 1, MaxHeight: 1};
            widget.acceptableAspectRatios = [{width: 2, height: 1}];
    
            widget.widgetStructure = function(){
                let div = [];
    
                div[2] = document.createElement('div');
                div[2] = ManageDiv.passed.css.addCode(div[2], 'font-weight: 700', 'widgetsStyle');
                div[2] = ManageDiv.passed.css.addCode(div[2], 'text-align: center', 'widgetsStyle');
                div[2] = ManageDiv.passed.css.addCode(div[2], 'line-height: ' + instance.gridSegmentHeight + instance.sizeUnit, 'widgetsStyle');
                div[2].innerText = "50°C";
                div[2].classList.add(ManageGrid.create.css.sizeClass(1, 1, instance.gridSegmentWidth, instance.gridSegmentHeight, instance.gridSegmentLeftGap, instance.gridSegmentTopGap, instance.sizeUnit, instance.targetCssID));
    
                div[1] = document.createElement('img');
                div[1].src = "./extruderIcon.svg";
                div[1].classList.add(ManageGrid.create.css.sizeClass(1, 1, instance.gridSegmentWidth, instance.gridSegmentHeight, instance.gridSegmentLeftGap, instance.gridSegmentTopGap, instance.sizeUnit, instance.targetCssID));
    
                div[0] = document.createElement('div');
                div[0] = ManageDiv.passed.css.addCode(div[0], 'background-color: white', 'widgetsStyle');
                div[0] = ManageDiv.passed.css.addCode(div[0], 'display: flex', 'widgetsStyle');
                div[0] = ManageDiv.passed.css.addCode(div[0], 'flex-wrap: wrap', 'widgetsStyle');
                div[0] = ManageDiv.passed.css.addCode(div[0], 'border-radius: 10px', 'widgetsStyle')
                div[0] = ManageDiv.passed.css.addCode(div[0], 'justify-content: space-between', 'widgetsStyle')
                div[0].appendChild(div[1]); div[1] = undefined;
                div[0].appendChild(div[2]); div[2] = undefined;
    
                return div[0];
            }
    
            widget.jsSetup = function(){ManageCss.byId.replace('none', 'extruderTempreature', currentWidget);}
    
            widget.jsUnsetup = function(){console.log('bye');}
    
            widget.jsFunction = function(){console.log('still here');}
    
            widget.divHTML = 'onclick="widgetList[' + index + '].WidgetData.jsFunction()"';
    
            return widget;
        }
    
        if(name == 'widgetMoveWidget'){
            widget.sizeLimits = {MinWidth: 1, MaxWidth: 2, MinHeight: 1, MaxHeight: 2};
            widget.acceptableAspectRatios = [{width: 1, height: 1}];
    
            widget.widgetStructure = function(){
                let div = [];
    
                div[0] = document.createElement('img');
                div[0].src = "./moveDragIcon1.svg"
                div[0].setAttribute('draggable', false)
                div[0] = ManageDiv.passed.css.addCode(div[0], 'background-color: white', 'widgetsStyle');
                div[0] = ManageDiv.passed.css.addCode(div[0], 'border-radius: 10px', 'widgetsStyle');
                
    
                return div[0];
            }
    
            widget.jsSetup = function(){movingWidgets = 0;}
    
            widget.jsUnsetup = function(){movingWidgets = undefined;}
    
            widget.jsFunction = function(){
                console.log('move still here');
    
                movingWidgets = !movingWidgets;
    
                if(movingWidgets == 1){
                    cursorPosition = document.getElementById('mainDiv')
                    cursorPosition.onpointermove = pointerMove
                    
                    
                    
                    function pointerMove(event){
                        let cursor = cursorPositionToGridPosition(event.layerX, event.layerY)
                        if(cursor === undefined){return;}
    
                        let targetElement = event.path[0].id
                        if(targetElement.includes('widgetID_') == false){return;}
                        targetElement.replace('widgetID_', '')
                        
                        if(targetElement == index){return;}
    
                        moveWidget(index, cursor)
                        console.log(event.path[0].id);
                        }
                    return;
                }
    
                if(movingWidgets == 0){
                    cursorPosition.onpointermove = undefined;
                    cursorPosition.onpointerdown = undefined;
                    cursorPosition = undefined;
                    return;
                }
    
            
            }
    
            widget.divHTML = 'onclick="widgetList[' + index + '].WidgetData.jsFunction()"';
    
            return widget;
        }
    
        return widget;
    }
}
window.WidgetsOnGrid = WidgetsOnGrid;

let fff = new WidgetsOnGrid('mainDiv', 50, 50, 8, 8, 'px')
//let ffg = new WidgetsOnGrid('mainDiv1', 25, 25, 4, 4, 'px')

fff.create('powerButton', 2, 2, 1, 2);
console.log(fff.widgetList)