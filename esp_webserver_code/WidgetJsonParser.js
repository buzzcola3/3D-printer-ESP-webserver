import { WidgetsOnGrid } from "./WidgetsOnGrid.js";


export class WidgetJsonParser{
    
    //cw_createGridChild
    //cw_createEmptyChild
    
    //take in the JSON widget object, parse ==> setup ==> create 
    static parse(widgetObj, widgetJsonObject = this.getUnknownWidget()){

        if(widgetJsonObject.widgetStructure == undefined){console.error("invalid JSON"); return}

        this.widgetStructureParser(widgetJsonObject, widgetObj);
        
    }

    //returns widget that is empty saying "unknown"
    static getUnknownWidget(){
        return;
    }


    static widgetStructureParser(widgetJsonObject, widgetObj){
        let rawString = widgetJsonObject.widgetStructure;

        let codeArray = this.widgetStructStrToArrOfFunctions(rawString);
        console.log(codeArray)

        codeArray.forEach(lineOfCode => {
            if(lineOfCode.scope === undefined){
                this.structureBuilder(lineOfCode, widgetObj);
                return;
            }
            
            let subJsonObject = {widgetStructure: lineOfCode.scope}
            this.widgetStructureParser(subJsonObject, this.structureBuilder(lineOfCode, widgetObj))
        })
    }

    //takes in a string, spits out an array
    static widgetStructStrToArrOfFunctions(structString){

        let codeArray = [];
        while(structString.includes('$/$')){

            structString = structString.slice(structString.indexOf('$/$') + 3);


            let funArguments = this.getBracketData('(', structString);

            let funScope = undefined;
            let nextChar = structString.charAt(this.findBracketEnd('(', structString))
            if(nextChar == '{'){
                funScope = this.getBracketData('{', structString)
                structString = structString.replace(funScope, '');
                funScope = funScope.slice(1, -1);
                console.log(structString)
            }

            let funFun = structString.slice(0, structString.indexOf('$/$'));

            structString = structString.slice(structString.indexOf(';')+1);

            //remove brackets
            funArguments = funArguments.substring(1, funArguments.length-1);

            //remove '
            if(funArguments.charAt(0) == "'" && funArguments.charAt(funArguments.charAt(-1))){
                funArguments = funArguments.substring(1, funArguments.length-1);
            }

            codeArray.push({type: funFun, arguments: funArguments, scope: funScope})
        }

        console.log(codeArray);
        return codeArray
    }

    //finds the first bracket of the given type and returns string thats in between ()->included
    static getBracketData(bracketType = '(', string){
        
        let bracketTypeClosing;
        if(bracketType == '<'){bracketTypeClosing = '>'};
        if(bracketType == '('){bracketTypeClosing = ')'};
        if(bracketType == '{'){bracketTypeClosing = '}'};
        if(bracketType == '['){bracketTypeClosing = ']'};

        if(!string.includes(bracketType) || !string.includes(bracketType)){console.error('does not include bracket'); return string;};

        let startOfStr = string.indexOf(bracketType)
        let endOfStr = startOfStr;
        let bracketTracker = 0;
        while(1){
            if(string.charAt(endOfStr) == bracketType){bracketTracker++;}
            if(string.charAt(endOfStr) == bracketTypeClosing){bracketTracker--;}
            
            endOfStr++;
            if(bracketTracker == 0){break;}
        }

        return string.slice(startOfStr, endOfStr);
    }

    static findBracketEnd(bracketType = '(', string){
        
        let bracketTypeClosing;
        if(bracketType == '<'){bracketTypeClosing = '>'};
        if(bracketType == '('){bracketTypeClosing = ')'};
        if(bracketType == '{'){bracketTypeClosing = '}'};
        if(bracketType == '['){bracketTypeClosing = ']'};

        if(!string.includes(bracketType) || !string.includes(bracketType)){console.error('does not include bracket'); return string;};

        let startOfStr = string.indexOf(bracketType)
        let endOfStr = startOfStr;
        let bracketTracker = 0;
        while(1){
            if(string.charAt(endOfStr) == bracketType){bracketTracker++;}
            if(string.charAt(endOfStr) == bracketTypeClosing){bracketTracker--;}
            
            endOfStr++;
            if(bracketTracker == 0){break;}
        }

        return endOfStr;
    }

    //takes in function element, applies it to the widget
    static structureBuilder(singleFunctionArrObj, widgetObj){
        let relevantObj = widgetObj;

        switch(singleFunctionArrObj.type){
            case 'addCss':
                console.log('addCss');
                WidgetsOnGrid.cw_addCode(widgetObj, singleFunctionArrObj.arguments);
                break;

            case 'subGrid':
                console.log('subGrid');
                let argArr = singleFunctionArrObj.arguments.split(',')
                
                let gridSize = {};
                argArr.forEach(arg => {
                    if(parseInt(arg) != NaN){arg = parseInt(arg)}
                    if(gridSize.gridSegmentWidth === undefined){gridSize.gridSegmentWidth = arg; return;}
                    if(gridSize.gridSegmentHeight === undefined){gridSize.gridSegmentHeight = arg; return;}
                    if(gridSize.gridSegmentTopGap === undefined){gridSize.gridSegmentTopGap = arg; return;}
                    if(gridSize.gridSegmentLeftGap === undefined){gridSize.gridSegmentLeftGap = arg; return;}
                    if(gridSize.sizeUnit === undefined){gridSize.sizeUnit = arg; return;}
                })
                console.log(gridSize);
                WidgetsOnGrid.cw_addGridCode(widgetObj, gridSize);
                break;

            case 'createElement':
                console.log('createElement');
                relevantObj = createdChildObject;
                break;

        }

        return relevantObj;
        
    }
}

