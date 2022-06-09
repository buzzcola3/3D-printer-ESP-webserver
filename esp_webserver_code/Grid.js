import {ManageCss} from "./ManageCss.js";

var currentGridSize = {width: undefined, height: undefined}

export var ManageGrid = {
    main: {

        create: function(instance){

            let height = ManageGrid.main.get.height(instance);
            let width = ManageGrid.main.get.width(instance);

            if (document.getElementById(instance.targetCssID) === null){
                let newEl = document.createElement('style');
                newEl.id = instance.targetCssID;
                document.getElementsByTagName('head')[0].appendChild(newEl);
            }

            let gridClass = '.grid_' + instance.targetDivID;
            let cssClassName = gridClass.slice(1);

            if(document.getElementById(instance.targetCssID).innerText.includes(gridClass + '{') == true){ManageCss.byId.remove(gridClass.slice(1) + '{', instance.targetCssID);}
        
            gridClass += '{\r';
            gridClass += 'display: grid;\r';
            gridClass += 'justify-items: center;\r';
            gridClass += 'grid-template-columns: repeat(' + width + ',' + instance.gridSegmentWidth + instance.sizeUnit + ');\r';
            gridClass += 'grid-template-rows: repeat('+ height +',' + instance.gridSegmentHeight + instance.sizeUnit + ');\r';
            gridClass += 'width: 100%;\r';
            gridClass += 'height: 100%;\r';
            gridClass += 'row-gap:' + instance.gridSegmentLeftGap + instance.sizeUnit + ';\r';
            gridClass += 'column-gap:' + instance.gridSegmentTopGap + instance.sizeUnit + ';\r';
            gridClass += 'overflow: auto;\r';
            gridClass += 'position: relative;\r';
            gridClass += '}\r';
        
            let grid = document.getElementById(instance.targetCssID);
            gridClass += grid.innerHTML;
            grid.innerHTML = gridClass;

            //grid.innerHTML += gridClass;
            console.log(document.getElementById(instance.targetCssID))

            document.getElementById(instance.targetDivID).classList.add(cssClassName);
            return cssClassName;
        },

        update: {
            size: function(instance){

                let height = ManageGrid.main.get.height(instance);
                let width = ManageGrid.main.get.width(instance);

                ManageGrid.main.create(instance);
            
                currentGridSize.width = width;
                currentGridSize.height = height;
            },
        },

        get: {
            height: function(instance){
                //let displayHeight = window.innerHeight;
                let displayHeight = document.getElementById(instance.targetDivID).clientHeight;
                let i = 0;
                while(1){
                    if(displayHeight - (instance.gridSegmentHeight + instance.gridSegmentTopGap) < (instance.gridSegmentHeight + instance.gridSegmentTopGap)){break;}
                    displayHeight = displayHeight - (instance.gridSegmentHeight + instance.gridSegmentTopGap);
                    i++;
                }
                if(displayHeight > instance.gridSegmentHeight + (2*instance.gridSegmentTopGap)){i++;}
                return i;
            },

            width: function(instance){
                //let displayWidth = window.innerWidth;
                let displayWidth = document.getElementById(instance.targetDivID).clientWidth;
                let i = 0;
                while(1){
                    if(displayWidth - (instance.gridSegmentWidth + instance.gridSegmentLeftGap) < (instance.gridSegmentWidth + instance.gridSegmentLeftGap)){break;}
                    displayWidth = displayWidth - (instance.gridSegmentWidth + instance.gridSegmentLeftGap);
                    i++;
                }
                if(displayWidth > instance.gridSegmentWidth + (2*instance.gridSegmentLeftGap)){i++;}
                return i;
            },
        },
    },

    create: {
        css: {
            sizeClass: function(width, height, instance){ //user
                console.log(instance.targetCssID)

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

    remove: {
        css: {
            sizeClass: function(gridCssClassName){
                let styleElementID = targetGridElement;
                ManageCss.byId.remove(gridCssClassName, styleElementID);
            },
        },
    },

    get: {
        positionClass: function(instance, TopLeftPosition, width, height){//.grid_Xmin-Xmax_Ymin-Ymax
            if(width === undefined){return undefined;}
            if(height === undefined){return undefined;}
            if(TopLeftPosition.X === undefined){return undefined;}
            if(TopLeftPosition.Y === undefined){return undefined;}
        
            let xmin = TopLeftPosition.X;
            let xmax = xmin + width;
            let ymin = TopLeftPosition.Y;
            let ymax = ymin + height;
        
            
            let cssCode = '.grid_' + xmin + '-' + xmax + '_' + ymin + '-' + ymax;
            let className = cssCode.slice(1); //grid_X-X_X-X
            if(document.getElementById(instance.targetCssID).innerText.includes(cssCode) == true){return className;}
        
        
            cssCode += '{\r';
            cssCode += 'height: ' + ( (instance.gridSegmentHeight * height) + (instance.gridSegmentTopGap * (height-1)) ) + instance.sizeUnit + ';\r';
            cssCode += 'width: ' + ( (instance.gridSegmentWidth * width) + (instance.gridSegmentLeftGap * (width-1)) ) + instance.sizeUnit + ';\r';
            cssCode += 'grid-row-start: ' + ymin + ';\r';
            cssCode += 'grid-row-end: ' + ymax + ';\r';
            cssCode += 'grid-column-start: ' + xmin + ';\r';
            cssCode += 'grid-column-end: ' + xmax + ';\r';
            cssCode += 'transition: 1s';
            cssCode += '}';
        
            ManageCss.byId.create(cssCode, instance.targetCssID);
        
            return className;
        }, 
    },
};
