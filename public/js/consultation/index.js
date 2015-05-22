
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
        return html.trim().length>0 && html.indexOf("span")==-1;
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
        if (!article.find(".article-body").hasClass("in"))
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
            $(element).wrap("<span data-id='ann-"+counter+"' class='ann'></span>");
            counter++;
        }

        $(".article-body").each(function(i,el){
            counter=0;
            recurseAllTextNodesAndApply(el,action );
        });

    },
    displayToolBar = function(e,selectedText,startIndex,lastIndex){
        //todo: Use react.js for this.

       // var span = $(e.target),
       //     article = span.closest(".article");
        var toolbar = $("#toolbar");
        toolbar.fadeIn("fast");
        toolbar.css({top: e.clientY, left: e.clientX});
       // toolbar.find["input[name='articleId'"].val(article.data("id"));
        toolbar.find("input[name='text']").val(selectedText);
        toolbar.find("input[name='startIndex']").val(startIndex);
        toolbar.find("input[name='endIndex']").val(lastIndex);
        toolbar.find("blockquote").text(selectedText);

    },
        hideToolBar = function(){
            $("#toolbar").hide();
        },
    init = function(){
        var instance= this;
        createAnnotatableAreas();

       $("#wrapper").mouseup(function(e){
            var selection= getSelection();
           if (!selectionIsAllowed(selection)){
               clearSelection(selection);
               hideToolBar();
           }
            else
           {
               var range = selection.getRangeAt(0);
               displayToolBar.call(instance,e,getSelectionText(selection));
           }


       });

        $(".article-title-text").click(expandArticleOnClick);
        $(".article-title-text").first().trigger("click");

    };
    return {
        init:init
    }
}();