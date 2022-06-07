export var ManageCss = {
    byId: {
        //cssCode:
        remove: function(className, cssElementID) {
            let oldClassText = document.getElementById(cssElementID).innerText;
        
            let newString = oldClassText.slice(0,oldClassText.indexOf('.' + className))
            let oldString = oldClassText.slice(oldClassText.indexOf('.' + className))
        
            newString += oldString.slice(oldString.indexOf('}')+1)
            document.getElementById(cssElementID).innerHTML = newString.slice(0,-1);
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