import {ManageCss, ManageWidget} from "./ManageCss.js";

import {addLineOfcode, removeLineOfcode, replaceLineOfCode} from "./ManageCode.js";
import { WidgetStructure } from "./widgets.js";
import { WidgetsOnGrid } from "./WidgetsOnGrid.js";
import { parseWidgetCode } from "./WidgetJsonParser.js";

export var ManageGrid = {
    main: {

        getGridEl: function(sizes, element = document.createElement('div')){
            //ManageGrid.main.updateSizes(instance);

            let height = sizes.gridHeight;
            let width = sizes.gridWidth;


            if(height === undefined){height = 0;}
            if(width === undefined){width = 0}



            element = addLineOfcode(element, 'margin: 0 auto');
            element = addLineOfcode(element, 'top: 50%');
            element = addLineOfcode(element, 'transform: translateY(-50%)');

            element = addLineOfcode(element, 'display: grid');
            element = addLineOfcode(element, 'justify-items: center');
            element = addLineOfcode(element, 'grid-template-columns: repeat(' + width + ',' + sizes.gridSegmentWidth + sizes.sizeUnit + ')');
            element = addLineOfcode(element, 'grid-template-rows: repeat('+ height +',' + sizes.gridSegmentHeight + sizes.sizeUnit + ')');
            element = addLineOfcode(element, 'row-gap:' + sizes.gridSegmentLeftGap + sizes.sizeUnit);
            element = addLineOfcode(element, 'column-gap:' + sizes.gridSegmentTopGap + sizes.sizeUnit);
            element = addLineOfcode(element, 'overflow: auto');
            element = addLineOfcode(element, 'position: relative');

            return element;
        },

        update: {
            size: function(gridElement, sizes = undefined){ //gridElement to check the size, modify and return, sizes to speed up the process 

                if(document.getElementById(gridElement.id) === null){return gridElement};
                
                //if(size === undefined){extract sizes from gridElement}
                //else use the sizes

                let oldHeight = sizes.gridHeight;
                let oldWidth = sizes.gridWidth;
                if(oldHeight === undefined){oldHeight = 0;}
                if(oldWidth === undefined){oldWidth = 0}

                ManageGrid.main.updateSizes(gridElement, sizes);

                let newHeight = sizes.gridHeight
                let newWidth = sizes.gridWidth

                //let newDivData = WidgetStructure.getAddressObj(instance.treeStructAddr).divCode;

                if(oldHeight == newHeight && oldWidth == newWidth){return gridElement;}


                replaceLineOfCode(gridElement, 'grid-template-columns: repeat(' + oldWidth + ',' + sizes.gridSegmentWidth + sizes.sizeUnit + ')', 'grid-template-columns: repeat(' + newWidth + ',' + sizes.gridSegmentWidth + sizes.sizeUnit + ')');
                replaceLineOfCode(gridElement, 'grid-template-rows: repeat('+ oldHeight +',' + sizes.gridSegmentHeight + sizes.sizeUnit + ')','grid-template-rows: repeat('+ newHeight +',' + sizes.gridSegmentHeight + sizes.sizeUnit + ')');

                return gridElement;
            },

        },

        get: {
            height: function(gridElement, sizes){
                //let displayHeight = window.innerHeight;
                let divHeight = gridElement.parentElement.clientHeight;
                let oneGrid = sizes.gridSegmentHeight;
                let oneGap = sizes.gridSegmentTopGap;

                let i = 0;
                while(1){
                    if(divHeight < oneGrid){break;}
                    divHeight = divHeight - (oneGrid + oneGap);
                    i++;
                }
                if(divHeight > sizes.gridSegmentHeight + (2*sizes.gridSegmentTopGap)){i++;}
                return i;
            },

            width: function(gridElement, sizes){
                //let displayWidth = window.innerWidth;
                let divWidth = gridElement.parentElement.clientWidth;
                let oneGrid = sizes.gridSegmentWidth;
                let oneGap = sizes.gridSegmentLeftGap;

                let i = 0;
                while(1){
                    if(divWidth < oneGrid){break;}
                    divWidth = divWidth - (oneGrid + oneGap);
                    i++;
                }
                if(divWidth > sizes.gridSegmentHeight + (2*sizes.gridSegmentTopGap)){i++;}
                return i;
            },

            heightPx: function(instance){
                let oneGrid = instance.gridSegmentHeight;
                let oneGap = instance.gridSegmentLeftGap;
                let gridNumber = instance.gridHeight;
                let gapNumber = gridNumber-1;

                let totalSize = (oneGap*gapNumber) + (oneGrid*gridNumber)
                return totalSize;
            },

            widthPx: function(instance){
                let oneGrid = instance.gridSegmentWidth;
                let oneGap = instance.gridSegmentTopGap;
                let gridNumber = instance.gridWidth;
                let gapNumber = gridNumber-1;

                let totalSize = (oneGap*gapNumber) + (oneGrid*gridNumber)
                return totalSize;
            },
        },

        updateSizes: function(gridElement, sizes){
            let heightPx;
            let widthPx;


                    sizes.gridHeight = ManageGrid.main.get.height(gridElement, sizes);
                    sizes.gridWidth = ManageGrid.main.get.width(gridElement, sizes);
        
                    heightPx = ManageGrid.main.get.heightPx(sizes)
                    widthPx = ManageGrid.main.get.widthPx(sizes)


            let unit = sizes.sizeUnit;
            gridElement.setAttribute('style', 'width: ' + widthPx + unit +'; height: ' + heightPx + unit + ';');
            
        },
    },

    create: {

        positionClass: function(sizesByPixel, width, height, TopLeftPosition, targetDiv = document.createElement('div')){
            if(width === undefined){console.warn('No width provided'); return undefined;}
            if(height === undefined){console.warn('No height provided'); return undefined;}
            if(TopLeftPosition.X === undefined){console.warn('No X provided'); return undefined;}
            if(TopLeftPosition.Y === undefined){console.warn('No Y provided'); return undefined;}
        
            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;

            let widthPx = sizesByPixel.gridSegmentWidth * width;
            let heightPx = sizesByPixel.gridSegmentHeight * height;
            let leftGapPx = sizesByPixel.gridSegmentLeftGap * (width-1);
            let topGapPx = sizesByPixel.gridSegmentTopGap * (height-1);

            
        

            targetDiv = addLineOfcode(targetDiv, 'height: ' + (heightPx + topGapPx) + sizesByPixel.sizeUnit);
            targetDiv = addLineOfcode(targetDiv, 'width: ' + (widthPx + leftGapPx) + sizesByPixel.sizeUnit);
            targetDiv = addLineOfcode(targetDiv, 'grid-row-start: ' + ymin);
            targetDiv = addLineOfcode(targetDiv, 'grid-row-end: ' + ymax);
            targetDiv = addLineOfcode(targetDiv, 'grid-column-start: ' + xmin);
            targetDiv = addLineOfcode(targetDiv, 'grid-column-end: ' + xmax);
            targetDiv = addLineOfcode(targetDiv, 'transition: 1s');
            
        
            return targetDiv;
        }, 

        css: {
            sizeClass: function(width, height, instance){ //user

                let cssCode = '.grid_' + width + 'x' + height;
            
                let name = cssCode.slice(1);
                
                if(document.getElementById(instance.targetCssID).innerText.includes(cssCode)){return name;}
            
                cssCode += '{\r';
                cssCode += 'grid-row-span: ' + width + ';\r'; 
                cssCode += 'grid-column-span: ' + height + ';\r';
                cssCode += 'height: ' + ( (instance.gridSegmentHeight * height) + (instance.gridSegmentTopGap * (height-1)) ) + instance.sizeUnit + ';\r';
                cssCode += 'width: ' + ( (instance.gridSegmentWidth * width) + (instance.gridSegmentLeftGap * (width-1)) ) + instance.sizeUnit + ';\r';
                cssCode += '}'
            
                ManageCss.byId.create(cssCode, instance.targetCssID);
                return name;
            },
        },
    },

    update: {
        positionClass: function(targetDivID, targetCssID, width, height, newTopLeftPosition, oldTopLeftPosition){

            console.log(oldTopLeftPosition)
            console.log(newTopLeftPosition)
            let oldXmin = oldTopLeftPosition.X;
            let oldXmax = oldXmin + width;
            let oldYmin = oldTopLeftPosition.Y;
            let oldYmax = oldYmin + height;

            let newXmin = newTopLeftPosition.X;
            let newXmax = newXmin + width;
            let newYmin = newTopLeftPosition.Y;
            let newYmax = newYmin + height;

            if(oldYmin != newYmin){
                ManageWidget.cssCode.remove(targetDivID, 'grid-row-start: ' + oldYmin, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-row-start: ' + newYmin, targetCssID);
            }

            if(oldYmax != newYmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-row-end: ' + oldYmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-row-end: ' + newYmax, targetCssID);
            }

            if(oldXmin != newXmin){
                ManageWidget.cssCode.remove(targetDivID, 'grid-column-start: ' + oldXmin, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-column-start: ' + newXmin, targetCssID);
            }

            if(oldXmax != newXmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-column-end: ' + oldXmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-column-end: ' + newXmax, targetCssID);
            }

            return newTopLeftPosition;
        },

        sizeClass: function(instance, targetDivID, targetCssID, newSize, oldSize, TopLeftPosition){

            console.log(oldSize);
            let newWidth = newSize.width;
            let newHeight = newSize.height;

            let oldWidth = oldSize.width;
            let oldHeight = oldSize.height;

            let oldXmax = TopLeftPosition.X + oldWidth;
            let oldYmax = TopLeftPosition.Y + oldHeight;
            let newXmax = TopLeftPosition.X + newWidth;
            let newYmax = TopLeftPosition.Y + newHeight;

            let oldWidthPx = instance.gridSegmentWidth * oldWidth;
            let oldHeightPx = instance.gridSegmentHeight * oldHeight;
            let oldLeftGapPx = instance.gridSegmentLeftGap * (oldWidth-1);
            let oldTopGapPx = instance.gridSegmentTopGap * (oldHeight-1);

            let newWidthPx = instance.gridSegmentWidth * newWidth;
            let newHeightPx = instance.gridSegmentHeight * newHeight;
            let newLeftGapPx = instance.gridSegmentLeftGap * (newWidth-1);
            let newTopGapPx = instance.gridSegmentTopGap * (newHeight-1);

            if(newWidth != oldWidth){
                ManageWidget.cssCode.remove(targetDivID, 'width: ' + (oldWidthPx + oldLeftGapPx) + instance.sizeUnit, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'width: ' + (newWidthPx + newLeftGapPx) + instance.sizeUnit, targetCssID);
            }

            if(newHeight != oldHeight){
                ManageWidget.cssCode.remove(targetDivID, 'height: ' + (oldHeightPx + oldTopGapPx) + instance.sizeUnit, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'height: ' + (newHeightPx + newTopGapPx) + instance.sizeUnit, targetCssID);
            }

            if(oldYmax != newYmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-row-end: ' + oldYmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-row-end: ' + newYmax, targetCssID);
            }

            if(oldXmax != newXmax){
                ManageWidget.cssCode.remove(targetDivID, 'grid-column-end: ' + oldXmax, targetCssID);

                ManageWidget.cssCode.create(targetDivID, 'grid-column-end: ' + newXmax, targetCssID);
            }

            return {width: newWidth, height: newHeight};

        },
    },

    remove: {
        css: {
            sizeClass: function(gridCssClassName){
                let styleElementID = targetGridElement;
                ManageCss.byId.remove(gridCssClassName, styleElementID);
            },
        },
    },

    get: {
        pointerPosition: function(instance, moveData){

            let gridHeightPx = ManageGrid.main.get.heightPx(instance)
            let gridWidthPx = ManageGrid.main.get.widthPx(instance)

            let gridHeight = instance.gridHeight;
            let gridWidth = instance.gridWidth;

            let gridSegmentHeight = instance.gridSegmentHeight;
            let gridSegmentWidth = instance.gridSegmentWidth;

            let gridTopGap = instance.gridSegmentTopGap;
            let gridLeftGap = instance.gridSegmentLeftGap;

            let Y = moveData.layerY;
            Y = Y + (gridHeightPx/2)

            let X = moveData.layerX

            let cursorPointer = { X: -1, Y: -1}

            let i = 0;
            while(1){
                if(i > (gridWidth)-1){i = -1; break;}
                //if(x<50+(i*58) && x>0+(i*58)){gridPos.X = (i+1); break;}
                if(X<gridSegmentWidth+(i*(gridSegmentWidth+gridLeftGap)) && X>0+(i*(gridSegmentWidth+gridLeftGap))){i = (i+1); break;} //lol
                i++;
            }
            cursorPointer.X = i;

            i = 0;
            while(1){
                if(i > (gridHeight)-1){i = -1; break;}
                //if(x<50+(i*58) && x>0+(i*58)){gridPos.X = (i+1); break;}
                if(Y<gridSegmentHeight+(i*(gridSegmentHeight+gridTopGap)) && Y>0+(i*(gridSegmentHeight+gridTopGap))){i = (i+1); break;} //lol
                i++;
            }
            cursorPointer.Y = i;

            //console.log(cursorPointer.X + ':' + cursorPointer.Y)

            if(cursorPointer.X != -1 && cursorPointer.Y != -1){instance.lastKnownPointerPosition = cursorPointer;} 
        }
    },
};
