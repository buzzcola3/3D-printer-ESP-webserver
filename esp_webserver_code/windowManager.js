//------------testing----------
var printerPowerStatus = 1;

//-----------main Gris----------

const sizeUnit = 'px'

const gridSize = {
    leftGap: 8,
    topGap: 8,
    height: 50,
    width: 50,
}


var ManageGrid = {
    main: {
        modify: {
            size: function(){
                let height = ManageGrid.main.get.height();
                let width = ManageGrid.main.get.width();
                ManageGrid.main.create(height, width, 'gridStyle');
            
                currentGridSize.width = width;
                currentGridSize.height = height;
            },
        },

        create: function(height, width, parentDivId){
            let gridClass = '.grid';
            if(document.getElementById('gridStyle').innerText.includes(gridClass + '{') == true){ManageCss.byId.remove(gridClass.slice(1) + '{', parentDivId);}
        
            gridClass += '{\r';
            gridClass += 'display: grid;\r';
            gridClass += 'justify-items: center;\r';
            gridClass += 'grid-template-columns: repeat(' + width + ', var(--grid_width));\r';
            gridClass += 'grid-template-rows: repeat('+ height +', var(--grid_height));\r';
            gridClass += 'width: 100%;\r';
            gridClass += 'height: 100%;\r';
            gridClass += 'gap: var(--grid_gap);\r';
            gridClass += 'overflow: auto;\r';
            gridClass += 'position: relative;\r';
            gridClass += '}\r';
        
            let grid = document.getElementById(parentDivId);
            grid.innerHTML += gridClass;
            return;
        },

        update: {
            size: function(){
                let height = ManageGrid.main.get.height();
                let width = ManageGrid.main.get.width();
                ManageGrid.main.create(height, width, 'gridStyle');
            
                currentGridSize.width = width;
                currentGridSize.height = height;
            },
        },

        get: {
            height: function(){
                displayHeight = window.innerHeight;
                let i = 0;
                while(1){
                    if(displayHeight - (gridSize.height + gridSize.topGap) < (gridSize.height + gridSize.topGap)){break;}
                    displayHeight = displayHeight - (gridSize.height + gridSize.topGap);
                    i++;
                }
                if(displayHeight > gridSize.height + (2*gridSize.topGap)){i++;}
                return i;
            },

            width: function(){
                displayWidth = window.innerWidth;
                let i = 0;
                while(1){
                    if(displayWidth - (gridSize.width + gridSize.leftGap) < (gridSize.width + gridSize.leftGap)){break;}
                    displayWidth = displayWidth - (gridSize.width + gridSize.leftGap);
                    i++;
                }
                if(displayWidth > gridSize.width + (2*gridSize.leftGap)){i++;}
                return i;
            },
        },
    },

    create: {
        css: {
            sizeClass: function(width, height){ //user
                let targetElementID = 'gridStyle';

                let cssCode = '.grid_' + width + 'x' + height;
            
                let name = cssCode.slice(1);
                
                if(document.getElementById(targetElementID).innerText.includes(cssCode)){return name;}
            
                cssCode += '{\r';
                cssCode += 'grid-row-span: ' + width + ';\r'; 
                cssCode += 'grid-column-span: ' + height + ';\r';
                cssCode += 'height: ' + ( (gridSize.height * height) + (gridSize.topGap * (height-1)) ) + sizeUnit + ';\r';
                cssCode += 'width: ' + ( (gridSize.width * width) + (gridSize.leftGap * (width-1)) ) + sizeUnit + ';\r';
                cssCode += '}'
            
                ManageCss.byId.create(cssCode, targetElementID);
                return name;
            },
        },
    },

    remove: {
        css: {
            sizeClass: function(gridCssClassName){
                let styleElementID = 'gridStyle';
                ManageCss.byId.remove(gridCssClassName, styleElementID);
            },
        },
    },

    get: {
        positionClass: function(TopLeftPosition, width, height){//.grid_Xmin-Xmax_Ymin-Ymax
            if(width === undefined){return undefined;}
            if(height === undefined){return undefined;}
            if(TopLeftPosition.X === undefined){return undefined;}
            if(TopLeftPosition.Y === undefined){return undefined;}
        
            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;
        
            let targetElementID = 'gridStyle';
        
            
            let cssCode = '.grid_' + xmin + '-' + xmax + '_' + ymin + '-' + ymax;
            let className = cssCode.slice(1); //grid_X-X_X-X
            if(document.getElementById(targetElementID).innerText.includes(cssCode) == true){return className;}
        
        
            cssCode += '{\r';
            cssCode += 'height: ' + ( (gridSize.height * height) + (gridSize.topGap * (height-1)) ) + sizeUnit + ';\r';
            cssCode += 'width: ' + ( (gridSize.width * width) + (gridSize.leftGap * (width-1)) ) + sizeUnit + ';\r';
            cssCode += 'grid-row-start: ' + ymin + ';\r';
            cssCode += 'grid-row-end: ' + ymax + ';\r';
            cssCode += 'grid-column-start: ' + xmin + ';\r';
            cssCode += 'grid-column-end: ' + xmax + ';\r';
            cssCode += 'transition: 1s';
            cssCode += '}';
        
            ManageCss.byId.create(cssCode, targetElementID);
        
            return className;
        }, 
    },
};

