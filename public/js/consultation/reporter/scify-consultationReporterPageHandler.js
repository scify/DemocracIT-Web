scify.ConsultationReporterPageHandler = function( consultationid,finalLawId,ratingUsers,imagesPath,finalLawUserId,userId,fullName,
                                                  commentsPerArticle,
                                                  annotationsForConsultation,
                                                  annotationProblemsForConsultation,
                                                  annotationsPerArticle,
                                                  annotationProblemsPerArticle, commenters,
                                                  appState,
                                                  consultationEndDate){
    this.consultationId= consultationid;
    this.userId = userId;
    this.fullName = fullName;
    this.finalLawId = finalLawId;
    this.finalLawUserId = finalLawUserId;
    this.ratingUsers = [];
    this.imagesPath = imagesPath;
    this.appState = appState;
    for (var i=0; i<ratingUsers.length; i++) {
        this.ratingUsers[i] = {userId: ratingUsers[i].user_id, liked: ratingUsers[i].liked};
    }

    this.consultationEndDate = consultationEndDate;

    commentsPerArticle.sort(compare);
    function compare(a,b) {
        if (a.order < b.order)
            return -1;
        if (a.order > b.order)
            return 1;
        return 0;
    }

    annotationsPerArticle.sort(compareNames);
    annotationProblemsPerArticle.sort(compareNames);
    function compareNames(a,b) {
        if (a.article_name < b.article_name)
            return -1;
        if (a.article_name > b.article_name)
            return 1;
        return 0;
    }



    this.commentsPerArticle =[];
    for (var i=0; i<commentsPerArticle.length; i++)
    {
        var articleTitle = "";
        if(commentsPerArticle[i].title.indexOf(':') === -1) {
            articleTitle = commentsPerArticle[i].title;
        } else {
            articleTitle = commentsPerArticle[i].title.substr(0, commentsPerArticle[i].title.indexOf(':'))
        }
        this.commentsPerArticle.push([articleTitle, commentsPerArticle[i].commentsNum, '<div style="padding-left: 10px"><h5 style="width:150px">' + commentsPerArticle[i].title + '</h5>' + '<h5>Σχόλια: ' + commentsPerArticle[i].commentsNum + '</h5></div>', commentsPerArticle[i].id, commentsPerArticle[i].commentsNum, 0 ])
    }

    this.annotationsForConsultation = [];
    for (var i=0; i<annotationsForConsultation.length; i++)
    {
        this.annotationsForConsultation.push([annotationsForConsultation[i].annotationTag.description, annotationsForConsultation[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="150px">Θέμα: ' + annotationsForConsultation[i].annotationTag.description + '</h5>' + '<h5>Σχόλια: ' + annotationsForConsultation[i].numberOfComments + '</h5></div>', annotationsForConsultation[i].annotationTag.id, annotationsForConsultation[i].numberOfComments, 0 ])
    }

    this.annotationProblemsForConsultation = [];
    for (var i=0; i<annotationProblemsForConsultation.length; i++)
    {
        this.annotationProblemsForConsultation.push([ annotationProblemsForConsultation[i].annotationTag.description, annotationProblemsForConsultation[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:150px">Θέμα: ' + annotationProblemsForConsultation[i].annotationTag.description + '</h5>' + '<h5>Σχόλια: ' + annotationProblemsForConsultation[i].numberOfComments + '</h5></div>', annotationProblemsForConsultation[i].annotationTag.id,annotationProblemsForConsultation[i].numberOfComments, 0 ])
    }

    this.annotationsPerArticle = [];
    for (var i=0; i<annotationsPerArticle.length; i++)
    {
        var articleTitle = "";
        if(annotationsPerArticle[i].article_name.indexOf(':') === -1) {
            articleTitle = annotationsPerArticle[i].article_name;
        } else {
            articleTitle = annotationsPerArticle[i].article_name.substr(0, annotationsPerArticle[i].article_name.indexOf(':'));
        }
        this.annotationsPerArticle.push([articleTitle + ": " + annotationsPerArticle[i].annotationTag.description,  annotationsPerArticle[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:150px">' + annotationsPerArticle[i].article_name + '<div>Tag: ' + annotationsPerArticle[i].annotationTag.description + '</div></h5>' + '<h5>Σχόλια: ' + annotationsPerArticle[i].numberOfComments + '</h5></div>', annotationsPerArticle[i].article_id, annotationsPerArticle[i].numberOfComments, annotationsPerArticle[i].annotationTag.id ])
    }

    this.annotationProblemsPerArticle = [];
    for (var i=0; i<annotationProblemsPerArticle.length; i++)
    {
        var articleTitle = "";
        if(annotationProblemsPerArticle[i].article_name.indexOf(':') === -1) {
            articleTitle = annotationProblemsPerArticle[i].article_name;
        } else {
            articleTitle = annotationProblemsPerArticle[i].article_name.substr(0, annotationProblemsPerArticle[i].article_name.indexOf(':'));
        }
        this.annotationProblemsPerArticle.push([articleTitle + ": " + annotationProblemsPerArticle[i].annotationTag.description,  annotationProblemsPerArticle[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:150px">' + annotationProblemsPerArticle[i].article_name + '<div>Tag: ' + annotationProblemsPerArticle[i].annotationTag.description + '</div></h5>' + '<h5>Σχόλια: ' + annotationProblemsPerArticle[i].numberOfComments + '</h5></div>', annotationProblemsPerArticle[i].article_id,annotationProblemsPerArticle[i].numberOfComments, annotationProblemsPerArticle[i].annotationTag.id ])
    }

    getUserById = function(userId) {
        for(var i=0; i<commenters.length; i++) {
            if(userId == commenters[i].user_id) {
                return commenters[i];
            }
        }
    }
};

scify.ConsultationReporterPageHandler.prototype = function(){

    var addRelevantLawsHandler = function(){
            $(".relevantLawsBtn").on("click", function(){
                $(".relevantLaw #" + $(this).context.id + " .relevantLawsBtn").toggleClass("clicked");
                if($(".relevantLaw #" + $(this).context.id + " .relevantLawsBtn").hasClass("clicked")) {
                    $(".relevantLaw #" + $(this).context.id + " i").removeClass("fa-chevron-down");
                    $(".relevantLaw #" + $(this).context.id + " i").addClass("fa-chevron-up");
                    $(".relevantLaw #" + $(this).context.id + " .childLaws").show("slow");
                }
                else {
                    $(".relevantLaw #" + $(this).context.id + " i").removeClass("fa-chevron-up");
                    $(".relevantLaw #" + $(this).context.id + " i").addClass("fa-chevron-down");
                    $(".relevantLaw #" + $(this).context.id + " .childLaws").hide("fast");
                }
            });
        }
    var expandArticleOnClick = function(){
        var article = $(this).closest(".article");
        if (!article.find(".article-body").hasClass("in"))
            article.find(".show-hide").trigger("click");
    },

    createListOfCommentsPerArticle = function(instance){
        var domElementOpenGovComments = document.getElementById("commentsOpenGov");
        var domElementDITComments = document.getElementById("commentsDIT");
        if (domElementOpenGovComments) {
            window.OpenGovommentsPerArticleComponent = React.render(React.createElement(scify.ReporterCommentList, instance.commentListOpenGovProperties), domElementOpenGovComments);
        }
        if (domElementDITComments) {
            //console.log(instance.commentListProperties);
            window.DITGovommentsPerArticleComponent = React.render(React.createElement(scify.ReporterCommentList, instance.commentListProperties), domElementDITComments);
        }
    },
    createListOfCommentsByAnnId = function(instance) {
        var domElementCommentsByAnnId = document.getElementById("commentsPerAnnId");
        if (domElementCommentsByAnnId) {
            window.CommentsByAnnIdComponent = React.render(React.createElement(scify.ReporterCommentList, instance.commentListProperties), domElementCommentsByAnnId);
        }

    },
    createListOfCommentsByProblemId = function(instance) {
        var domElementCommentsByProblemId = document.getElementById("commentsPerProblemId");
        if (domElementCommentsByProblemId) {
            window.CommentsByProblemIdComponent = React.render(React.createElement(scify.ReporterCommentList, instance.commentListProperties), domElementCommentsByProblemId);
        }

    },
    createListOfCommentsByAnnIdPerArticle = function(instance) {
        var domElementCommentsByAnnIdPerArticle = document.getElementById("commentsPerAnnIdPerArticle");
        if (domElementCommentsByAnnIdPerArticle) {
            window.CommentsByAnnIdPerArticleComponent = React.render(React.createElement(scify.ReporterCommentList, instance.commentListProperties), domElementCommentsByAnnIdPerArticle);
        }
    },
    createListOfCommentsByProblemIdPerArticle = function(instance) {
        var domElementCommentsByProblemIdPerArticle = document.getElementById("commentsPerProblemIdPerArticle");
        if (domElementCommentsByProblemIdPerArticle) {
            window.CommentsByProblemIdPerArticleComponent = React.render(React.createElement(scify.ReporterCommentList, instance.commentListProperties), domElementCommentsByProblemIdPerArticle);
        }
    },
    createArticleWordCloudChart = function() {

        var domElementArticleWordCloud = document.getElementById("articleWordCloudDiv");
        if (domElementArticleWordCloud) {
            window.ArticleWordCloudComponent = React.render(React.createElement(scify.WordCloud, null), domElementArticleWordCloud);
        }

    },
    loadListOfCommentsPerArticle = function(articleId) {
        $(".commentsTabs").css("display","block");
        window.OpenGovommentsPerArticleComponent.getOpenGovCommentsByArticleId(articleId);
        window.DITGovommentsPerArticleComponent.getDITCommentsByArticleId(articleId);

        $('html, body').animate({
            scrollTop: 800
        }, 1000);

    },
    loadListOfCommentsByAnnId = function(annTagId, consultationId, typeOfAnn) {
        if(typeOfAnn == "annotation") {
            window.CommentsByAnnIdComponent.getCommentsByAnnId(annTagId, consultationId);
            $('html, body').animate({
                scrollTop: 800
            }, 1000);
        } else if(typeOfAnn == "problem") {
            window.CommentsByProblemIdComponent.getCommentsByAnnId(annTagId, consultationId);
            $('html, body').animate({
                scrollTop: 800
            }, 1000);
        }
    },
    loadListOfCommentsByAnnIdPerArticle = function(annTagId, articleId, consultationId, typeOfAnn) {
        if(typeOfAnn == "annotation") {
            window.CommentsByAnnIdPerArticleComponent.getCommentsByAnnIdPerArticle(annTagId, articleId);
            $('html, body').animate({
                scrollTop: 800
            }, 1000);
        } else if(typeOfAnn == "problem") {
            window.CommentsByProblemIdPerArticleComponent.getCommentsByAnnIdPerArticle(annTagId, articleId);
            $('html, body').animate({
                scrollTop: 800
            }, 1000);
        }
    },
    loadArticleWordCloud = function(articleId, commentsNum) {
    window.ArticleWordCloudComponent.getArticleWordCloudFromServer(articleId, commentsNum);
},
    createChart = function(dataForChart, chartId, chartName, xName, yName, strName, numName, chartWidth, chartType, instance) {
        function drawMultSeries() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', strName);
            data.addColumn('number', numName);
            data.addColumn({type:'string', role:'tooltip','p': {'html': true}});
            if(chartType == "bar") {
                data.addColumn({type:'number', role:'scope'});
                data.addColumn({type:'number', role:'annotation','p': {'html': true}});
            }
            data.addColumn({type: 'number', role:'scope'});
            data.addRows(dataForChart);

            var numRows = dataForChart.length;
            var expectedHeight = numRows * 20;
            if(expectedHeight < 400) {
                expectedHeight = 600;
            }
            var chartHeight = expectedHeight - 80;
            var options = {
                tooltip: {isHtml: true},
                'displayAnnotations': true,
                'title': chartName,
                'height': expectedHeight,
                'width':'1000',
                'chartArea': {width: chartWidth,'height': chartHeight,left:'300'},
                'hAxis': {
                    title: xName,
                    minValue: 0
                },
                animation:{
                    duration: 3000,
                    easing: 'out',
                    startup: true
                },
                'is3D':true,
                'vAxis': {
                    title: yName
                },
                legend: {position: 'right',alignment:'start'},
                'fontSize' : 15
            };

            var chart;
            switch(chartType) {
                case 'bar':
                    chart = new google.visualization.BarChart(document.getElementById(chartId));
                    break;
                case 'pie':
                    chart = new google.visualization.PieChart(document.getElementById(chartId));
                    break;
                default:
                    break
            }
            chart.draw(data, options);
            // When a row is selected, the listener is triggered.
            google.visualization.events.addListener(chart, 'select', function() {
                switch (chartId) {
                    case "commentsPerArticleInnerChart":
                        var selection = chart.getSelection();
                        var articleId = dataForChart[selection[0].row][3];
                        var commentsNum = dataForChart[selection[0].row][4];
                        loadListOfCommentsPerArticle(articleId);
                        instance.articleId = articleId;
                        loadArticleWordCloud(instance.articleId, commentsNum);

                        //sets the selection to null again
                        chart.setSelection();
                        break;
                    case "annotationsForConsultationInnerChart":
                        var selection = chart.getSelection();
                        var annTagId = dataForChart[selection[0].row][3];
                        loadListOfCommentsByAnnId(annTagId, instance.consultationId, "annotation");
                        //sets the selection to null again
                        chart.setSelection();
                        break;
                    case "annotationProblemsForConsultationInnerChart":
                        var selection = chart.getSelection();
                        var annTagId = dataForChart[selection[0].row][3];
                        loadListOfCommentsByAnnId(annTagId, instance.consultationId, "problem");
                        //sets the selection to null again
                        chart.setSelection();
                        break;
                    case "annotationsPerArticleInnerChart":
                        var selection = chart.getSelection();
                        var articleId = dataForChart[selection[0].row][3];
                        var annTagId = dataForChart[selection[0].row][5];
                        loadListOfCommentsByAnnIdPerArticle(annTagId, articleId, instance.consultationId, "annotation");
                        //sets the selection to null again
                        chart.setSelection();
                        break;
                    case "annotationProblemsPerArticleInnerChart":
                        var selection = chart.getSelection();
                        var articleId = dataForChart[selection[0].row][3];
                        var annTagId = dataForChart[selection[0].row][5];
                        loadListOfCommentsByAnnIdPerArticle(annTagId, articleId, instance.consultationId, "problem");
                        //sets the selection to null again
                        chart.setSelection();
                        break;
                    default:
                        break;

                }
            });
        }
        google.setOnLoadCallback(drawMultSeries);
    },
    createUserBox = function (instance) {

        scify.userBoxes = {};
        $(".statsForUser").each(function(index,userDiv) {
            var userId = $(userDiv).data("id");
            var userObj = getUserById(userId);
            var userBoxProperties = {
                consultationid          : instance.consultationId,
                userId                  : userId,
                user                    : userObj,
                commentsCount : $(userDiv).data("count"),
                imagesPath : instance.imagesPath
            };
            var domElementToAddComponent = document.getElementById("box_" + userId);
            scify.userBoxes[userId] = React.render(React.createElement(scify.UserBox, userBoxProperties), domElementToAddComponent);
        });
    },
    attachTooltips = function () {
        $("#usersStatsTooltip").attr('title', 'Πατήστε επάνω σε ένα όνομα για να φορτώσετε τα σχόλια');
        $('#usersStatsTooltip').click(function () {
            $('#usersStatsTooltip').mouseover();
        });
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

        var consultationId = instance.consultationId;
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
            url: "/consultation/finalLawUpload/" + instance.consultationId + "/" + instance.userId,
            uploadMultiple: false,
            maxFiles: 1,
            acceptedFiles: "application/pdf,text/plain",
            dictDefaultMessage: "Σύρετε εδώ το αρχείο που θέλετε να ανεβάσετε, ή κάντε κλικ. (Αποδεκτοί τύποι αρχείων: .pdf, .txt) ",
            dictInvalidFileType: "Μη αποδεκτός τύπος αρχείου. Αποδεκτοί τύποι: .pdf, .txt \nΞανακάντε κλικ στο πλαίσιο για να ανεβάσετε άλλο αρχείο",
            accept: function(file, done) {
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
                    //console.log("success");
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
        //console.log(parameter);
        if(parameter == "finalLaw") {
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
            //console.log("wsadfrs");
            $(".modal-body .container .consultationText div").first().find(".show-hide").click();
            $(".modal-body .finalLawUploadedContent div").first().find(".show-hide").click();
            //$("#finalLawDiv").first().animate({scrollTop: $('.finalLawUploadedContent').offset().top + 80});
        });
    },
    deleteFinalLawHandler = function(instance) {

        $( "#deleteFinalLaw" ).click(function() {
            var answer = window.confirm("Είστε σίγουροι για τη διαγραφή;");
            if (answer == true) {
                //console.log("You pressed OK!");
                var finalLawId = instance.finalLawId;
                //console.log(finalLawId);
                $("#deleteLaw").append('<div class="loaderSmall">Loading...</div>');
                $.ajax({
                    type: 'GET',
                    url: "/consultation/finallaw/delete/" + finalLawId,
                    beforeSend: function () {
                    },
                    success: function (returnData) {
                        //console.log(returnData);
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
            }
        });
    },
    createCommentListParams = function(instance) {
        var userDefined = true;
        if(instance.userId==undefined || instance.userId=='' || instance.userId== null) {
            userDefined = false;
        }
        instance.commentListProperties = {
            userId : instance.userId,
            userDefined : userDefined,
            consultationEndDate:instance.consultationEndDate,
            imagesPath: instance.imagesPath,
            consultationId: instance.consultationId,
            appState: instance.appState,
            shouldDisplayCommenterName: true,
            shouldDisplayEditIcon: false,
            shouldDisplayCommentEdited: true,
            shouldDisplayShareBtn: true,
            shouldDisplayCommentBody: true,
            shouldDisplayEmotion: true,
            shouldDisplayAnnotatedText: true,
            shouldDisplayReplyBox:false,
            shouldDisplayReplies: true,
            optionsEnabled: true,
            shouldDisplayTopics: true,
            shouldDisplayFinalLawAnnBtn: true,
            commentClassNames:"comment"
        }
        instance.commentListOpenGovProperties = {
            userId : instance.userId,
            userDefined : userDefined,
            consultationEndDate:instance.consultationEndDate,
            imagesPath: instance.imagesPath,
            consultationId: instance.consultationId,
            appState: instance.appState,
            shouldDisplayCommenterName: true,
            shouldDisplayEditIcon: false,
            shouldDisplayCommentEdited: false,
            shouldDisplayShareBtn: false,
            shouldDisplayCommentBody: true,
            shouldDisplayEmotion: false,
            shouldDisplayAnnotatedText: false,
            shouldDisplayReplyBox:false,
            shouldDisplayReplies: false,
            optionsEnabled: true,
            shouldDisplayTopics: true,
            shouldDisplayFinalLawAnnBtn: false,
            commentClassNames:"comment"
        }
    },
    handleMatchCommentWithLaw = function(e,data){

        if (!this.commentWithLawMatcher)
        {
            this.commentWithLawMatcher = React.render(React.createElement(scify.commentLawMatcher, {
                comment:data.comment,
                imagesPath: this.imagesPath,
                finalLawId: parseInt(this.finalLawId),
                finalLawDiv: $("#finalLawDiv").html(),
                userId: this.userId
            }), document.getElementById("commentLawMatcher"));
        }
        this.commentWithLawMatcher.display(data);
    }
    init = function(){
        var instance= this;
        moment.locale('el');
        addRelevantLawsHandler();
        if(this.commentsPerArticle.length > 0) {
            createChart(this.commentsPerArticle, "commentsPerArticleInnerChart", "Σχόλια ανά άρθρο (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το άρθρο)", "Αριθμός σχολίων", "Άρθρα", "Άρθρο", "Σχόλια", '75%', 'bar', instance);
        }
        if(this.annotationsForConsultation.length > 0) {
            createChart(this.annotationsForConsultation, "annotationsForConsultationInnerChart", "Θέματα που θίγονται (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το θέμα)", "Αριθμός σχολίων", "Θέμα", "Θέμα", "Σχόλια", '75%', 'bar', instance);
        }
        if(this.annotationProblemsForConsultation.length > 0) {
            createChart(this.annotationProblemsForConsultation, "annotationProblemsForConsultationInnerChart", "Προβλήματα (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το πρόβλημα)", "Πρόβλημα", "Πρόβλημα", "Πρόβλημα", "Σχόλια", '75%', 'bar', instance);
        }
        if(this.annotationsPerArticle.length > 0) {
            createChart(this.annotationsPerArticle, "annotationsPerArticleInnerChart", "Θέματα ανά άρθρο (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το θέμα ανά άρθρο)", "Αριθμός σχολίων", "", "Θέμα", "Σχόλια", '75%', 'bar', instance);
        }
        if(this.annotationProblemsPerArticle.length > 0) {
            createChart(this.annotationProblemsPerArticle, "annotationProblemsPerArticleInnerChart", "Προβλήματα ανά άρθρο (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το πρόβλημα ανά άρθρο)", "Αριθμός σχολίων", "", "Πρόβλημα", "Σχόλια", '75%', 'bar', instance);
        }
        createUserBox(this);
        createCommentListParams(instance);
        createListOfCommentsPerArticle(instance);
        createListOfCommentsByAnnId(instance);
        createListOfCommentsByProblemId(instance);
        createListOfCommentsByAnnIdPerArticle(instance);
        createListOfCommentsByProblemIdPerArticle(instance);
        createArticleWordCloudChart(instance);
        attachTooltips();
        createFinalLawUpload(instance);
        deleteFinalLawHandler(instance);
        rateFinalLawFile(instance);
        getParameterPointToFinalLaw();
        expandArticleOnClick();
        finalLawModalHandler();

        $("body").on("match-comment-with-law",handleMatchCommentWithLaw.bind(instance));
        //FB tracking code for visiting reporter page
        fbq('track', 'ViewContent');
    };

    return {
        init:init
    }
}();
