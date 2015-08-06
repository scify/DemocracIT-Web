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
            $(".ann").append("<div class='ann-icon'>κλικ εδώ για σχολιασμό (ή επιλέξτε μέρος του κειμένου)</div>");
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
                //  left =left - toolbar.width();
            }

            $("#toolbar-modal").modal("show");
            // toolbar.addClass(toolbarClass);
            //  toolbar.fadeIn("fast");
            //  toolbar.css({top:top, left: left});
            toolbar.find("input[name='annText']").val(selectedText);

            var parent = target.closest(".ann")
            var annid=parent.data("id");
            var articleid=target.closest(".article").data("id");
            toolbar.find("input[name='articleid']").val(articleid);
            toolbar.find("input[name='discussionroomannotationtagid']").val(annid);
            toolbar.find("blockquote").text(selectedText);

        },
        hideToolBar = function(){
            $("#toolbar-modal").modal("hide");
            // $("#toolbar").hide();
        },
        init = function(){
            createAnnotatableAreas();
            attachAnnotationPrompts();
            attachAnnotationEvents();

            $("#annotationTagId").select2({
                placeholder: "Υπόδειξη προβλήματος",
                tags: true,
                tokenSeparators: [',', ' ']
            });
            $("#annotationTagTopicId").select2({
                placeholder: "Υπόδειξη θέματος",
                tags: true,
                tokenSeparators: [',', ' ']
            });
        };

    return {
        init:init
    }
})();