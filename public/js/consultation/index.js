
scify.ConsultationIndexPageHandler = function(annotationTags){
    this.annotationTags = annotationTags;
};
scify.ConsultationIndexPageHandler.prototype = function(){

    var getSelection = function() {
        if (window.getSelection)
          return window.getSelection();
        else if (document.selection)
          return document.selection;

            return null;
    },
    getSelectionText= function(selection){
        if (window.getSelection)
            return selection.toString();
        else if (document.selection)
            return selection.createRange().text;
    },
     getSelectionHtml = function(selection) {
        var html = "";
        if (window.getSelection) {
            if (selection.rangeCount) {
                var container = document.createElement("div");
                for (var i = 0, len = selection.rangeCount; i < len; ++i) {
                    container.appendChild(selection.getRangeAt(i).cloneContents());
                }
                html = container.innerHTML;
            }
        } else if (document.selection) {
            if (selection.type == "Text")
                html = document.selection.createRange().htmlText;
        }
        return html;
    },
    selectionIsAllowed = function(selection){
      var html = getSelectionHtml(selection);
        return html.indexOf("article")==-1;
    },
    clearSelection= function(selection){
        if(selection){
            if(selection.empty)
                selection.empty();

            if(selection.removeAllRanges)
                selection.removeAllRanges();
        }
    },
    expandArticleOnClick = function(){
        var article = $(this).closest(".article");
        if (!article.find(".body").hasClass("in"))
            article.find(".show-hide").trigger("click");
    },
        recurseAllTextNodesAndApply = function(element,action){
            if (element.childNodes.length > 0)
                for (var i = 0; i < element.childNodes.length; i++)
                    recurseAllTextNodesAndApply(element.childNodes[i],action);

            if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '')
                action(element);
        },
        createAnnotatableAreas = function()
        {
            var counter=0;
            var action = function(element)
            {
                $(element).wrap("<span id='ann-"+counter+"' class='ann'></span>");
                counter++;
            }

            $(".article-body").each(function(i,el){
                recurseAllTextNodesAndApply(el,action );
            });

        }
    init = function(){
        createAnnotatableAreas();
       //$("#wrapper").mouseup(function(){
       //     var selection= getSelection();
       //    if (!selectionIsAllowed(selection))
       //      clearSelection(selection);
       //     else
       //    {
       //        var range = selection.getRangeAt(0);
       //        if(range && !selection.isCollapsed)
       //        {
       //            if(selection.anchorNode.parentNode == selection.focusNode.parentNode)
       //            {
       //                var span = document.createElement('span');
       //                span.className = 'highlight';
       //                range.surroundContents(span);
       //            }
       //        }
       //
       //    }
       //    console.log(getSelectionHtml(selection));
       //    console.log(getSelectionText(selection));
       //
       //});

        $(".article-title-text").click(expandArticleOnClick);
        $(".article-title-text").first().trigger("click");

    };
    return {
        init:init
    }
}();