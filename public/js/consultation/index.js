
scify.ConsultationIndexPageHandler = function(annotationTags, consultationid){
    this.annotationTags = annotationTags;
    this.consultationid= consultationid;
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
    attachAnnotationEvents = function(){
        var instance = this;
        $("body").on("mouseup",".ann",function(e){
            var selection= getSelection();
            if (!selectionIsAllowed(selection)){
                clearSelection(selection);
                hideToolBar();
            }
            else
                displayToolBar.call(instance,e,getSelectionText(selection));
        });
        $(".ann-icon").click($.proxy(displayToolBar,instance));

    },
    expandArticleOnClick = function(){
        var article = $(this).closest(".article");
        if (!article.find(".article-body").hasClass("in"))
            article.find(".show-hide").trigger("click");
    },
    recurseAllTextNodesAndApply = function(element,action){

        if (element.className && element.className.indexOf("skip-ann")>=0)
            return;

        if (element.childNodes.length > 0)
            for (var i = 0; i < element.childNodes.length; i++)
                recurseAllTextNodesAndApply(element.childNodes[i],action);

        if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '')
            action(element);
    },
    createAnnotatableAreas = function() {
        var counter=0;
        var action = function(element)
        {
            $(element).wrap("<span data-id='ann-"+counter+"' class='ann'></span>");
            counter++;
        }

        $(".article-body,.article-title-text, #consultation-header .title").each(function(i,el){
            counter=0;
            recurseAllTextNodesAndApply(el,action );
        });

    },
    attachBallons = function(){
        $(".ann").append("<span class='ann-icon'>+</span>");
    },
    displayToolBar = function(e,selectedText,startIndex,lastIndex){
        //todo: Use react.js for this.

       var target = $(e.target),
           toolbar = $("#toolbar"),
           toolbarClass ="",
           left = e.clientX,
           top = e.clientY + 20;

        if (target.hasClass("ann-icon"))
        {
            selectedText = target.parent().text();
            selectedText = selectedText.substr(0,selectedText.length-target.text().length); //remove ann-icon text
            left =left - toolbar.width();
        }

        toolbar.addClass(toolbarClass);
        toolbar.fadeIn("fast");
        toolbar.css({top:top, left: left});
       // toolbar.find["input[name='articleId'"].val(article.data("id"));
        toolbar.find("input[name='text']").val(selectedText);
        toolbar.find("input[name='startIndex']").val(startIndex);
        toolbar.find("input[name='endIndex']").val(lastIndex);
        toolbar.find("blockquote").text(selectedText);

    },
    hideToolBar = function(){
            $("#toolbar").hide();
        },
    createDiscussionRooms = function(){
        var instance = this;
        //todo: load existing rooms from database
        scify.discussionRooms={}; //an object that will contain reference to all the React divs that host the comments
        $(".article").each(function(index,articleDiv){
            var commentBoxProperties= {
                consultationid: instance.consultationid,
                articleid:      $(articleDiv).data("id"),
                id: null
            };
            commentBoxProperties.id=getComponentId(commentBoxProperties.articleid);
            var domElementToAddComponent = $(articleDiv).find(".open-gov-commentbox-wrap")[0];
            scify.discussionRooms[commentBoxProperties.id] = React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );

            $(articleDiv).find(".ann").each(function(i,ann){
                commentBoxProperties.id = getComponentId(commentBoxProperties.articleid,$(ann).data("id"))
                $(ann).after('<div class="commentbox-wrap"></div>');
                domElementToAddComponent = $(ann).next()[0];
                scify.discussionRooms[commentBoxProperties.id] =React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );
            });
        });
    },
    getComponentId = function(articleid,annId){
        // discussion threads with id refer to the whole article..where opengov comments also reside
        return articleid+(annId? annId:"");
    },

    fetchOpenGovComments = function(e){
        e.preventDefault();
        var articleDiv = $(this).closest(".article");
        var articleid =articleDiv.data("id");
        var reactComponent =scify.discussionRooms[articleid];
        var url = $(this).attr("href");
        reactComponent.refreshComments(url);
    },
    init = function(){
        var instance= this;
        createAnnotatableAreas();
        attachBallons();
        attachAnnotationEvents();

        $(".article-title-text").click(expandArticleOnClick);
        $(".article-title-text").first().trigger("click");

        tinymce.init({selector:'textarea'})

        $("#toolbar").find(".close").click(hideToolBar);
        moment.locale('el');
        $("body").on("click",".open-gov-comments", fetchOpenGovComments);
        createDiscussionRooms();

    };

    return {
        init:init
    }
}();

