scify.ConsultationReporterPageHandler = function( consultationid,userId,fullName,commentsPerArticle,
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
            console.log(commentsPerArticle);
            var data = [{key:1, value:10}, {key:2, value:20}, {key:3, value: 30}];
            console.log(data);
            d3.select(".chart")
                .selectAll("div")
                .data(commentsPerArticle)
                .enter().append("div")
                .style("width", function(d) { console.log(d);return d.num * 100 + "px"; })
                .text(function(d) { return d.title.substr(0, d.title.indexOf(':')) + ' | ' + d.num + ' σχόλια'; });
        }
    init = function(){
        var instance= this;
        moment.locale('el');
        addRelevantLawsHandler();
        createCommentsPerArticleChart(this.commentsPerArticle);
    };

    return {
        init:init
    }
}();
