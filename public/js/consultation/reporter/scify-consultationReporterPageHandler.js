scify.ConsultationReporterPageHandler = function( consultationid,userId,fullName,
                                                  commentsPerArticle,
                                                  annotationsForConsultation,
                                                  annotationProblemsForConsultation,
                                                  annotationsPerArticle,
                                                  annotationProblemsPerArticle,
                                                  consultationEndDate){
    this.consultationid= consultationid;
    this.userId = userId;
    this.fullName = fullName;

    this.consultationEndDate = consultationEndDate;

    this.commentsPerArticle =[];
    for (var i=0; i<commentsPerArticle.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.commentsPerArticle.push({ title: commentsPerArticle[i].title, num:commentsPerArticle[i].commentsNum })
    }

    this.annotationsForConsultation = [];
    for (var i=0; i<annotationsForConsultation.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationsForConsultation.push({ annotation: annotationsForConsultation[i].annotationTag, num:annotationsForConsultation[i].numberOfComments })
    }

    this.annotationProblemsForConsultation = [];
    for (var i=0; i<annotationProblemsForConsultation.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationProblemsForConsultation.push({ annotation: annotationProblemsForConsultation[i].annotationTag, num:annotationProblemsForConsultation[i].numberOfComments })
    }

    this.annotationsPerArticle = [];
    for (var i=0; i<annotationsPerArticle.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationsPerArticle.push({ annotation: annotationsPerArticle[i].annotationTag, title:annotationsPerArticle[i].article_name,  num:annotationsPerArticle[i].numberOfComments })
    }

    this.annotationProblemsPerArticle = [];
    for (var i=0; i<annotationProblemsPerArticle.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationProblemsPerArticle.push({ annotation: annotationProblemsPerArticle[i].annotationTag, title:annotationProblemsPerArticle[i].article_name,  num:annotationProblemsPerArticle[i].numberOfComments })
    }

    this.commentsPerArticle.sort(function(a,b) {
        return a.num - b.num;
    });

    this.annotationsForConsultation.sort(function(a,b) {
        return a.num - b.num;
    });

    this.annotationProblemsForConsultation.sort(function(a,b) {
        return a.num - b.num;
    });

    this.annotationsPerArticle.sort(function(a,b) {
        return a.num - b.num;
    });

    this.annotationProblemsPerArticle.sort(function(a,b) {
        return a.num - b.num;
    });


};

scify.ConsultationReporterPageHandler.prototype = function(){

    var addRelevantLawsHandler = function(){
            $(".relevantLawsBtn").on("click", function(){
                console.log($(this).context.id);
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
        createCommentsPerArticleChart = function(commentsPerArticle) {
            //console.log(commentsPerArticle);
            var data = [{key:1, value:10}, {key:2, value:20}, {key:3, value: 30}];
            //console.log(data);
            d3.select(".commentsPerArticleChart")
                .selectAll("div")
                .data(commentsPerArticle)
                .enter().append("div")
                .style("width", function(d) { return d.num * 100 + "px"; })
                .text(function(d) { return d.title.substr(0, d.title.indexOf(':')) + ' | ' + d.num + ' σχόλια'; });
        },

        createAnnotationTagsForConsultationChart = function(annotationsForConsultation) {
            d3.select(".annotationsForConsultationChart")
                .selectAll("div")
                .data(annotationsForConsultation)
                .enter().append("div")
                .style("width", function(d) { return d.num * 100 + "px"; })
                .text(function(d) { return d.annotation.description + ' | ' + d.num + ' σχόλια'; });
        },
        createAnnotationTagsProblemsForConsultationChart = function(annotationProblemsForConsultation) {
            d3.select(".annotationProblemsForConsultationChart")
                .selectAll("div")
                .data(annotationProblemsForConsultation)
                .enter().append("div")
                .style("width", function(d) { return d.num * 100 + "px"; })
                .text(function(d) { return d.annotation.description + ' | ' + d.num + ' σχόλια'; });
        },
        createAnnotationsPerArticleChart = function(annotationsPerArticle) {
            console.log(annotationsPerArticle);
            d3.select(".annotationsPerArticleChart")
                .selectAll("div")
                .data(annotationsPerArticle)
                .enter().append("div")
                .style("width", function(d) { return d.num * 100 + "px"; })
                .text(function(d) { return d.annotation.description + ' | ' + d.title.substr(0, d.title.indexOf(':')) + ' | ' + d.num + ' σχόλια'; });
        },
        createAnnotationProblemsPerArticleChart = function(annotationProblemsPerArticle) {
            console.log(annotationProblemsPerArticle);
            d3.select(".annotationProblemsPerArticleChart")
                .selectAll("div")
                .data(annotationProblemsPerArticle)
                .enter().append("div")
                .style("width", function(d) { return d.num * 100 + "px"; })
                .text(function(d) { return d.annotation.description + ' | ' + d.title.substr(0, d.title.indexOf(':')) + ' | ' + d.num + ' σχόλια'; });
        }

    init = function(){
        var instance= this;
        moment.locale('el');
        addRelevantLawsHandler();
        createCommentsPerArticleChart(this.commentsPerArticle);
        createAnnotationTagsForConsultationChart(this.annotationsForConsultation);
        createAnnotationTagsProblemsForConsultationChart(this.annotationProblemsForConsultation);
        createAnnotationsPerArticleChart(this.annotationsPerArticle);
        createAnnotationProblemsPerArticleChart(this.annotationProblemsPerArticle);
    };

    return {
        init:init
    }
}();
