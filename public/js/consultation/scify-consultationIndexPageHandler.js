
scify.ConsultationIndexPageHandler = function( consultationid,finalLawId,ratingUsers,finalLawUserId,userId,fullName,
                                               discussionThreads,
                                               relevantLaws,
                                               consultationIsActive,
                                               imagesPath,
                                               appState,
                                               consultationEndDate){
    this.consultationid= consultationid;
    this.finalLawId = finalLawId;
    this.finalLawUserId = finalLawUserId;
    this.consultationIsActive = consultationIsActive;
    this.userId = userId;
    this.fullName = fullName;
    this.imagesPath = imagesPath;
    this.appState = appState;
    this.discussionThreads ={};
    this.ratingUsers = [];
    for (var i=0; i<ratingUsers.length; i++) {
        this.ratingUsers[i] = {userId: ratingUsers[i].user_id, liked: ratingUsers[i].liked};
    }
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
    this.imagesPath = imagesPath;

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
        var annCounter = 0;
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

            //define function to use after the comment has loaded
            commentBoxProperties.scrollToComment = callAfterCommentHasLoaded;

            var domElementToAddComponent = $(articleDiv).find(".open-gov")[0];
            if (domElementToAddComponent) {
                scify.discussionRooms[commentBoxProperties.discussionthreadclientid] = React.render(React.createElement(scify.CommentBox, commentBoxProperties), domElementToAddComponent);
            }
            $(articleDiv).find(".ann").each(function(i,ann){
                //userDefined is true when the user is logged in. We need to parse it to the comment box
                //to know whether the user can post a reply or not.
                var userDefined = true;
                if(instance.userId==undefined || instance.userId=='' || instance.userId== null) {
                    userDefined = false;
                }
                var annId = $(ann).data("id");
                commentBoxProperties.discussionthreadclientid = getDiscussionThreadClientId(articleid,annId );
                commentBoxProperties.discussionthreadid = getDiscussionThreadId.call(instance,articleid,annId );
                commentBoxProperties.commentsCount  = getDiscussionThreadNumberOfComments.call(instance,articleid,annId )
                commentBoxProperties.source="dm";
                commentBoxProperties.userId = instance.userId;
                commentBoxProperties.fullName = instance.fullName;
                commentBoxProperties.discussionThreadText = $(this).text().replace($(this).find(".ann-icon").text(),"");
                commentBoxProperties.isdiscussionForTheWholeArticle = false;
                commentBoxProperties.userDefined = userDefined;
                commentBoxProperties.imagesPath = instance.imagesPath;
                commentBoxProperties.annotationId = annId;
                commentBoxProperties.consultationId = instance.consultationid;
                commentBoxProperties.appState = instance.appState;
                commentBoxProperties.annId = annCounter;
                annCounter++;
                var commentBox = $('<div class="commentbox-wrap"></div>');
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
        if(data.annotationTagTopics.length > 0) {
            //facebook tracking code for user annotation topic
            fbq('track', 'AddToCart');
        }
        if(data.annotationTagProblems.length > 0) {
            //facebook tracking code for user annotation problems
            fbq('track', 'AddToWishlist');
        }
        //if the form was opened for edit the comment, the forEdit input value is 1, else 0
        if(data.forEdit == "0")
            getDiscussionRoom(data.articleid,data.discussionroomannotationtagid).saveComment(data.action,data);
        else {
            //set the appropriate route for edit
            data.action = "/annotation/update";
            getDiscussionRoom(data.articleid, data.discussionroomannotationtagid).updateComment(data.action, data);
        }

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
    },
    rateFinalLawFile = function(instance) {
        var userId = instance.userId;
        var userRate = checkRatingUsers(instance.ratingUsers, userId);
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
            maxFilesize: 10, // MB
            url: "/consultation/finalLawUpload/" + instance.consultationid + "/" + instance.userId,
            uploadMultiple: false,
            maxFiles: 1,
            acceptedFiles: "application/pdf,text/plain",
            dictDefaultMessage: 'Σύρετε εδώ το αρχείο που θέλετε να ανεβάσετε, ή κάντε κλικ. (Αποδεκτοί τύποι αρχείων: .pdf, .txt) ',
            dictInvalidFileType: "Μη αποδεκτός τύπος αρχείου. Αποδεκτοί τύποι: .pdf, .txt \nΞανακάντε κλικ στο πλαίσιο για να ανεβάσετε άλλο αρχείο",
            accept: function(file, done) {
                console.log();
                $("#finalLawDropZone").append('<div class="waiting-msg"> Περιμένετε. Η διαδικασία της μεταφόρτωσης μπορεί να διαρκέσει μερικά δευτερόλεπτα. <div class="loader">Loading...</div></div>');
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
    finalLawModalHandler = function() {
        $( "#finalLawModalBtn" ).click(function() {
            $(".modal-body .container .consultationText div").first().find(".show-hide").click();
            $(".modal-body .finalLawUploadedContent div").first().find(".show-hide").click();
            //$("#finalLawDiv").first().animate({scrollTop: $('.finalLawUploadedContent').offset().top + 80});
        });
    },
    deleteFinalLawHandler = function(instance) {

        $( "#deleteFinalLaw" ).click(function() {
            var answer = window.confirm("Είστε σίγουροι για τη διαγραφή;");
            if (answer == true) {
                console.log("You pressed OK!");
                var finalLawId = instance.finalLawId;
                console.log(finalLawId);
                $("#deleteLaw").append('<div class="loaderSmall">Loading...</div>');
                $.ajax({
                    type: 'GET',
                    url: "/consultation/finallaw/delete/" + finalLawId + "/" + instance.userId,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        console.log(returnData);
                        setTimeout(function (){
                            //$("#deleteLaw").find(".loaderSmall").remove();
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
    },
    getHashValue = function(key) {
            var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
            return matches ? matches[1] : null;
    },
    callAfterCommentHasLoaded = function() {
        var commentId = getHashValue("commentid");
        if(commentId != undefined) {
            $("html, body").animate({scrollTop: $('#' + commentId).offset().top - 50}, 500);
            $("#" + commentId).addClass("targetDiv");
            setTimeout(function () {
                $("#" + commentId).removeClass("targetDiv");
            },1000);
        }
    },
    openArticleAndCommentFromURL = function() {
        //get URL parameters
        var articleId = getHashValue("articleid");
        var annId = getHashValue("annid");
        var commentId = getHashValue("commentid");
        if(articleId != undefined) {
            //open relevant article
            $('[data-target="#body-' + articleId + '"]').click();
        }
        if(annId != undefined) {
            //check the DOM tree to see if the requested annotation belongs to part of article
            if ($('[data-id="' + annId + '"]').next().find(".load").length > 0) {
                //if length > 0 , the annotation belongs to part of article
                $('[data-id="' + annId + '"]').next().find(".load")[0].click();
            } else if($('#body-' + articleId).find(".load").length > 0) {
                //if not, the annotation is for the whole article (comment on article title)
                $('#body-' + articleId).find(".load")[0].click();
            }

        }
        if(annId == null && commentId == null) {
            if(articleId != null) {
                $("html, body").animate({scrollTop: $('#article_' + articleId).offset().top}, 500);
                $('#article_' + articleId).addClass("targetDiv");
                setTimeout(function () {
                    $('#article_' + articleId).removeClass("targetDiv");
                },1000);
            }
            else
                $(".article-title-text").first().trigger("click");
        }
    },
    handleArticleShare = function(instance) {
        $(".shareBtn").click(function(){
            var articleId = $(this).attr('id').split('-')[1];
            var longUrl ="";
            if(instance.appState == "development") {
                longUrl = "http://localhost:9000/consultation/";
            } else {
                longUrl = "http://democracit.org/consultation/";
            }
            longUrl += instance.consultationid + "#articleid=" + articleId;
            //TODO: use Url shortener
            //show the extra div
            $("#share-"+articleId).prev().toggleClass('shareArticleHidden');
            //if the url has not yet been added, we add it to the div
            if($("#share-"+articleId).prev().find(".shareUrl").length == 0)
                $("#share-"+articleId).prev().append('<div class="shareUrl"><a href="' + longUrl + '">' + longUrl + '</a></div>');
        });
    },
    getShortUrl = function(long_url, login, api_key) {
        $.getJSON(
            "http://api.bitly.com/v3/shorten?callback=?",
            {
                "format": "json",
                "apiKey": api_key,
                "login": login,
                "longUrl": long_url
            },
            function(response)
            {
                return response.data.url;
            }
        );
    },
    openCommentFormForEdit = function(e,comment){
        //clear annotation toolbar , populate fields and open.
        //console.log(e);
        //console.log(comment);
         this.commentAnnotator.openForEdit(e, comment);
    },
        annotateFinalLaw = function(){
            var finalLawAnn = new scify.Annotator("#finalLawDiv  .article-body,#finalLawDiv .article-title-text", "fl-ann");
            finalLawAnn.init();
            $("#finalLawDiv .fl-ann").append("<span class='fl-ann-icon' title='κλικ εδώ για δήλωση κειμένου που συμπεριελήφθη το σχόλιο'><input type='checkbox'></span>");

        },
    init = function(){
        var instance= this;
        moment.locale('el');

        this.commentAnnotator = new scify.CommentAnnotator(false, handleAnnotationSave);
        this.commentAnnotator.init();

        annotateFinalLaw();

        replaceRelevantLaws(this.relevantLaws);
        addRelevantLawsHandler();
        $(".article-title-text").click(expandArticleOnClick);
        $("body").on("editcomment",openCommentFormForEdit.bind(this));
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
        finalLawModalHandler();
        openArticleAndCommentFromURL();
        handleArticleShare(instance);
    };

    return {
        init:init
    }
}();



