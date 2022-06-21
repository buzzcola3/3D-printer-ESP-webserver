export class parseWidgetCode{
    constructor(widgetRawJson){

        let widgetName = widgetRawJson.name;
        let widgetStructure = widgetRawJson.widgetStructure;
        let dependentVars = widgetRawJson.dependentVars;
        let shortenedValues = widgetRawJson.shortenedValues;

        let jsSetup = widgetRawJson.jsSetup;
        let jsFunction = widgetRawJson.jsFunction;
        let jsUnsetup = widgetRawJson.jsUnsetup;

        jsSetup = parseWidgetCode.replaceFunctions(jsSetup); //done
        jsSetup = parseWidgetCode.replaceShorts(jsSetup, shortenedValues) //done
        jsSetup = new Function('', jsSetup);
        this.jsSetup = jsSetup;

        jsFunction = parseWidgetCode.replaceFunctions(jsFunction); //done
        jsFunction = parseWidgetCode.replaceShorts(jsFunction, shortenedValues) //done
        jsFunction = new Function('', jsFunction);
        this.jsFunction = jsFunction;

        jsUnsetup = parseWidgetCode.replaceFunctions(jsUnsetup); //done
        jsUnsetup = parseWidgetCode.replaceShorts(jsUnsetup, shortenedValues) //done
        jsUnsetup = new Function('', jsUnsetup);
        this.jsUnsetup = jsUnsetup;

    }

    get(){
        let jsSetup = this.jsSetup;
        let jsFunction = this.jsFunction;
        let jsUnsetup = this.jsUnsetup;
        return{jsSetup, jsFunction, jsUnsetup};
    }

    static replaceFunctions(rawString){

        while(rawString.includes('$/$replaceBackgroundImage$/$')){
            let toBeReplaced = '$/$replaceBackgroundImage$/$'

            let startOfVar = rawString.indexOf(toBeReplaced)+1;
            startOfVar = startOfVar + toBeReplaced.length;

            rawString = parseWidgetCode.getShortFunctionVars(rawString, startOfVar);
            this.currentFunctionVars.push('"widgetsStyle"');

            rawString = rawString.replace(toBeReplaced, 'ManageDiv.existing.css.replaceClass' + '(' + this.curFuncVarsToString() + ')');
            this.currentFunctionVars = undefined;
        }

        if(rawString.includes('$/$')){console.warn('unknown function')}
        return rawString;
    }

    static currentFunctionVars = [];

    static getShortFunctionVars(rawString, startOfVar){
        let out = [];
        let endOfVar = startOfVar-1;
        let bracketTracker = 0;
        while(1){
            if(rawString.charAt(endOfVar) == '('){bracketTracker++;}
            if(rawString.charAt(endOfVar) == ')'){bracketTracker--;}
            
            if(bracketTracker == 0){break;}
            endOfVar++;
        }

        let varString = rawString.slice(startOfVar, endOfVar);
        rawString = rawString.replace(rawString.slice(startOfVar-1, endOfVar+1), '');

        while(1){
            let end = varString.indexOf(',');
            if(end == -1){ out.push(varString); break;}

            out.push(varString.slice(0, end));

            varString = varString.slice(end+1);
        }
        this.currentFunctionVars = out;
        return rawString;
    }

    static curFuncVarsToString(){
        let curFuncVars = this.currentFunctionVars;
        let varString = '';

        let i = 0;
        while(1){
            if(curFuncVars[i] === undefined){varString = varString.slice(0, varString.length-2); break;}

            varString = varString + curFuncVars[i] + ', '
            i++;
        }
        return varString;
    }

    static replaceShorts(rawString, shortenedValues){
        console.log(shortenedValues[0]);
        
        let i = 0;
        while(1){
            if(shortenedValues[i] === undefined){break;}
            let short = '$' + shortenedValues[i].short;
            let full = shortenedValues[i].full;

            rawString = rawString.replace(short, full);
            if(rawString.includes(short)){i--;}

            i++;
        }
        return rawString;
    }


}