var currentGridSize = {width: undefined, height: undefined}
ManageGrid.main.update.size();
window.onresize = ManageGrid.main.update.size;


function getGridPositionClass(index){ //.grid_Xmin-Xmax_Ymin-Ymax
    let height = widgetList[index].Height;
    let width = widgetList[index].Width;
    let topLeft = widgetList[index].TopLeftPosition;

    let gridClassName = ManageGrid.get.positionClass(topLeft, width, height);
    widgetList[index].gridPositionClass = gridClassName;
}

function removeGridPositionClass(index){
    let className = widgetList[index].gridPositionClass;
    widgetList[index].gridPositionClass = undefined;
    ManageGrid.remove.css.sizeClass(className);
}



function cursorPositionToGridPosition(x, y){
    let gridPos = {X: -1, Y: -1}

    let i = 0;
    while(1){
        if(i > (currentGridSize.width)-1){break;}
        if(x<50+(i*58) && x>0+(i*58)){gridPos.X = (i+1); break;}
        i++;
    }

    if(gridPos.X == -1){return undefined;}

    i = 0;
    while(1){
        if(i > (currentGridSize.height)-1){break;}
        if(y<50+(i*58) && y>0+(i*58)){gridPos.Y = (i+1); break;}
        i++;
    }

    if(gridPos.Y == -1){return undefined;}

    //console.log(gridPos)
    return gridPos;
}

















let widgetList = []

function createWidget(widget, height, width, posX, posY){
    let index = getIndex_addToList(widget, height, width, posX, posY);
    checkAspectRatio(index);
    checkFixInputSize(index);
    

    getGridPositionClass(index);

    let newWidgetDiv;
    newWidgetDiv = createWidgetContent(index);
    newWidgetDiv = appendWidgetID(newWidgetDiv, index);
    newWidgetDiv = appendWidgetSize(newWidgetDiv, index);
    newWidgetDiv = appendElementAttributes(newWidgetDiv, index)

    placeDivOnScreen(newWidgetDiv, 'mainDiv');
    
    widgetList[index].WidgetData.jsSetup();

    console.log(widgetList);
    console.log(index);
    return 'ok';
}


function removeWidget(index){
    removeWidgetDiv(index);
    removeGridPositionClass(index);
    widgetList[index].WidgetData.jsUnsetup();

    
    removeFromWidgetList(index);
}

