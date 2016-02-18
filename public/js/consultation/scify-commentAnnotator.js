scify.CommentAnnotator = function(enableUserToAnnotateSubtext, onCommentSubmitHandler, commentAnnMessages){

    this.enableUserToAnnotateSubtext = enableUserToAnnotateSubtext;
    this.onCommentSubmitHandler  =onCommentSubmitHandler;
    this.messages = commentAnnMessages;
    console.log(this.messages);
}
scify.CommentAnnotator.prototype = (function(){
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
        attachAnnotationEvents = function(instance){

            if (instance.enableUserToAnnotateSubtext) {
                $("body").on("mouseup",".ann",function(e){
                    var selection= getSelection();
                    if (!selectionIsAllowed(selection)){
                        clearSelection(selection);
                        hideToolBar();
                    }
                    else
                        displayToolBar.call(instance,e,getSelectionText(selection));
                });
            }

            $("body").on("click",".ann-icon",displayToolBar.bind(instance));

        },
        attachAnnotationPrompts= function(instance){
            $(".ann").append("<span class='ann-icon' title='" + instance.messages.annTextTitle + "'><i class='fa fa-pencil-square-o'></i></span>");
        },
        fetchTopicTagsForUserSelection = function(selectedText, instance){

            if (selectedText.length>20 &&  $("#toolbar").hasClass("logged-in"))
            {
                $.ajax({
                    method: "POST",
                    url: "/annotation/extractTags",
                    contentType: 'text/plain;charset=utf-8',
                    data: selectedText,
                    success : function(tags){
                        //add additional tags to the select | these are created based on the text use has selected from the ui
                        var select =  $('#annotationTagTopicId')
                        $.each(tags, function (i, tag) {
                            select.append($("<option class='text-tag extracted-auto' value='-1'>"+tag+"</option>"));
                        });
                        destroyAnnotationTopicTagsSelect();
                        initAnnotationTopicTagsSelect(instance);
                    }
                });
            }
        },
        openArticleBodyIfClosed = function(targetElement) {
            //check if open/close article button is closed. If it is, open it after a time interval
            if($(targetElement).prev().hasClass("collapsed")) {
                setTimeout( function() {
                    $(targetElement).prev().trigger("click")}, 500);
            }
        },
        displayToolBar = function(e,selectedText){
            var instance = this;
            console.log(this.messages);
            e.stopPropagation();
            var target = $(e.target),
                toolbar = $("#toolbar-modal");

            var articleTitleDiv = $(target).parent().parent().parent();
            //check if for the whole article
            if($(articleTitleDiv).hasClass("article-title-text")) {
                //call function to open article div if closed
                openArticleBodyIfClosed(articleTitleDiv);
            }
            resetForm();

            if (target.hasClass("ann-icon") || target.parent().hasClass("ann-icon")){
                selectedText =  target.closest(".ann").text();
            }

            var topicsLabel=  $("#tag-topics-label").find("span");
            var topicsTagTooltip =$("#tag-topics-label").find("i");
            var problemsLabel = $("#tag-problem-label").find("span");

            if (target.closest(".title").length>0)
            {

                $("#myModalLabel").text(this.messages.forWholeArticle);
                topicsLabel.text(topicsLabel.data("article"));
                topicsTagTooltip.attr("title",topicsTagTooltip.data("article"));
                topicsTagTooltip.attr("data-original-title",topicsTagTooltip.data("article"));
                problemsLabel.text(problemsLabel.data("article"));
                toolbar.find("blockquote").hide();
                toolbar.find("input[name='discussionroomtypeid']").val(1);

            }
            else{
                $("#myModalLabel").text(this.messages.forTextPart);
                topicsLabel.text(topicsLabel.data("text"));
                topicsTagTooltip.attr("title",topicsTagTooltip.data("text"));
                topicsTagTooltip.attr("data-original-title",topicsTagTooltip.data("text"));
                problemsLabel.text(problemsLabel.data("text"));
                toolbar.find("input[name='discussionroomtypeid']").val(2);
                toolbar.find("blockquote").show();
            }

            $("#toolbar-modal").modal("show");
            fetchTopicTagsForUserSelection(selectedText, instance);

            toolbar.find("input[name='annText']").val(selectedText);
            var parent = target.closest(".ann");
            var annid=parent.data("id");
            var articleid=target.closest(".article").data("id");
            toolbar.find("input[name='articleid']").val(articleid);
            toolbar.find("input[name='discussionroomannotationtagid']").val(annid);
            toolbar.find("blockquote").text(selectedText);

        },
        displayToolbarForEdit = function(e, comment) {
            var instance = this;
            console.log(comment);
            e.preventDefault();
            var target = $(e.target),
                toolbar = $("#toolbar-modal");
            resetForm();
            var selectedText = comment.userAnnotatedText;

            var topicsLabel=  $("#tag-topics-label").find("span");
            var topicsTagTooltip =$("#tag-topics-label").find("i");
            var problemsLabel = $("#tag-problem-label").find("span");

            $("#myModalLabel").text(this.messages.editCommentLabel);
            topicsLabel.text(topicsLabel.data("text"));
            topicsTagTooltip.attr("title",topicsTagTooltip.data("text"));
            topicsTagTooltip.attr("data-original-title",topicsTagTooltip.data("text"));
            problemsLabel.text(problemsLabel.data("text"));
            toolbar.find("input[name='discussionroomtypeid']").val(2);
            toolbar.find("blockquote").show();

            $("#toolbar-modal").modal("show");
            fetchTopicTagsForUserSelection(selectedText, instance);
            toolbar.find("input[name='revision']").val(comment.revision);
            toolbar.find("input[name='annText']").val(selectedText);
            var articleid= comment.articleId;
            toolbar.find("input[name='articleid']").val(articleid);
            toolbar.find("input[name='commentId']").val(comment.id);
            toolbar.find("input[name='discussionroomannotationtagid']").val(comment.annId);
            toolbar.find("blockquote").text(selectedText);
            toolbar.find("textarea[name='body']").val(comment.body);
            toolbar.find("input[name='forEdit']").val(1);
            toolbar.find("li[data-id=" + comment.emotionId + "]").addClass("clicked");
            toolbar.find("input[name='emotionId']").val(comment.emotionId);

            setSelectedAnnotationsAndProblems(toolbar, comment.annotationTagTopics, comment.annotationTagProblems);
            //comment.annotationTagTopics
        },
        setSelectedAnnotationsAndProblems = function(toolbar, annotationTagTopics, annotationTagProblems) {
            annotationTagProblems.forEach(function(annotationTagProblem) {
                toolbar.find("#annotationTagProblemId").find("option[value=" + annotationTagProblem.id + "]").attr('selected', 'selected');
            });
            annotationTagTopics.forEach(function(annotationTagTopic) {
                toolbar.find("#annotationTagTopicId").find("option[value=" + annotationTagTopic.id + "]").attr('selected', 'selected');
            });
            $('#annotationTagProblemId').select2();
            $('#annotationTagTopicId').select2();

        },
        collectAnnotatorData = function(e){
            e.preventDefault();
            var form = $("#toolbar-modal").find("form");
            var data = {};
            form.serializeArray().map(function(x){data[x.name] = x.value;}); //convert to object
            var extractSelectedTags = function($select){
                var tags = [];
                $select.find("option:selected").each(function(index,el){
                  tags.push({
                        text :$(el).text(),
                        value: $(el).attr("value") == $(el).text() ? -1 : $(el).attr("value")
                    });
                });
                return tags;
            };

            //data.annotationTagText = extractSelectedTags($("#annotationTagProblemId")) //tag text of the problem user selected
            data.annotationTagProblems = extractSelectedTags($("#annotationTagProblemId")) //tag text of the problem user selected
            data.annotationTagTopics = extractSelectedTags($("#annotationTagTopicId"));

            data.userAnnotatedText = form.find("blockquote").html();  // the text in the document user annotated
            return data;
        },
        hideToolBar = function(){
            $("#toolbar-modal").modal("hide");
        },
        displayAnnotationIcon = function(){
            var current=$(this).find(".ann-icon");
            current.addClass("on");
             $(".ann-icon").not(current).removeClass("on");
        },
        resetForm = function(){
            if ($("#toolbar").hasClass("logged-in"))
            {
                $("#annotationTagTopicId").select2("val","");
                $("#toolbar").find("input[name='forEdit']").val(0);
                $("#annotationTagTopicId").find(".text-tag").remove(); //remove options related to the user's selected text
                $("#annotationTagProblemId").select2("val","");
                $("#toolbar").find("textarea").val("");
                $("#toolbar").find("input[name='emotionid']").val("");
                $("#toolbar").find("input[name='revision']").val("");
            }
        },
        destroyAnnotationTopicTagsSelect = function(){
            $("#annotationTagTopicId").select2("destroy");
        },
        initAnnotationTopicTagsSelect = function(instance){
            var firstTag = $("#annotationTagTopicId").find("option").first()
            var placeHolderExample = firstTag && firstTag.length>0 ? "πχ '"+ firstTag.text()+"'" : "";
            $("#annotationTagTopicId").select2({
                placeholder:  instance.messages.topicPrompt + " " + placeHolderExample,
                tags: true,
                tokenSeparators: [',', ' ']
            });
        },
        formIsValid = function(data){

            if ($.trim(data.annotationTagProblems).length==0 &&
                $.trim(data.annotationTagTopics).length==0 &&
                $.trim(data.body).length==0 )
            {
                swal({
                    title: "Κενό σχόλιο",
                    text: 'Παρακαλώ εισάγετε την παρατήρηση σας ή <br/><br/> υποδηλώστε πρόβλημα/θέμα',
                    html: true
                });

                return false;
            }

            return true;
        },
        handleAnnotationSave = function(e){
            var form = $("#toolbar-modal").find("form");
            var data = collectAnnotatorData(e);
            data.action = form.attr("action");
            //reset emotion hidden field
            $(".emotionItem").removeClass("clicked");
            $('input[name=emotionId]').val("");

            if (formIsValid(data))
            {
                hideToolBar();
                this.onCommentSubmitHandler(data);
            }
        },
        handleEmotion = function(instance) {
            $(".emotionItem").click(function() {
                var emotionId = $(this).attr('data-id');
                $(".emotionItem").removeClass("clicked");
                $("#emotion" + emotionId).addClass("clicked");
                $('input[name=emotionId]').val(emotionId);
            });
        },
        openForEdit = function(e, comment){
            displayToolbarForEdit(e, comment);
        },
        init = function(){
            var instance = this;
            var annotatorAreaCreator = new scify.Annotator("#consultation-body .article-body,#consultation-body .article-title-text","ann");
            annotatorAreaCreator.init();
            // createAnnotatableAreas();
            attachAnnotationPrompts(instance);
            attachAnnotationEvents(instance);

            $("#annotationTagProblemId").select2({
                placeholder: instance.messages.topicExample,
                tags: true,
                tokenSeparators: [',', ' ']
            });

            initAnnotationTopicTagsSelect(instance);

            $("body").on("mouseenter",".ann",displayAnnotationIcon);

            $("body").on("mouseenter",".ann-icon",function(){
                $(this).parent(".ann").toggleClass("hl");
            });

            $("body").on("mouseleave",".ann-icon",function(){
                $(this).parent(".ann").toggleClass("hl");
            });

            $("#toolbar-modal").find("form").submit(handleAnnotationSave.bind(this));

            handleEmotion(instance);

        };

    return {
        init:init,
        hideToolBar : hideToolBar,
        collectAnnotatorData : collectAnnotatorData,
        openForEdit: openForEdit
    }
})();
