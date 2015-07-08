
scify.ConsultationIndexPageHandler = function(annotationTags, consultationid,userId,fullName, discussionThreads){
    this.annotationTags = annotationTags;
    this.consultationid= consultationid;
    this.userId = userId;
    this.fullName = fullName;
    this.discussionThreads =discussionThreads;
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
        elementCanBeAnnotated= function(element)
        {
            //an element can be annotated if its a #TEXT node with actual text
            if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '')
                return true;

            //an element can be annotated if all it's children are #TEXT OR SUP nodes
            var bannedNodeFound=false;
            for (var i = 0; i < element.childNodes.length; i++) {
                if ( element.childNodes[i].nodeName !="SUP" && element.childNodes[i].nodeName !="#text"  )
                    bannedNodeFound=true; //the child node is not SUP and is not #TEXT node
            }
            if (bannedNodeFound || element.textContent.trim().length==0)
                return false;

            return true;

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
    displayToolBar = function(e,selectedText){
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
        toolbar.find("input[name='annText']").val(selectedText);

        var parent = target.closest(".ann")
        var annid=parent.data("id");
        var articleid=target.closest(".article").data("id");
        toolbar.find("input[name='articleid']").val(articleid);
        toolbar.find("input[name='discussionroomannotationtagid']").val(annid);
        toolbar.find("blockquote").text(selectedText);

    },
    hideToolBar = function(){
            $("#toolbar").hide();
    },
    getDiscussionThreadId = function(articleId,commentBoxId){
        //todo: implement this
        //should be loaded from the database. for each commentbox id and article id we have one discussion thread id
        return -1;
    },
    createDiscussionRooms = function(){
        var instance = this;
        //todo: load existing rooms from database
        scify.discussionRooms={}; //an object that will contain reference to all the React divs that host the comments
        $(".article").each(function(index,articleDiv){
            var articleid =$(articleDiv).data("id");
            var commentBoxId=getDiscussionThreadClientId(articleid);
            var commentBoxProperties= {
                consultationid      : instance.consultationid,
                articleid           : articleid,
                discussionthreadid  : getDiscussionThreadId(articleid,commentBoxId),
                discussionThreadClientId: -1
            };
            var domElementToAddComponent = $(articleDiv).find(".open-gov-commentbox-wrap")[0];
            scify.discussionRooms[commentBoxProperties.id] = React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );

            $(articleDiv).find(".ann").each(function(i,ann){
                commentBoxProperties.discussionThreadClientId = getDiscussionThreadClientId(commentBoxProperties.articleid,$(ann).data("id"))
                commentBoxProperties.discussionthreadid = getDiscussionThreadId(commentBoxProperties.articleid,commentBoxProperties.id);
                commentBoxProperties.userId = instance.userId;
                commentBoxProperties.fullName = instance.fullName;
                commentBoxProperties.discussionThreadText = $(this).html();
                $(ann).after('<div class="commentbox-wrap"></div>');
                domElementToAddComponent = $(ann).next()[0];
                scify.discussionRooms[commentBoxProperties.discussionThreadClientId] =React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );
            });
        });
    },
    getDiscussionRoom = function(articleid,annId){
        return scify.discussionRooms[getDiscussionThreadClientId(articleid,annId)];
    },
    getDiscussionThreadClientId = function(articleid,annId){
        return articleid+(annId ? annId :"");
    },
    fetchOpenGovComments = function(e){
        e.preventDefault();
        var articleDiv = $(this).closest(".article");
        var articleid =articleDiv.data("id");
        var url = $(this).attr("href");
        getDiscussionRoom(articleid).refreshComments(url);
    },
     handleAnnotationSave = function(e){
         e.preventDefault();
         var form = $(this).closest("form");
         var data = {};
         form.serializeArray().map(function(x){data[x.name] = x.value;}); //convert to object
         data.annotationTagText = form.find("option:selected").text(); //tag text of the problem user selected
         data.userAnnotatedText = form.find("blockquote").html();  // the text in the document user annotated
         getDiscussionRoom(data.articleid,data.discussionroomannotationtagid).saveComment(form.attr("action"),data);
         hideToolBar();
     },
    init = function(){
        var instance= this;
        moment.locale('el');

        createAnnotatableAreas();
        attachBallons();
        attachAnnotationEvents();

        $(".article-title-text").click(expandArticleOnClick);
        $(".article-title-text").first().trigger("click");

        $("body").on("click",".open-gov-comments", fetchOpenGovComments);
        createDiscussionRooms.call(instance);

        //tinymce.init({selector:'textarea'})
        $("#toolbar").find(".close").click(hideToolBar);
        $("#save-annotation").click(handleAnnotationSave);
    };

    return {
        init:init
    }
}();