function moveWidget(index, newTopLeftPosition){
    let width = widgetList[index].Width
    let height = widgetList[index].Height
    let oldTopLeftPosition = widgetList[index].TopLeftPosition

    let oldPositionClassName = widgetList[index].gridPositionClass;
    let newPositionClassName = ManageGrid.get.positionClass(newTopLeftPosition, width, height);

    if(newPositionClassName === undefined){return;}
    if(oldPositionClassName == newPositionClassName){return;}

    removeGridPositionClass(index);
    widgetList[index].gridPositionClass = newPositionClassName;

    ManageCss.byId.replace(oldPositionClassName, newPositionClassName, 'widgetID_' + index)
}

function rotateWidget(index, position){ //position = default, rotated
    if(position == 'default' && widgetList[index].rotated == 0){return;}
    if(position == 'rotated' && widgetList[index].rotated == 1){return;}

    let width = 0;
    let height = 0;

    if(position == 'rotated'){
        width = widgetList[index].Height
        height = widgetList[index].Width
    }

    if(position == 'default'){
        width = widgetList[index].Width
        height = widgetList[index].Height
    }

    let TopLeftPosition = widgetList[index].TopLeftPosition

    let oldPositionClassName = widgetList[index].gridPositionClass;
    let newPositionClassName = ManageGrid.get.positionClass(TopLeftPosition, width, height);

    console.log(width);
    console.log(height);
    console.log(TopLeftPosition)
    console.log(widgetList[index])

    removeGridPositionClass(index);
    widgetList[index].gridPositionClass = newPositionClassName;

    console.log(oldPositionClassName)
    console.log(newPositionClassName)

    ManageCss.byId.replace(oldPositionClassName, newPositionClassName, 'widgetID_' + index)
    if(widgetList[index].rotated == 1){widgetList[index].rotated = 0; return;}
    if(widgetList[index].rotated == 0){widgetList[index].rotated = 1; return;}
}

function getIndex_addToList(widget, height, width, posX, posY){
    let newWidget = {
        Index: undefined,
        rotated: 0,
        Height: height,
        Width: width,
        gridPositionClass: undefined,
        WidgetData: undefined,
        duplicateOf: getDuplicateWidgetIndex(widget),
        TopLeftPosition: {X: posX, Y: posY,},
    }

    let id = 0;
    while(1){
        //console.log(widgetList[i]);
        if(typeof widgetList[id] === 'undefined' || widgetList[id].Index == -1){
            newWidget.Index = id;
            widgetList[id] = newWidget;
            break;
        }
        id++;
    }
    widgetList[id].WidgetData = getWidgetData(widget, id);
    return id;
}

function removeFromWidgetList(index){
    widgetList[index].Index = -1;
}


function appendWidgetID(newWidgetDiv, index){

    newWidgetDiv.id = 'widgetID_' + index;

    if(widgetList[index].duplicateOf != -1){
        newWidgetDiv.classList.add('widgetID_' + widgetList[index].duplicateOf);
    }
    if(widgetList[index].duplicateOf == -1){
        newWidgetDiv.classList.add('widgetID_' + index)
    }
    return newWidgetDiv;
}

function appendWidgetSize(newWidgetDiv, index){
    newWidgetDiv.classList.add(widgetList[index].gridPositionClass);
    return newWidgetDiv;
}

function removeWidgetDiv(index){
    document.getElementById('widgetID_' + index).remove();
}

function appendElementAttributes(currentDiv, index){
    let code = widgetList[index].WidgetData.divHTML;
    
    if(code.indexOf('=') == -1){return -1;}

    while(1){
        let currentAtt = code.slice(0, code.indexOf('='));
        code = code.slice(code.indexOf('='));
        code = code.slice(code.indexOf('"')+1);
        
        let currentAttVal = code.slice(0, code.indexOf('"'));
        code = code.slice(code.indexOf('"')+1);

        currentDiv.setAttribute(currentAtt, currentAttVal);
        if(code.indexOf('=') == -1){break;}
        
    }
    return currentDiv;
}

