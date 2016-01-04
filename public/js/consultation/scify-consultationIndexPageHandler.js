
scify.ConsultationIndexPageHandler = function( consultationid,finalLawId,ratingUsers,finalLawUserId,userId,fullName,
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
    this.ratingUsers = [];
    for (var i=0; i<ratingUsers.length; i++) {
        this.ratingUsers[i] = {userId: ratingUsers[i].user_id, liked: ratingUsers[i].liked};
    }
    console.log(this.ratingUsers);
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
    refreshLikeDislikeLinks = function(elementId){
        if($(elementId).hasClass("liked")) {
            $(elementId+ " a").css("color","grey");
        } else if($(elementId).hasClass("disliked")){
            $(elementId + " a").css("color","#337ab7");
        }
    },
    checkRatingUsers = function(array, user_id) {
        for(var i=0; i<array.length; i++) {
            if(array[i].userId == user_id)
                return array[i];
        }
        return false;
    }
    rateFinalLawFile = function(instance) {
        var userId = instance.userId;
        var userRate = checkRatingUsers(instance.ratingUsers, userId);
        console.log(userRate);
        if(userRate) {
            if(userRate.liked) {
                $( "#rateApprove").addClass("liked");
                refreshLikeDislikeLinks("#rateApprove");
            } else {
                $( "#rateDisapprove").addClass("liked");
                refreshLikeDislikeLinks("#rateDisapprove");
            }
        }

        var consultationId = instance.consultationid;
        var finalLawId = instance.finalLawId;
        var liked = false;
        $( "#rateApprove a" ).click(function() {
            if(userId == "") {
                $(".noRateBtn").trigger( "click" );
            }
            else if(userId == instance.finalLawUserId) {
             $(".noRateBtn").trigger( "click" );
             $("#noRateModal .notLoggedText").html("Δεν μπορείτε να ψηφίσετε το αρχείο που ανεβάσατε εσείς.");
            }
            else {
                if($( "#rateDisapprove").hasClass("liked")) {
                    $( "#rateDisapprove a").trigger("click");
                    return;
                }
                else if(!$( "#rateApprove").hasClass("liked")) {
                    $( "#rateApprove").removeClass("disliked");
                    $( "#rateApprove").addClass("liked");
                    liked = true;
                } else {
                    $( "#rateApprove").removeClass("liked");
                    $( "#rateApprove").addClass("disliked");
                    liked = false;
                }
                $.ajax({
                    type: 'POST',
                    url: "/consultation/finallaw/rate/" + consultationId + "/" + parseInt(finalLawId) + "/" + 0 + "/" + userId + "/" + liked,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        if(liked) {
                            $("#rateApprove .counter").html(parseInt($("#rateApprove .counter").html()) + 1);
                        } else {
                            $("#rateApprove .counter").html(parseInt($("#rateApprove .counter").html()) - 1);
                        }
                        refreshLikeDislikeLinks("#rateApprove");
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
                $(".noRateBtn").trigger( "click" );
            }
            else if(userId == instance.finalLawUserId) {
             $(".noRateBtn").trigger( "click" );
             $("#noRateModal .notLoggedText").html("Δεν μπορείτε να ψηφίσετε το αρχείο που ανεβάσατε εσείς.");
            }
            else {
                if($( "#rateApprove").hasClass("liked")) {
                    $( "#rateApprove a").trigger("click");
                    return;
                }
                else if(!$( "#rateDisapprove").hasClass("liked")) {
                    $( "#rateDisapprove").removeClass("disliked");
                    $( "#rateDisapprove").addClass("liked");
                    liked = true;
                } else {
                    $( "#rateDisapprove").removeClass("liked");
                    $( "#rateDisapprove").addClass("disliked");
                    liked = false;
                }
                $.ajax({
                    type: 'POST',
                    url: "/consultation/finallaw/rate/" + consultationId + "/" + parseInt(finalLawId) + "/" + 1 + "/" + userId + "/" + liked,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        //console.log($("#rateApprove .counter").html());
                        if(liked) {
                            $("#rateDisapprove .counter").html(parseInt($("#rateDisapprove .counter").html()) + 1);
                        } else {
                            $("#rateDisapprove .counter").html(parseInt($("#rateDisapprove .counter").html()) - 1);
                        }
                        refreshLikeDislikeLinks("#rateDisapprove");
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
            dictDefaultMessage: 'Σύρετε εδώ το αρχείο που θέλετε να ανεβάσετε, ή κάντε κλικ',
            dictInvalidFileType: "Μη αποδεκτός τύπος αρχείου. Αποδεκτοί τύποι: .pdf, .txt \nΞανακάντε κλικ στο πλαίσιο για να ανεβάσετε άλλο αρχείο",
            accept: function(file, done) {
                console.log();
                $("#finalLawDropZone").append('<div class="waiting-msg"> Περιμένετε <div class="loader">Loading...</div></div>');
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
                this.on('success', function() {
                    $("#finalLawDropZone").find("waiting-msg").remove();
                    console.log("success");
                    setTimeout(function (){
                        var url = window.location.href;
                        if(url.indexOf("?target=finalLaw") == -1)
                            url += '?target=finalLaw';
                        window.location.href = url;
                    }, 500);
                });
            }
        };
    },
    getParameterPointToFinalLaw = function () {
        var parameter = getParameterByName("target");
        console.log(parameter);
        if(parameter == "finalLaw") {
            console.log("scroll");
            $('html, body').animate({
                scrollTop: 500
            }, 1000);
            $(".finalLawLi a").trigger("click");
        }
    },
    getParameterByName = function(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
    },
    deleteFinalLawHandler = function(instance) {
        $( "#deleteFinalLaw" ).click(function() {
            var answer = window.confirm("Είστε σίγουροι για τη διαγραφή;");
            if (answer == true) {
                console.log("You pressed OK!");
                var finalLawId = instance.finalLawId;
                console.log(finalLawId);
                $.ajax({
                    type: 'GET',
                    url: "/consultation/finallaw/delete/" + finalLawId,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        console.log(returnData);
                        setTimeout(function (){
                            var url = window.location.href;
                            if(url.indexOf("?target=finalLaw") == -1)
                                url += '?target=finalLaw';
                            window.location.href = url;
                        }, 200);
                    },
                    error: function (xhr, textStatus, errorThrown) {
                        console.log(errorThrown);
                    },
                    complete: function () {
                        console.log("complete");

                    }
                });
            } else {
                console.log("You pressed Cancel!");
            }
        });
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
        deleteFinalLawHandler(instance);
        rateFinalLawFile(instance);
        getParameterPointToFinalLaw();

    };

    return {
        init:init
    }
}();



