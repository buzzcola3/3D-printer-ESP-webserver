import {ManageCss} from "./ManageCss.js";

export var ManageDiv = {
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
            addCode: function(element, cssCode, cssElementID){
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