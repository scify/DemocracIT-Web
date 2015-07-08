
scify.ConsultationIndexPageHandler = function(annotationTags, consultationid,userId,fullName, discussionThreads){
    this.annotationTags = annotationTags;
    this.consultationid= consultationid;
    this.userId = userId;
    this.fullName = fullName;

    this.discussionThreads ={};
    for (var i=0; i<discussionThreads.length; i++)
    {
        this.discussionThreads[discussionThreads[i].clientId]= { id: discussionThreads[i].id, num:discussionThreads[i].numberOfComments }
    }

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
    elementCanBeAnnotated= function(element) {
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
    getDiscussionThreadNumberOfComments = function(articleId,annotationId){
        if (this.discussionThreads.hasOwnProperty(getDiscussionThreadClientId(articleId,annotationId)))
            return this.discussionThreads[getDiscussionThreadClientId(articleId,annotationId)].num

        return 0;
    },
    getDiscussionThreadId = function(articleId,annotationId){

        if (this.discussionThreads.hasOwnProperty(getDiscussionThreadClientId(articleId,annotationId)))
            return this.discussionThreads[getDiscussionThreadClientId(articleId,annotationId)].id

        return -1;

    },
    createDiscussionRooms = function(){
        var instance = this;
        //todo: load existing rooms from database
        scify.discussionRooms={}; //an object that will contain reference to all the React divs that host the comments
        $(".article").each(function(index,articleDiv){
            var articleid =$(articleDiv).data("id");

            var commentBoxProperties= {
                consultationid      : instance.consultationid,
                articleid           : articleid,
                discussionthreadid  : -1,
                discussionthreadclientid: getDiscussionThreadClientId(articleid),
                source :"opengov",
                commentsCount : $(articleDiv).find(".open-gov").data("count")  //for open gov we retrieve the counter from
            };
            var domElementToAddComponent = $(articleDiv).find(".open-gov")[0];
            scify.discussionRooms[commentBoxProperties.discussionthreadclientid] = React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );

            $(articleDiv).find(".ann").each(function(i,ann){
                var annId = $(ann).data("id");
                commentBoxProperties.discussionthreadclientid = getDiscussionThreadClientId(articleid,annId );
                commentBoxProperties.discussionthreadid = getDiscussionThreadId.call(instance,articleid,annId );
                commentBoxProperties.commentsCount  = getDiscussionThreadNumberOfComments.call(instance,articleid,annId )
                commentBoxProperties.source="dm";
                commentBoxProperties.userId = instance.userId;
                commentBoxProperties.fullName = instance.fullName;
                commentBoxProperties.discussionThreadText = $(this).html();
                $(ann).after('<div class="commentbox-wrap"></div>');
                domElementToAddComponent = $(ann).next()[0];
                scify.discussionRooms[commentBoxProperties.discussionthreadclientid] =React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );
            });
        });
    },
    getDiscussionRoom = function(articleid,annId){
        return scify.discussionRooms[getDiscussionThreadClientId(articleid,annId)];
    },
    getDiscussionThreadClientId = function(articleid,annId){
        return articleid+(annId ? annId :"");
    },
    //fetchOpenGovComments = function(e){
    //    e.preventDefault();
    //    var articleDiv = $(this).closest(".article");
    //    var articleid =articleDiv.data("id");
    //    var url = $(this).attr("href");
    //    getDiscussionRoom(articleid).refreshComments(url);
    //},
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

        // TODO: Annotate feks (laws) in every ann class
        $(".article-title-text").click(expandArticleOnClick);
        $(".article-title-text").first().trigger("click");

        //$("body").on("click",".open-gov-comments", fetchOpenGovComments);
        createDiscussionRooms.call(instance);

        //tinymce.init({selector:'textarea'})
        $("#toolbar").find(".close").click(hideToolBar);
        $("#save-annotation").click(handleAnnotationSave);
    };

    return {
        init:init
    }
}();