function placeDivOnScreen(currentDiv, targetElementID){
    console.log(currentDiv);
    document.getElementById(targetElementID).appendChild(currentDiv);
}

//--------------------Widgets--------------------

function getWidgetData(name, index){
    function widgetStructure(){}
    function jsFunction(){}
    function jsSetup(){}
    function jsUnsetup(){}

    let divHTML = '';
    let widget = {name: name, sizeLimits: 'unknown', acceptableAspectRatios: [undefined], widgetStructure, jsSetup, jsUnsetup, jsFunction, divHTML}

    let allIdenticalWidgets = 'widgetID_'
    if(widgetList[index].duplicateOf == -1){allIdenticalWidgets += index;}
    if(widgetList[index].duplicateOf != -1){allIdenticalWidgets += widgetList[index].duplicateOf}

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
            if(printerPowerStatus == 1){printerPowerStatus = 0, ManageDiv.existing.css.replaceCode('background-image: url("powerGreen.svg")', 'background-image: url("powerRed.svg")', 'widgetsStyle'); return;}
            if(printerPowerStatus == 0){printerPowerStatus = 1, ManageDiv.existing.css.replaceCode('background-image: url("powerRed.svg")', 'background-image: url("powerGreen.svg")', 'widgetsStyle'); return;}
        }

        widget.jsSetup = function(){
            if(printerPowerStatus == 1){ManageDiv.existing.css.replaceCode('background-image: url("powerRed.svg")', 'background-image: url("powerGreen.svg")', 'widgetsStyle'); return;}
            if(printerPowerStatus == 0){ManageDiv.existing.css.replaceCode('background-image: url("powerGreen.svg")', 'background-image: url("powerRed.svg")', 'widgetsStyle'); return;}
        }

        widget.divHTML = 'onclick="widgetList[' + index + '].WidgetData.jsFunction()"'

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
            div[2] = ManageDiv.passed.css.addCode(div[2], 'line-height: ' + gridSize.height + 'px', 'widgetsStyle');
            div[2].innerText = "50°C";
            div[2].classList.add(ManageGrid.create.css.sizeClass(1,1));

            div[1] = document.createElement('img');
            div[1].src = "./extruderIcon.svg";
            div[1].classList.add(ManageGrid.create.css.sizeClass(1,1));

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

function createWidgetContent(index){
    let widgetStructure = widgetList[index].WidgetData.widgetStructure();
    if(widgetStructure === undefined){return document.createElement('div');}
    return widgetStructure;
}

function createWidgetCss(index){
    ManageCss.byId.create(widgetList[index].WidgetData.css, 'widgetsStyle');
}

function removeWidgetCss(index){
    ManageCss.byId.removeMultiple(widgetList[index].WidgetData.css, 'widgetsStyle');
}

function checkFixInputSize(index){
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
    return;
}

function checkAspectRatio(index){

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

    //let ratioMultiplier = targetHeight/targetAspectRatioWidth;
    //console.log(ratioMultiplier)

    //targetWidth = targetAspectRatioWidth * ratioMultiplier;
    //targetHeight = targetAspectRatioHeight * ratioMultiplier;

    //console.log(targetHeight);
    //console.log(targetWidth);
    //widgetList[index].Width = targetWidth;
    //widgetList[index].Height = targetHeight;
}

function getDuplicateWidgetIndex(widget){ //gets indexes of widgets with a same type - returns an array
    let i = 0
    if(widgetList[i] === undefined){return -1;}
    while(1){
        if(widgetList[i].Index != -1){
            if(widget == widgetList[i].Widget){return i;}
        }
        
        if(widgetList[i+1] === undefined){break}
        i++;
    }
    return -1;
}

//----------------generic functions--------------

