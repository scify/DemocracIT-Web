scify.Annotator = function(){}
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
            $("body").on("mouseup",".ann",function(e){
                var selection= getSelection();
                if (!selectionIsAllowed(selection)){
                    clearSelection(selection);
                    hideToolBar();
                }
                else
                    displayToolBar.call(instance,e,getSelectionText(selection));
            });
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
                $(element).wrap("<div data-id='ann-"+counter+"' class='ann'></div>");
                counter++;
            }
            $(".article-body,.article-title-text").each(function(i,el){
                var html = $(el).html();
                html = html.replace(/<br>/g,"#brNode#").replace(/<br\/>/g,"#brNode#");
                $(el).html(html);
                recurseAllTextNodesAndApply(el,action );
                html= $(this).html().replace(/#brNode#/g,"<br>");
                $(this).html(html);
            });

        },
        attachAnnotationPrompts= function(){
            $(".ann").append("<div class='ann-icon' title='κλικ εδώ για σχολιασμού όλου του κειμένου / εναλλακτικά επιλέξετε μέρος του κειμένου'><i class='fa fa-pencil-square-o'></i></div>");
        },
        displayToolBar = function(e,selectedText){
            //todo: Use react.js for this.

            var target = $(e.target),
                toolbar = $("#toolbar");

            if (target.hasClass("ann-icon") || target.parent().hasClass("ann-icon")){
                selectedText =  target.closest(".ann").text();
            }

            $("#toolbar-modal").modal("show");
            toolbar.find("input[name='annText']").val(selectedText);

            var parent = target.closest(".ann")
            var annid=parent.data("id");
            var articleid=target.closest(".article").data("id");
            toolbar.find("input[name='articleid']").val(articleid);
            toolbar.find("input[name='discussionroomannotationtagid']").val(annid);
            toolbar.find("blockquote").text(selectedText);
            resetForm();

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
            $("#annotationTagTopicId").select2("val","");
            $("#annotationTagProblemId").select2("val","");
            $("#toolbar").find("textarea").val("");
        },
        init = function(){
            createAnnotatableAreas();
            attachAnnotationPrompts();
            attachAnnotationEvents();

            $("#annotationTagTopicId").select2({
                placeholder:  "κλικ εδώ για να θέσετε το θέμα (πχ 'μισθος')",
                tags: true,
                tokenSeparators: [',', ' ']
            });
            $("#annotationTagProblemId").select2({
                placeholder: "πχ 'ασάφεια', 'μη κατανοητό κείμενο'",
                tags: true,
                tokenSeparators: [',', ' ']
            });

            $("body").on("mouseenter",".ann",displayAnnotationIcon);

            $("body").on("mouseenter",".ann-icon",function(){
                $(this).parent(".ann").toggleClass("hl");
            });

            $("body").on("mouseleave",".ann-icon",function(){
                $(this).parent(".ann").toggleClass("hl");
            });

        };

    return {
        init:init,
        hideToolBar : hideToolBar,
        collectAnnotatorData : collectAnnotatorData
    }
})();