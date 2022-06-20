
export class parseWidgetCode{
    constructor(rawString, dependentVars, dependentImagesURL){
        let rawInstructions = parseWidgetCode.splitRawToRawInstructions(rawString);
        console.log(rawInstructions);
    }

    static splitRawToRawInstructions(rawCode = "(printerPowerStatus)$==$(1)$-->$(powerRed)$replaceBackgroundImage/$(powerGreen), (printerPowerStatus)$==$(0) (powerGreen)$replaceBackgroundImage/$(powerRed)"){ //"(printerPowerStatus)$-->$(1)$-->$(powerRed)$replaceImage/$(powerGreen), (printerPowerStatus)$-->$(0) (powerGreen)$replaceImage/$(powerRed)"
        let instructionArray = [];

        while(1){
            if(rawCode.indexOf(',') == -1){instructionArray.push(rawCode); break;}
            let end = rawCode.indexOf(',')
            
            instructionArray.push(rawCode.slice(0, end))
            rawCode = rawCode.slice(end+1);
        }
        return instructionArray; //["(printerPowerStatus)$-->$(1)$-->$(powerRed)$replaceImage/$(powerGreen)"], ["(printerPowerStatus)$-->$(0) (powerGreen)$replaceImage/$(powerRed)"]
    }

    static rawInstructionToCodeInstruction(){ //"(printerPowerStatus)$==$(1)$-->$(powerRed)$replaceBackgroundImage/$(powerGreen)"
        return; //"if((printerPowerStatus)==(1)){ManageDiv.existing.css.replaceClass('background-image: url("powerRed.svg")', 'background-image: url("powerGreen.svg")', 'widgetsStyle')}"
    }

    static instructionFunctionTranslator(instructionSnippet){ //"(printerPowerStatus)$-->$(1)"
        // (par1)$==$(par2)
        return; //if((par1) == (par2))
    }

    static combineCodeToFunction(){
        let f = function(){;}
        return f();
    }

}