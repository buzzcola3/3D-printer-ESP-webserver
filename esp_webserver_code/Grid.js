import {ManageCss, ManageWidget} from "./ManageCss.js";

import {addLineOfcode, removeLineOfcode, replaceLineOfCode} from "./ManageCode.js";
import { WidgetStructure } from "./widgets.js";
import { WidgetsOnGrid } from "./WidgetsOnGrid.js";

export var ManageGrid = {
    main: {

        getGridEl: function(sizes, element = document.createElement('div')){
            //ManageGrid.main.updateSizes(instance);

            let gridHeight = sizes.gridHeight;
            let gridWidth = sizes.gridWidth;


            if(gridHeight === undefined){gridHeight = 0;}
            if(gridWidth === undefined){gridWidth = 0}



            element = addLineOfcode(element, 'margin: 0 auto');
            element = addLineOfcode(element, 'top: 50%');
            element = addLineOfcode(element, 'transform: translateY(-50%)');

            element = addLineOfcode(element, 'display: grid');
            element = addLineOfcode(element, 'justify-items: center');
            element = addLineOfcode(element, 'grid-template-columns: repeat(' + gridWidth + ',' + sizes.gridSegmentWidth + sizes.sizeUnit + ')');
            element = addLineOfcode(element, 'grid-template-rows: repeat('+ gridHeight +',' + sizes.gridSegmentHeight + sizes.sizeUnit + ')');
            element = addLineOfcode(element, 'row-gap:' + sizes.gridSegmentLeftGap + sizes.sizeUnit);
            element = addLineOfcode(element, 'column-gap:' + sizes.gridSegmentTopGap + sizes.sizeUnit);
            element = addLineOfcode(element, 'overflow: auto');
            element = addLineOfcode(element, 'position: relative');

            return element;
        },

        updateSizeFromDOM: function(element_targetObj){
            if(document.getElementById(element_targetObj.divCode.id) === null){return element_targetObj};
                
            //if(size === undefined){extract sizes from gridElement}
            //else use the sizes

            //check for width and height classes
            let sizeClassName = {};
            let classList = element_targetObj.divCode.classList;

            classList.forEach(className => {
                if(className.includes('height__')){
                    sizeClassName.height = className.replace('height__', '')
                    sizeClassName.height = parseInt(sizeClassName.height);

                    sizes.elementHeight = sizeClassName.height

                    sizeClassName.sizeUnit = className.replace('height__' + sizeClassName.height, '');
                }

                if(className.includes('width__')){
                    sizeClassName.width = className.replace('width__', '')
                    sizeClassName.width = parseInt(sizeClassName.width)

                    sizes.elementWidth = sizeClassName.width;
                    
                    sizeClassName.sizeUnit = className.replace('width__' + sizeClassName.width, '');
                }
            })
            if(sizes.elementWidth == undefined){sizeClassName.width = 0;}
            if(sizes.elementHeight == undefined){sizeClassName.height = 0;}
        },
    },

    create: {

        positionClass: function(sizesByPixel, width, height, TopLeftPosition, targetObj){
            if(width === undefined){console.warn('No width provided'); return undefined;}
            if(height === undefined){console.warn('No height provided'); return undefined;}
            if(TopLeftPosition.X === undefined){console.warn('No X provided'); return undefined;}
            if(TopLeftPosition.Y === undefined){console.warn('No Y provided'); return undefined;}
        

            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;

            let rectWidthPx = sizesByPixel.gridSegmentWidth * width;
            let rectHeightPx = sizesByPixel.gridSegmentHeight * height;
            let leftGapPx = sizesByPixel.gridSegmentLeftGap * (width-1);
            let topGapPx = sizesByPixel.gridSegmentTopGap * (height-1);

            let widthPx = (rectWidthPx + leftGapPx);
            let heightPx = (rectHeightPx + topGapPx);

            let targetDiv = targetObj.divCode;
            if(targetDiv === undefined){targetDiv = document.createElement('div')}

            targetDiv = addLineOfcode(targetDiv, 'height: ' + heightPx + sizesByPixel.sizeUnit);
            targetDiv = addLineOfcode(targetDiv, 'width: ' + widthPx + sizesByPixel.sizeUnit);
            targetDiv = addLineOfcode(targetDiv, 'grid-row-start: ' + ymin);
            targetDiv = addLineOfcode(targetDiv, 'grid-row-end: ' + ymax);
            targetDiv = addLineOfcode(targetDiv, 'grid-column-start: ' + xmin);
            targetDiv = addLineOfcode(targetDiv, 'grid-column-end: ' + xmax);
            targetDiv = addLineOfcode(targetDiv, 'transition: 1s');

            console.log(targetObj)
            if(targetObj.gridSizes === undefined){targetObj.gridSizes = {}}
            targetObj.gridSizes.gridWidthSpanOnParent = width;
            targetObj.gridSizes.gridHeightSpanOnParent = height;
            console.log(targetObj)
        
            return targetDiv;
        }, 

//        css: {
//            sizeClass: function(width, height, instance){ //user
//
//                let cssCode = '.grid_' + width + 'x' + height;
//            
//                let name = cssCode.slice(1);
//                
//                if(document.getElementById(instance.targetCssID).innerText.includes(cssCode)){return name;}
//            
//                cssCode += '{\r';
//                cssCode += 'grid-row-span: ' + width + ';\r'; 
//                cssCode += 'grid-column-span: ' + height + ';\r';
//                cssCode += 'height: ' + ( (instance.gridSegmentHeight * height) + (instance.gridSegmentTopGap * (height-1)) ) + instance.sizeUnit + ';\r';
//                cssCode += 'width: ' + ( (instance.gridSegmentWidth * width) + (instance.gridSegmentLeftGap * (width-1)) ) + instance.sizeUnit + ';\r';
//                cssCode += '}'
//            
//                ManageCss.byId.create(cssCode, instance.targetCssID);
//                return name;
//            },
//        },
    },

    update: {
        size: function(targetObj){
            let oldGridMaxFitElementHeight = targetObj.gridSizes.gridMaxFitElementHeight;
            let oldGridMaxFitElementWidth = targetObj.gridSizes.gridMaxFitElementWidth;

            this.sizePx(targetObj);
            this.updateElementSize(targetObj)
            this.updateGridElementSize(targetObj);
            

            let newGridMaxFitElementHeight = targetObj.gridSizes.gridMaxFitElementHeight;
            let newGridMaxFitElementWidth = targetObj.gridSizes.gridMaxFitElementWidth;

            let targetDiv = targetObj.divCode;
            let sizeUnit = targetObj.gridSizes.sizeUnit;

            if(oldGridMaxFitElementHeight != newGridMaxFitElementHeight){
                removeLineOfcode(targetDiv, 'height: ' + oldGridMaxFitElementHeight + sizeUnit);
                addLineOfcode(targetDiv, 'height: ' + newGridMaxFitElementHeight + sizeUnit);
            }

            if(oldGridMaxFitElementWidth != newGridMaxFitElementWidth){
                removeLineOfcode(targetDiv, 'width: ' + oldGridMaxFitElementWidth + sizeUnit);
                addLineOfcode(targetDiv, 'width: ' + newGridMaxFitElementWidth + sizeUnit);
            }   
        },

        sizePx: function(targetObj, inheritedSize = targetObj.gridSizes){

            function updateSize(targetObj, newSizeW, newSizeH){
                targetObj.gridSizes.elementHeight = newSizeH;
                targetObj.gridSizes.elementWidth = newSizeW;
            }

            if(inheritedSize === undefined){console.warn("invalid size object"); return;}

            let parentGridSizes = WidgetsOnGrid.inheritGridSize(targetObj);

            let spanOnParentW = targetObj.gridSizes.gridHeightSpanOnParent
            let spanOnParentH = targetObj.gridSizes.gridWidthSpanOnParent

            if(spanOnParentW === undefined || spanOnParentH === undefined){
                console.warn("spanOnParent is invalid, trying to use values from DOM");
                let newHeight = targetObj.divCode.parentElement.offsetHeight;
                let newWidth = targetObj.divCode.parentElement.offsetWidth;

                updateSize(targetObj, newWidth, newHeight);

                targetObj.gridSizes.elementHeight = newHeight;
                targetObj.gridSizes.elementWidth = newWidth;

                return;
            }

            let newHeight = (parentGridSizes.gridSegmentHeight*spanOnParentH) + (parentGridSizes.gridSegmentTopGap*(spanOnParentH-1))
            let newWidth = (parentGridSizes.gridSegmentWidth*spanOnParentW) + (parentGridSizes.gridSegmentLeftGap*(spanOnParentW-1) )

            updateSize(targetObj, newWidth, newHeight);

            return;
        },

        updateElementSize: function(targetObj){
            console.log(targetObj.gridSizes);

            let oldWidth = targetObj.gridSizes.numberOfSegmentsWidth
            let oldHeight = targetObj.gridSizes.numberOfSegmentsHeight


            let newWidth = this.width(targetObj);
            let newHeight = this.height(targetObj);


            if(oldHeight != newHeight){

                removeLineOfcode(targetObj.divCode, 'grid-template-rows: repeat('+ oldHeight +',' + targetObj.gridSizes.gridSegmentHeight + targetObj.gridSizes.sizeUnit + ')');
                
                targetObj.gridSizes.numberOfSegmentsHeight = newHeight;

                addLineOfcode(targetObj.divCode, 'grid-template-rows: repeat('+ newHeight +',' + targetObj.gridSizes.gridSegmentHeight + targetObj.gridSizes.sizeUnit + ')');
            }

            if(oldWidth != newWidth){
                removeLineOfcode(targetObj.divCode, 'grid-template-columns: repeat(' + oldWidth + ',' + targetObj.gridSizes.gridSegmentWidth + targetObj.gridSizes.sizeUnit + ')')

                targetObj.gridSizes.numberOfSegmentsWidth = newWidth;
    
                addLineOfcode(targetObj.divCode, 'grid-template-columns: repeat(' + newWidth + ',' + targetObj.gridSizes.gridSegmentWidth + targetObj.gridSizes.sizeUnit + ')');
    
            }
        },

        updateGridElementSize: function(targetObj){
            let gap;
            let segmentSize;
            let numberOfSegments;

            gap = targetObj.gridSizes.gridSegmentLeftGap;
            segmentSize = targetObj.gridSizes.gridSegmentWidth;
            numberOfSegments = targetObj.gridSizes.numberOfSegmentsWidth;
            let realWidth = (segmentSize*numberOfSegments) + (gap*(numberOfSegments-1));

            gap = targetObj.gridSizes.gridSegmentTopGap;
            segmentSize = targetObj.gridSizes.gridSegmentHeight;
            numberOfSegments = targetObj.gridSizes.numberOfSegmentsHeight;
            let realHeight = (segmentSize*numberOfSegments) + (gap*(numberOfSegments-1));

            console.log("gap: " + gap +" segmentSize: " + segmentSize + " numberOfSegments: " + numberOfSegments)

            targetObj.gridSizes.gridMaxFitElementHeight = realHeight;
            targetObj.gridSizes.gridMaxFitElementWidth = realWidth;

        },

        height: function(targetObj){
            //let displayHeight = window.innerHeight;

            let divHeight = targetObj.gridSizes.elementHeight;

            let oneGrid = targetObj.gridSizes.gridSegmentHeight;
            let oneGap = targetObj.gridSizes.gridSegmentTopGap;

            let i = 0;
            while(1){
                if(divHeight < oneGrid){break;}
                divHeight = divHeight - (oneGrid + oneGap);
                i++;
            }
            if(divHeight > targetObj.gridSizes.gridSegmentHeight + (2*targetObj.gridSizes.gridSegmentTopGap)){i++;}
            return i;
        },

        width: function(targetObj){
            //let displayWidth = window.innerWidth;
            let divWidth = targetObj.gridSizes.elementWidth;
            console.log(divWidth)

            let oneGrid = targetObj.gridSizes.gridSegmentWidth;
            let oneGap = targetObj.gridSizes.gridSegmentLeftGap;
            let onePair = oneGap + oneGrid;

            let i = 0;
            while(1){
                if(divWidth <= onePair){break;}
                divWidth = divWidth - (onePair);
                i++;
                console.log(i)
            }
            if(divWidth > oneGrid){i++;}
            console.log(divWidth)
            console.log(onePair)
            console.log(i)
            return i;
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