var ManageCss = {
    byId: {
        //cssCode:
        remove: function(className, cssElementID) {
            let oldClassText = document.getElementById(cssElementID).innerText;
        
            let newString = oldClassText.slice(0,oldClassText.indexOf('.' + className))
            let oldString = oldClassText.slice(oldClassText.indexOf('.' + className))
        
            newString += oldString.slice(oldString.indexOf('}')+1)
            document.getElementById(cssElementID).innerHTML = newString;
        },

        removeMultiple: function(classNames, cssElementID){
            while(1){
                let oneClass = classNames.slice(classNames.indexOf('.')+1, classNames.indexOf('{'));
                classNames = classNames.slice(classNames.indexOf('}')+1);
                
                ManageCss.byId.remove(oneClass, cssElementID);
                if(classNames.indexOf('.') == -1){return;}
            }
        },

        create: function(cssCode, cssElementID){
            if(cssCode.indexOf('.') == -1){console.warn('not a valid CSS');}

            if(document.getElementById(cssElementID).innerHTML.includes(cssCode)){return;}
            document.getElementById(cssElementID).innerHTML += cssCode;
            return;
        },
        
        //classList
        replace: function(oldClass, newClass, elementID){
            let classList = document.getElementById(elementID).classList;
            if(classList.contains(oldClass)){
                classList.replace(oldClass, newClass);
                return;
            }
            classList.add(newClass);
            return;
        },
    },

    byClass: {
        replace: function f(oldClass, newClass, targetClasses){
            let divList = document.getElementsByClassName(targetClasses);
        
            let i = 0;
            if(divList[i] === undefined){return;}
            while(1){
                if(divList[i].classList.contains(oldClass) == true){
                    divList[i].classList.replace(oldClass, newClass);
                }
        
                if(divList[i].classList.contains(oldClass) == false){
                    divList[i].classList.add(newClass);
                }
        
                i++;
                if(divList[i] === undefined){break;}
            }
            return;
        },
    },
}

var ManageDiv = {
    passed: {
        image: {
            add: function f(originalDiv, imageFileName){
                originalDiv.outerHTML = 'hi'
                console.log(originalDiv.outerHTML)
                
                //document.getElementById('gg').outerHTML
            
                let css = '.' + imageFileName;
            
                
                css += '{\r';
                css += 'background-image: extruderIcon.svg;\r'
                css += '}\r';
                ManageCss.byId.create(css, "widgetsStyle")
                //add class to div
                return originalDiv;
            },
        },
        css: {
            addCode: function f(element, cssCode, cssElementID){
                let cssClassName = ManageDiv.internal.cssCodeToCssClassName(cssCode);
                
                ManageCss.byId.create( '.' + cssClassName + '{' + cssCode + ';}', cssElementID)
                element.classList.add(cssClassName);
                return element;

            },
        },
    },
    existing: {
        css: {
            replaceCode: function(cssCode, newCssCode, cssElementID){
                let cssClassName = ManageDiv.internal.cssCodeToCssClassName(cssCode);

                let newClassName = ManageDiv.internal.cssCodeToCssClassName(newCssCode);

                while(1){
                    if(document.getElementsByClassName(cssClassName).length <= 0){break;}
                    document.getElementsByClassName(cssClassName)[0].classList.replace(cssClassName, newClassName)
                }

                ManageCss.byId.create( '.' + newClassName + '{' + newCssCode + ';}', cssElementID)

            },
        },
    },

    internal: {
        cssCodeToCssClassName: function(cssCode){
            let cssClassName = cssCode;

            cssClassName = cssClassName.replaceAll(' ', '_');
            cssClassName = cssClassName.replaceAll('.', '_');
            cssClassName = cssClassName.replaceAll(',', '_');

            cssClassName = cssClassName.replaceAll(':', '_');
            cssClassName = cssClassName.replaceAll(';', '_');

            cssClassName = cssClassName.replaceAll('"', '_');
            cssClassName = cssClassName.replaceAll("'", '_');

            cssClassName = cssClassName.replaceAll('(', '_');
            cssClassName = cssClassName.replaceAll(')', '_');

            return cssClassName;
        },
    },
}

