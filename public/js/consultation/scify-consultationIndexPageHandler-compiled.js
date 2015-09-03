"use strict";

scify.ConsultationIndexPageHandler = function (consultationid, userId, fullName, discussionThreads, relevantLaws, consultationIsActive, imagesPath, consultationEndDate) {
    this.consultationid = consultationid;
    this.consultationIsActive = consultationIsActive;
    this.userId = userId;
    this.fullName = fullName;
    this.imagesPath = imagesPath;

    this.discussionThreads = {};
    for (var i = 0; i < discussionThreads.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.discussionThreads[discussionThreads[i].clientId] = { id: discussionThreads[i].id, num: discussionThreads[i].numberOfComments };
    }

    this.relevantLaws = [];
    for (var i = 0; i < relevantLaws.length; i++) {
        this.relevantLaws[i] = { article_id: relevantLaws[i].article_id, entity_text: relevantLaws[i].entity_text, pdf_url: relevantLaws[i].pdf_url };
    }

    this.consultationEndDate = consultationEndDate;

    this.tutorialAnnotator = null;
};
scify.ConsultationIndexPageHandler.prototype = (function () {

    var expandArticleOnClick = function expandArticleOnClick() {
        var article = $(this).closest(".article");
        if (!article.find(".article-body").hasClass("in")) article.find(".show-hide").trigger("click");
    },
        getDiscussionThreadNumberOfComments = function getDiscussionThreadNumberOfComments(articleId, annotationId) {
        if (this.discussionThreads.hasOwnProperty(getDiscussionThreadClientId(articleId, annotationId))) return this.discussionThreads[getDiscussionThreadClientId(articleId, annotationId)].num;

        return 0;
    },
        getDiscussionThreadId = function getDiscussionThreadId(articleId, annotationId) {

        if (this.discussionThreads.hasOwnProperty(getDiscussionThreadClientId(articleId, annotationId))) return this.discussionThreads[getDiscussionThreadClientId(articleId, annotationId)].id;

        return -1;
    },
        createDiscussionRooms = function createDiscussionRooms() {
        var instance = this;
        //todo: load existing rooms from database
        scify.discussionRooms = {}; //an object that will contain reference to all the React divs that host the comments
        $(".article").each(function (index, articleDiv) {
            var articleid = $(articleDiv).data("id");

            var commentBoxProperties = {
                consultationid: instance.consultationid,
                consultationEndDate: instance.consultationEndDate,
                articleid: articleid,
                discussionthreadid: -1,
                discussionthreadclientid: getDiscussionThreadClientId(articleid),
                source: "opengov",
                commentsCount: $(articleDiv).find(".open-gov").data("count") //for open gov we retrieve the counter from
            };
            var domElementToAddComponent = $(articleDiv).find(".open-gov")[0];
            scify.discussionRooms[commentBoxProperties.discussionthreadclientid] = React.render(React.createElement(scify.CommentBox, commentBoxProperties), domElementToAddComponent);

            $(articleDiv).find(".ann").each(function (i, ann) {
                var annId = $(ann).data("id");
                commentBoxProperties.discussionthreadclientid = getDiscussionThreadClientId(articleid, annId);
                commentBoxProperties.discussionthreadid = getDiscussionThreadId.call(instance, articleid, annId);
                commentBoxProperties.commentsCount = getDiscussionThreadNumberOfComments.call(instance, articleid, annId);
                commentBoxProperties.source = "dm";
                commentBoxProperties.userId = instance.userId;
                commentBoxProperties.fullName = instance.fullName;
                commentBoxProperties.discussionThreadText = $(this).text().replace($(this).find(".ann-icon").text(), "");
                $(ann).after("<div class=\"commentbox-wrap\"></div>");
                domElementToAddComponent = $(ann).next()[0];
                scify.discussionRooms[commentBoxProperties.discussionthreadclientid] = React.render(React.createElement(scify.CommentBox, commentBoxProperties), domElementToAddComponent);
            });
        });
    },
        getDiscussionRoom = function getDiscussionRoom(articleid, annId) {
        return scify.discussionRooms[getDiscussionThreadClientId(articleid, annId)];
    },
        getDiscussionThreadClientId = function getDiscussionThreadClientId(articleid, annId) {
        return articleid + (annId ? annId : "");
    },
        addRelevantLawsHandler = function addRelevantLawsHandler() {
        $(".relevantLawsBtn").on("click", function () {
            console.log($(this).context.id);
            $(".relevantLaw #" + $(this).context.id + " .relevantLawsBtn").toggleClass("clicked");
            if ($(".relevantLaw #" + $(this).context.id + " .relevantLawsBtn").hasClass("clicked")) {
                $(".relevantLaw #" + $(this).context.id + " .childLaws").show("slow");
            } else {
                $(".relevantLaw #" + $(this).context.id + " .childLaws").hide("fast");
            }
        });
    },
        handleAnnotationSave = function handleAnnotationSave(e) {
        var instance = this;
        var form = $("#toolbar-modal").find("form");
        var data = instance.annotator.collectAnnotatorData(e);
        getDiscussionRoom(data.articleid, data.discussionroomannotationtagid).saveComment(form.attr("action"), data);
        instance.annotator.hideToolBar();
    },
        replaceRelevantLaws = function replaceRelevantLaws(relevantLaws) {
        for (var i = 0; i < relevantLaws.length; i++) {
            var replaceText = relevantLaws[i].entity_text;
            var replacedHtml = $("div[data-id=" + relevantLaws[i].article_id + "]").html().replace(relevantLaws[i].entity_text, "<a target='_blank' href='" + relevantLaws[i].pdf_url + "'>" + replaceText + "</a>");
            $("div[data-id=" + relevantLaws[i].article_id + "]").html(replacedHtml);
        }
    },
        removeParagraphsWithNoText = function removeParagraphsWithNoText() {
        $(".message").find("p").each(function (i, el) {
            if ($.trim($(this).text()).length == 0) $(this).remove();
        });
    };
    init = function () {
        var instance = this;
        moment.locale("el");

        this.annotator = new scify.Annotator(false);
        this.annotator.init();

        replaceRelevantLaws(this.relevantLaws);
        addRelevantLawsHandler();
        $(".article-title-text").click(expandArticleOnClick);
        $(".article-title-text").first().trigger("click");

        createDiscussionRooms.call(instance);
        removeParagraphsWithNoText();
        //tinymce.init({selector:'textarea'})

        this.tutorialAnnotator = new scify.TutorialAnnotator(this.consultationIsActive, this.imagesPath);
        this.tutorialAnnotator.init();
    };

    return {
        init: init
    };
})();

//# sourceMappingURL=scify-consultationIndexPageHandler-compiled.js.map