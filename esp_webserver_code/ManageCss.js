export var ManageCss = {
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

        create: function(cssCode, cssElement){
            if(cssCode.indexOf('.') == -1){console.warn('not a valid CSS');}

          //  if (cssElement === null){
             //   let newEl = document.createElement('style');
             //   newEl.id = cssElementID;
            //    document.getElementsByTagName('head')[0].appendChild(newEl);
           // }

            if(cssElement.innerHTML.includes(cssCode)){return;}
            cssElement.innerHTML += cssCode;
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
        replace: function(oldClass, newClass, targetClasses){
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

export var ManageWidget = {
    cssCode: {
        create: function(elementID, cssCode, cssElementID){
            let cssClassName = ManageWidget.internal.cssCodeToCssClassName(cssCode);
            let fullCssClass =  '.' + cssClassName + '{' + cssCode + ';}';


            if (document.getElementById(cssElementID) === null){
                let newEl = document.createElement('style');
                newEl.id = cssElementID;
                document.getElementsByTagName('head')[0].appendChild(newEl);
            }

            if(document.getElementById(cssElementID).innerHTML.includes(fullCssClass)){return;}
            document.getElementById(cssElementID).innerHTML = document.getElementById(cssElementID).innerHTML += fullCssClass;


            document.getElementById(elementID).classList.add(cssClassName);
        },
    
        replace: function(){
        },
    
        remove: function(elementID, cssCode, cssElementID){
            let cssClassName = ManageWidget.internal.cssCodeToCssClassName(cssCode);
            let fullCssClass =  '.' + cssClassName + '{' + cssCode + ';}';

            console.log(fullCssClass + '-> removing')

            if(document.getElementById(cssElementID).innerHTML.includes(fullCssClass) == false){console.warn(fullCssClass + '-> not found')}
            document.getElementById(cssElementID).innerHTML = document.getElementById(cssElementID).innerHTML.replace(fullCssClass, '');

            document.getElementById(elementID).classList.remove(cssClassName);
        },
    },

    elements: {
        get: {
            widgetDivElementID: function(){
            },

            widgetCssElementID: function(){
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

            cssClassName = cssClassName.replaceAll('%', 'prc');

            return cssClassName;
        },
    },
}