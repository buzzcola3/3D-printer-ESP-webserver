import {ManageCss} from "./ManageCss.js";

export var ManageDiv = {
    passed: {
        image: {
            add: function(originalDiv, imageFileName){
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
            addCode: function(element, cssCode, elementToAddCssTo){
                let cssClassName = ManageDiv.internal.cssCodeToCssClassName(cssCode);
                
                ManageCss.byId.create( '.' + cssClassName + '{' + cssCode + ';}', elementToAddCssTo)
                element.classList.add(cssClassName);
                return element;
            },

            removeCode: function(element, cssCode, elementToRemoveCssFrom){
                let cssClassName = ManageDiv.internal.cssCodeToCssClassName(cssCode);
                console.log(cssClassName);
                
                ManageCss.byId.remove(cssClassName, elementToRemoveCssFrom)
                element.classList.remove(cssClassName);
                return element;

            },
        },
    },

    existing: {
        css: {
            replaceCode: function(cssCode, newCssCode, cssElementID){
                let cssClassName = ManageDiv.internal.cssCodeToCssClassName(cssCode);
                let newCssClassName = ManageDiv.internal.cssCodeToCssClassName(newCssCode);

                let fullClass = '.' + cssClassName + '{' + cssCode + ';}'
                let newFullClass = '.' + newCssClassName + '{' + newCssCode + ';}'

                if(document.getElementById(cssElementID).innerText.includes(newFullClass)){return;}
                if(document.getElementById(cssElementID).innerText.includes(fullClass) == false){console.warn('nothing to replace'); return;}

                document.getElementById(cssElementID).innerText = document.getElementById(cssElementID).innerText.replace(fullClass, newFullClass);
                
                let i = 0;
                while(1){
                    if(document.getElementsByClassName(cssClassName).length <= 0){break;}
                    document.getElementsByClassName(cssClassName)[0].classList.replace(cssClassName, newCssClassName)
                    if(i>200){console.warn('too many elements ?'); break;}
                    i++;
                }
            },

            replaceClass: function(cssCode, newCssCode, cssElementID){
                let cssClassName = ManageDiv.internal.cssCodeToCssClassName(cssCode);

                let newClassName = ManageDiv.internal.cssCodeToCssClassName(newCssCode);

                let i = 0;

                while(1){
                    if(document.getElementsByClassName(cssClassName).length <= 0){break;}
                    document.getElementsByClassName(cssClassName)[0].classList.replace(cssClassName, newClassName)
                    if(i>200){console.warn('too many elements ?'); break;}
                    i++;
                }

                ManageCss.byId.create( '.' + newClassName + '{' + newCssCode + ';}', cssElementID)

            },
        },

        div: {
            appendAttribute: function(elementID, attName, attValue){
                document.getElementById(elementID).setAttribute(attName, attValue);
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