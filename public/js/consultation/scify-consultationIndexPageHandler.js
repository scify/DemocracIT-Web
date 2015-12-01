
scify.ConsultationIndexPageHandler = function( consultationid,finalLawId,finalLawUserId,userId,fullName,
                                               discussionThreads,
                                               relevantLaws,
                                               consultationIsActive,
                                               imagesPath,
                                               consultationEndDate){
    this.consultationid= consultationid;
    this.finalLawId = finalLawId;
    this.finalLawUserId = finalLawUserId;
    this.consultationIsActive = consultationIsActive;
    this.userId = userId;
    this.fullName = fullName;
    this.imagesPath = imagesPath;

    this.discussionThreads ={};
    for (var i=0; i<discussionThreads.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.discussionThreads[discussionThreads[i].clientId]= { id: discussionThreads[i].id, num:discussionThreads[i].numberOfComments }
    }

    this.relevantLaws = [];
    for (var i=0; i<relevantLaws.length; i++) {
        this.relevantLaws[i] = {article_id: relevantLaws[i].article_id ,entity_text : relevantLaws[i].entity_text, pdf_url: relevantLaws[i].pdf_url}
    }

    this.consultationEndDate = consultationEndDate;

    this.tutorialAnnotator = null;

};
scify.ConsultationIndexPageHandler.prototype = function(){

    var expandArticleOnClick = function(){
        var article = $(this).closest(".article");
        if (!article.find(".article-body").hasClass("in"))
            article.find(".show-hide").trigger("click");
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
                consultationid          : instance.consultationid,
                consultationEndDate    : instance.consultationEndDate,
                articleid               : articleid,
                discussionthreadid      : -1,
                discussionthreadclientid: getDiscussionThreadClientId(articleid),
                source :"opengov",
                isdiscussionForTheWholeArticle:true,
                commentsCount : $(articleDiv).find(".open-gov").data("count"),  //for open gov we retrieve the counter from
                parent: "consultation"
            };
            var domElementToAddComponent = $(articleDiv).find(".open-gov")[0];
            if (domElementToAddComponent) {
                scify.discussionRooms[commentBoxProperties.discussionthreadclientid] = React.render(React.createElement(scify.CommentBox, commentBoxProperties), domElementToAddComponent);
            }
            $(articleDiv).find(".ann").each(function(i,ann){
                var annId = $(ann).data("id");
                commentBoxProperties.discussionthreadclientid = getDiscussionThreadClientId(articleid,annId );
                commentBoxProperties.discussionthreadid = getDiscussionThreadId.call(instance,articleid,annId );
                commentBoxProperties.commentsCount  = getDiscussionThreadNumberOfComments.call(instance,articleid,annId )
                commentBoxProperties.source="dm";
                commentBoxProperties.userId = instance.userId;
                commentBoxProperties.fullName = instance.fullName;
                commentBoxProperties.discussionThreadText = $(this).text().replace($(this).find(".ann-icon").text(),"");
                commentBoxProperties.isdiscussionForTheWholeArticle = false;

                var commentBox = $('<div class="commentbox-wrap"></div>')
                if ($(ann).parents(".article-title-text").length>0) // for article titles position comment box inside the body
                {
                    commentBoxProperties.isdiscussionForTheWholeArticle=true;
                    $(ann).parents(".article").find(".open-gov").before(commentBox );
                }
                else
                    $(ann).after(commentBox );

                domElementToAddComponent = commentBox[0];
                scify.discussionRooms[commentBoxProperties.discussionthreadclientid]=
                       React.render(React.createElement(scify.CommentBox, commentBoxProperties),domElementToAddComponent );
            });
        });
    },
    getDiscussionRoom = function(articleid,annId){
        return scify.discussionRooms[getDiscussionThreadClientId(articleid,annId)];
    },
    getDiscussionThreadClientId = function(articleid,annId){
        return articleid+(annId ? annId :"");
    },
    addRelevantLawsHandler = function(){
        $(".relevantLawsBtn").on("click", function(){
            $(".relevantLaw #" + $(this).context.id + " .relevantLawsBtn").toggleClass("clicked");
            if($(".relevantLaw #" + $(this).context.id + " .relevantLawsBtn").hasClass("clicked")) {
                $(".relevantLaw #" + $(this).context.id + " .childLaws").show("slow");
            }
            else {
                $(".relevantLaw #" + $(this).context.id + " .childLaws").hide("fast");
            }
        });
    },
    handleAnnotationSave = function(data){
        getDiscussionRoom(data.articleid,data.discussionroomannotationtagid).saveComment(data.action,data);
     },
    replaceRelevantLaws = function(relevantLaws) {
            for (var i=0; i<relevantLaws.length; i++) {
                var replaceText = relevantLaws[i].entity_text;
                var replacedHtml = $("div[data-id="+ relevantLaws[i].article_id +"]").html().replace(relevantLaws[i].entity_text, "<a target='_blank' href='" + relevantLaws[i].pdf_url + "'>" + replaceText + "</a>");
                $("div[data-id="+ relevantLaws[i].article_id +"]").html(replacedHtml);
            }
        },
    removeParagraphsWithNoText = function(){
            $(".message").find("p").each(function(i,el){
                if ($.trim($(this).text()).length==0)
                    $(this).remove();
            });
        },
    createWordCloudChart = function(instance) {
        var domElementWordCloud = document.getElementById("wordCloudDiv");
        var consWordCloudProperties = {
            chartId : "wordCloudChart"
        };
        window.WordCloudComponent = React.render(React.createElement(scify.WordCloud, consWordCloudProperties), domElementWordCloud);
        loadWordCloud(instance.consultationid);
    },
    loadWordCloud = function(consultationId) {
        window.WordCloudComponent.getConsWordCloudFromServer(consultationId);
    },
    rateFinalLawFile = function(instance) {
        var userId = instance.userId;
        console.log( "Handler init" );
        console.log(userId);
        console.log(instance.finalLawUserId);
        var consultationId = instance.consultationid;
        var finalLawId = instance.finalLawId;
        $( "#rateApprove a" ).click(function() {
            if(userId == "") {
                $(".notLoggedInBtn").trigger( "click" );
            }
            else if(userId == instance.finalLawUserId) {
                $(".sameUploaderBtn").trigger( "click" );
            } else {
                $.ajax({
                    type: 'POST',
                    url: "/consultation/finallaw/rate/" + consultationId + "/" + finalLawId + "/" + 0,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        //console.log($("#rateApprove .counter").html());
                        $("#rateApprove .counter").html(parseInt($("#rateApprove .counter").html()) + 1);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    },
                    complete: function () {
                    }
                });
            }
        });

        $( "#rateDisapprove a" ).click(function() {
            if(userId == "") {
                $(".notLoggedInBtn").trigger( "click" );
            }
            else if(userId == instance.finalLawUserId) {
                $(".sameUploaderBtn").trigger( "click" );
            } else {
                $.ajax({
                    type: 'POST',
                    url: "/consultation/finallaw/rate/" + consultationId + "/" + finalLawId + "/" + 1,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        //console.log($("#rateApprove .counter").html());
                        $("#rateDisapprove .counter").html(parseInt($("#rateDisapprove .counter").html()) + 1);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    },
                    complete: function () {
                    }
                });
            }
        });
    },
    createFinalLawUpload = function(instance) {
        // "myAwesomeDropzone" is the camelized version of the HTML element's ID
        Dropzone.options.finalLawDropZone = {
            paramName: "file", // The name that will be used to transfer the file
            maxFilesize: 2, // MB
            url: "/consultation/finalLawUpload/" + instance.consultationid + "/" + instance.userId,
            uploadMultiple: false,
            maxFiles: 1,
            acceptedFiles: "application/pdf,text/plain",
            dictDefaultMessage: "Σύρετε εδώ το αρχείο που θέλετε να ανεβάσετε, ή κάντε κλικ",
            dictInvalidFileType: "Μη αποδεκτός τύπος αρχείου. Αποδεκτοί τύποι: .pdf, .txt \nΞανακάντε κλικ στο πλαίσιο για να ανεβάσετε άλλο αρχείο",
            accept: function(file, done) {
                console.log();
                if (file.name == "justinbieber.pdf"  || file.name == "justinbieber.txt"   ) {
                    done("Naha, you don't.");
                }
                else { done(); }
            },
            init: function() {
                this.on("error", function(file,errorMessage) {
                    $(".dz-error-message").css("opacity",1);
                });
                this.on("addedfile", function() {
                    /*If more than one file, we ceep the latest one*/
                    if (this.files[1]!=null){
                        this.removeFile(this.files[0]);
                    }
                });
            }
        };
    }
    init = function(){
        var instance= this;
        moment.locale('el');

        this.annotator = new scify.Annotator(false, handleAnnotationSave);
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
        createWordCloudChart(instance);
        createFinalLawUpload(instance);

        rateFinalLawFile(instance);
    };

    return {
        init:init
    }
}();



