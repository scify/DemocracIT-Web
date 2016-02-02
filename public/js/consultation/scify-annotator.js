
scify.Annotator = function(selectors, classForAnnotationArea){
    this.selectors = selectors;
    this.classForAnnotationArea= classForAnnotationArea;
}
scify.Annotator.prototype = (function(){

    var recurseAllTextNodesAndApply = function(element,action){

            if (element.className && element.className.indexOf("skip-ann")>=0)
                return;

            if (elementCanBeAnnotated(element))
            {
                action(element);
                return; //dont allow iteration to children
            }

            if (element.childNodes.length > 0)
                for (var i = 0; i < element.childNodes.length; i++)
                {
                    recurseAllTextNodesAndApply(element.childNodes[i],action);
                }
        },
        elementCanBeAnnotated= function(element) {
            //an element can be annotated if its a #TEXT node with actual text
            if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '')
                return true;

            //an element can be annotated if all it's children are #TEXT OR SUP nodes
            var bannedNodeFound=false;
            for (var i = 0; i < element.childNodes.length; i++) {
                if ( element.childNodes[i].nodeName !="SUP" &&
                    element.childNodes[i].nodeName !="#text" &&
                    element.childNodes[i].nodeName !="STRONG" )
                {
                    bannedNodeFound=true; //the child node is not SUP and is not #TEXT node
                    break;
                }
            }
            if (bannedNodeFound || element.textContent.trim().length==0)
                return false;

            return true;

        },
        createAnnotatableAreas = function() {
             var counter=0;
            var instance = this;
            var action = function(element)
            {
                if (element.nodeType == Node.TEXT_NODE)
                    $(element).wrap("<span data-id='"+instance.classForAnnotationArea+"-"+counter+"' class='"+instance.classForAnnotationArea+"'></span>");
                else
                    $(element).html("<div data-id='"+instance.classForAnnotationArea+"-"+counter+"' class='"+instance.classForAnnotationArea+"'>"+ $(element).html() +"</div>");

                counter++;
            }
            $(instance.selectors).each(function(i,el){
                recurseAllTextNodesAndApply(el,action );
            });
        };

    return {
        init:createAnnotatableAreas
    }
})();