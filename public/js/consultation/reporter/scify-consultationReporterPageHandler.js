scify.ConsultationReporterPageHandler = function( consultationid,userId,fullName,
                                                  commentsPerArticle,
                                                  annotationsForConsultation,
                                                  annotationProblemsForConsultation,
                                                  annotationsPerArticle,
                                                  annotationProblemsPerArticle, commenters,
                                                  consultationEndDate){
    this.consultationid= consultationid;
    this.userId = userId;
    this.fullName = fullName;

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
        this.commentsPerArticle.push([articleTitle, commentsPerArticle[i].commentsNum, '<div style="padding-left: 10px"><h5 style="width:100%">' + commentsPerArticle[i].title + '</h5>' + '<h5>Σχόλια: ' + commentsPerArticle[i].commentsNum + '</h5></div>', commentsPerArticle[i].id, commentsPerArticle[i].commentsNum, 0 ])
    }

    this.annotationsForConsultation = [];
    for (var i=0; i<annotationsForConsultation.length; i++)
    {
        this.annotationsForConsultation.push([annotationsForConsultation[i].annotationTag.description, annotationsForConsultation[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:100%">Θέμα: ' + annotationsForConsultation[i].annotationTag.description + '</h5>' + '<h5>Σχόλια: ' + annotationsForConsultation[i].numberOfComments + '</h5></div>', annotationsForConsultation[i].annotationTag.id, annotationsForConsultation[i].numberOfComments, 0 ])
    }

    this.annotationProblemsForConsultation = [];
    for (var i=0; i<annotationProblemsForConsultation.length; i++)
    {
        this.annotationProblemsForConsultation.push([ annotationProblemsForConsultation[i].annotationTag.description, annotationProblemsForConsultation[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:100%">Θέμα: ' + annotationProblemsForConsultation[i].annotationTag.description + '</h5>' + '<h5>Σχόλια: ' + annotationProblemsForConsultation[i].numberOfComments + '</h5></div>', annotationProblemsForConsultation[i].annotationTag.id,annotationProblemsForConsultation[i].numberOfComments, 0 ])
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
        this.annotationsPerArticle.push([articleTitle + ": " + annotationsPerArticle[i].annotationTag.description,  annotationsPerArticle[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:100%">' + annotationsPerArticle[i].article_name + '<div>Tag: ' + annotationsPerArticle[i].annotationTag.description + '</div></h5>' + '<h5>Σχόλια: ' + annotationsPerArticle[i].numberOfComments + '</h5></div>', annotationsPerArticle[i].article_id, annotationsPerArticle[i].numberOfComments, annotationsPerArticle[i].annotationTag.id ])
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
        this.annotationProblemsPerArticle.push([articleTitle + ": " + annotationProblemsPerArticle[i].annotationTag.description,  annotationProblemsPerArticle[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:100%">' + annotationProblemsPerArticle[i].article_name + '<div>Tag: ' + annotationProblemsPerArticle[i].annotationTag.description + '</div></h5>' + '<h5>Σχόλια: ' + annotationProblemsPerArticle[i].numberOfComments + '</h5></div>', annotationProblemsPerArticle[i].article_id,annotationProblemsPerArticle[i].numberOfComments, annotationProblemsPerArticle[i].annotationTag.id ])
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
        },

        loadListOfCommentsPerArticle = function(articleId) {
            $(".commentsTabs").css("display","block");
            window.OpenGovommentsPerArticleComponent.getOpenGovCommentsByArticleId(articleId);
            window.DITGovommentsPerArticleComponent.getDITCommentsByArticleId(articleId);

            $('html, body').animate({
                scrollTop: $("#commentsOpenGov").offset().top -100
            }, 1000);
        },

        loadListOfCommentsByAnnId = function(annTagId, consultationId, typeOfAnn) {
            if(typeOfAnn == "annotation") {
                window.CommentsByAnnIdComponent.getCommentsByAnnId(annTagId, consultationId);
                $('html, body').animate({
                    scrollTop: $("#commentsPerAnnId").offset().top -100
                }, 1000);
            } else if(typeOfAnn == "problem") {
                window.CommentsByProblemIdComponent.getCommentsByAnnId(annTagId, consultationId);
                $('html, body').animate({
                    scrollTop: $("#commentsPerProblemId").offset().top -100
                }, 1000);
            }
        },
        loadListOfCommentsByAnnIdPerArticle = function(annTagId, articleId, consultationId, typeOfAnn) {
            if(typeOfAnn == "annotation") {
                window.CommentsByAnnIdPerArticleComponent.getCommentsByAnnIdPerArticle(annTagId, articleId);
                $('html, body').animate({
                    scrollTop: $("#commentsPerAnnIdPerArticle").offset().top -100
                }, 1000);
            } else if(typeOfAnn == "problem") {
                window.CommentsByProblemIdPerArticleComponent.getCommentsByAnnIdPerArticle(annTagId, articleId);
                $('html, body').animate({
                    scrollTop: $("#commentsPerProblemIdPerArticle").offset().top -100
                }, 1000);
            }
        },

        createListOfCommentsPerArticle = function(){
            var domElementOpenGovComments = document.getElementById("commentsOpenGov");
            var domElementDITComments = document.getElementById("commentsDIT");
            window.OpenGovommentsPerArticleComponent = React.render(React.createElement(scify.commentList, null), domElementOpenGovComments);
            window.DITGovommentsPerArticleComponent = React.render(React.createElement(scify.commentList, null), domElementDITComments);
        },
        createListOfCommentsByAnnId = function() {
            var domElementCommentsByAnnId = document.getElementById("commentsPerAnnId");
            window.CommentsByAnnIdComponent = React.render(React.createElement(scify.commentList, null), domElementCommentsByAnnId);
        },

        createListOfCommentsByProblemId = function() {
            var domElementCommentsByProblemId = document.getElementById("commentsPerProblemId");
            window.CommentsByProblemIdComponent = React.render(React.createElement(scify.commentList, null), domElementCommentsByProblemId);
        },
        createListOfCommentsByAnnIdPerArticle = function() {
            var domElementCommentsByAnnIdPerArticle = document.getElementById("commentsPerAnnIdPerArticle");
            window.CommentsByAnnIdPerArticleComponent = React.render(React.createElement(scify.commentList, null), domElementCommentsByAnnIdPerArticle);
        },
        createListOfCommentsByProblemIdPerArticle = function() {
            var domElementCommentsByProblemIdPerArticle = document.getElementById("commentsPerProblemIdPerArticle");
            window.CommentsByProblemIdPerArticleComponent = React.render(React.createElement(scify.commentList, null), domElementCommentsByProblemIdPerArticle);
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
                var expectedHeight = numRows * 30;
                if(expectedHeight < 400) {
                    expectedHeight = 600;
                }
                var options = {
                    tooltip: {isHtml: true},
                    'displayAnnotations': true,
                    'title': chartName,
                    'height': expectedHeight,
                    'width':'1000',
                    'chartArea': {width: chartWidth,'height': '400',left:'300'},
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
                            loadListOfCommentsPerArticle(articleId);
                            //sets the selection to null again
                            chart.setSelection();
                            break;
                        case "annotationsForConsultationInnerChart":
                            var selection = chart.getSelection();
                            var annTagId = dataForChart[selection[0].row][3];
                            loadListOfCommentsByAnnId(annTagId, instance.consultationid, "annotation");
                            //sets the selection to null again
                            chart.setSelection();
                            break;
                        case "annotationProblemsForConsultationInnerChart":
                            var selection = chart.getSelection();
                            var annTagId = dataForChart[selection[0].row][3];
                            loadListOfCommentsByAnnId(annTagId, instance.consultationid, "problem");
                            //sets the selection to null again
                            chart.setSelection();
                            break;
                        case "annotationsPerArticleInnerChart":
                            var selection = chart.getSelection();
                            var articleId = dataForChart[selection[0].row][3];
                            var annTagId = dataForChart[selection[0].row][5];
                            loadListOfCommentsByAnnIdPerArticle(annTagId, articleId, instance.consultationid, "annotation");
                            //sets the selection to null again
                            chart.setSelection();
                            break;
                        case "annotationProblemsPerArticleInnerChart":
                            var selection = chart.getSelection();
                            var articleId = dataForChart[selection[0].row][3];
                            var annTagId = dataForChart[selection[0].row][5];
                            loadListOfCommentsByAnnIdPerArticle(annTagId, articleId, instance.consultationid, "problem");
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
                    consultationid          : instance.consultationid,
                    userId                  : userId,
                    user                    : userObj,
                    commentsCount : $(userDiv).data("count")
                };
                var domElementToAddComponent = document.getElementById("box_" + userId);
                scify.userBoxes[userId] = React.render(React.createElement(scify.UserBox, userBoxProperties), domElementToAddComponent);
            });
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
            createChart(this.annotationProblemsForConsultation, "annotationProblemsForConsultationInnerChart", "Προβλήματα (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το πρόβλημα)", "Πρόβηλμα", "Πρόβλημα", "Πρόβλημα", "Σχόλια", '75%', 'bar', instance);
        }
        if(this.annotationsPerArticle.length > 0) {
            createChart(this.annotationsPerArticle, "annotationsPerArticleInnerChart", "Θέματα ανά άρθρο (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το θέμα ανά άρθρο)", "Αριθμός σχολίων", "", "Θέμα", "Σχόλια", '75%', 'bar', instance);
        }
        if(this.annotationProblemsPerArticle.length > 0) {
            createChart(this.annotationProblemsPerArticle, "annotationProblemsPerArticleInnerChart", "Προβλήματα ανά άρθρο (πατήστε πάνω σε μια μπάρα για να δείτε τα σχόλια για το πρόβλημα ανά άρθρο)", "Αριθμός σχολίων", "", "Πρόβλημα", "Σχόλια", '75%', 'bar', instance);
        }
        createUserBox(this);
        createListOfCommentsPerArticle();
        createListOfCommentsByAnnId();
        createListOfCommentsByProblemId();
        createListOfCommentsByAnnIdPerArticle();
        createListOfCommentsByProblemIdPerArticle();
    };

    return {
        init:init
    }
}();
