scify.Annotator = function(enableUserToAnnotateSubtext, onCommentSubmitHandler){

    this.enableUserToAnnotateSubtext = enableUserToAnnotateSubtext;
    this.onCommentSubmitHandler  =onCommentSubmitHandler;
}
scify.Annotator.prototype = (function(){
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
            var action = function(element)
            {
                if (element.nodeType == Node.TEXT_NODE)
                    $(element).wrap("<span data-id='ann-"+counter+"' class='ann'></span>");
                else
                    $(element).html("<div data-id='ann-"+counter+"' class='ann'>"+ $(element).html() +"</div>");

                counter++;
            }
            $(".article-body,.article-title-text").each(function(i,el){
               // discard the br nodes
               // var html = $(el).html();
               //  html = html.replace(/<br>/g,"#brNode#").replace(/<br\/>/g,"#brNode#");
               //  $(el).html(html);
                recurseAllTextNodesAndApply(el,action );
                //html= $(this).html().replace(/#brNode#/g,"<br>");
                //$(this).html(html);
            });

        },
        attachAnnotationPrompts= function(){
            $(".ann").append("<span class='ann-icon' title='κλικ εδώ για σχολιασμού όλου του κειμένου'><i class='fa fa-pencil-square-o'></i></span>");
        },
        fetchTopicTagsForUserSelection = function(selectedText){

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
                        initAnnotationTopicTagsSelect();
                    }
                });
            }
        },
        displayToolBar = function(e,selectedText){

            var target = $(e.target),
                toolbar = $("#toolbar-modal");


            resetForm();

            if (target.hasClass("ann-icon") || target.parent().hasClass("ann-icon")){
                selectedText =  target.closest(".ann").text();
            }

            var topicsLabel=  $("#tag-topics-label").find("span");
            var topicsTagTooltip =$("#tag-topics-label").find("i");
            var problemsLabel = $("#tag-problem-label").find("span");

            if (target.closest(".title").length>0)
            {

                $("#myModalLabel").text("Παρατήρηση/Σχόλιο για όλοκληρο το άρθρο:");
                topicsLabel.text(topicsLabel.data("article"));
                topicsTagTooltip.attr("title",topicsTagTooltip.data("article"));
                topicsTagTooltip.attr("data-original-title",topicsTagTooltip.data("article"));
                problemsLabel.text(problemsLabel.data("article"));
                toolbar.find("blockquote").hide();
                toolbar.find("input[name='discussionroomtypeid']").val(1);

            }
            else{
                $("#myModalLabel").text("Παρατήρηση/Σχόλιο για το τμήμα κειμένου:");
                topicsLabel.text(topicsLabel.data("text"));
                topicsTagTooltip.attr("title",topicsTagTooltip.data("text"));
                topicsTagTooltip.attr("data-original-title",topicsTagTooltip.data("text"));
                problemsLabel.text(problemsLabel.data("text"));
                toolbar.find("input[name='discussionroomtypeid']").val(2);
                toolbar.find("blockquote").show();
            }

            $("#toolbar-modal").modal("show");
            fetchTopicTagsForUserSelection(selectedText);

            toolbar.find("input[name='annText']").val(selectedText);
            var parent = target.closest(".ann")
            var annid=parent.data("id");
            var articleid=target.closest(".article").data("id");
            toolbar.find("input[name='articleid']").val(articleid);
            toolbar.find("input[name='discussionroomannotationtagid']").val(annid);
            toolbar.find("blockquote").text(selectedText);
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
            }

            //data.annotationTagText = extractSelectedTags($("#annotationTagProblemId")) //tag text of the problem user selected
            data.annotationTagProblems = extractSelectedTags($("#annotationTagProblemId")) //tag text of the problem user selected
            data.annotationTagTopics = extractSelectedTags($("#annotationTagTopicId"));

            data.userAnnotatedText = form.find("blockquote").html();  // the text in the document user annotated
            console.log(data);
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
                $("#annotationTagTopicId").find(".text-tag").remove(); //remove options related to the user's selected text
                $("#annotationTagProblemId").select2("val","");
                $("#toolbar").find("textarea").val("");
            }
        },
        destroyAnnotationTopicTagsSelect = function(){
            $("#annotationTagTopicId").select2("destroy");
        },
        initAnnotationTopicTagsSelect = function(){
            var firstTag = $("#annotationTagTopicId").find("option").first()
            var placeHolderExample = firstTag && firstTag.length>0 ? "πχ '"+ firstTag.text()+"'" : "";
            $("#annotationTagTopicId").select2({
                placeholder:  "κλικ εδώ για να θέσετε το θέμα "  + placeHolderExample,
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

            if (formIsValid(data))
            {
                hideToolBar();
                this.onCommentSubmitHandler(data);
            }



        },
        handleEmotion = function(instance) {
            console.log("here");
            $(".emotionItem").click(function() {
                var emotionId = $(this).attr('data-id');
                $(".emotionItem").removeClass("clicked");
                $("#emotion" + emotionId).addClass("clicked");
                $('input[name=emotionId]').val(emotionId);
                console.log("emotion: " + $('input[name=emotionId]').val());
            });
        },
        init = function(){
            var instance = this;
            createAnnotatableAreas();
            attachAnnotationPrompts();
            attachAnnotationEvents();

            $("#annotationTagProblemId").select2({
                placeholder: "πχ 'ασάφεια', 'μη κατανοητό κείμενο'",
                tags: true,
                tokenSeparators: [',', ' ']
            });

            initAnnotationTopicTagsSelect();

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
        collectAnnotatorData : collectAnnotatorData
    }
})();
