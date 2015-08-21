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
    //this.commentsPerArticle.push(['Article', 'Comments', { role: 'annotation' }]);
    for (var i=0; i<commentsPerArticle.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.commentsPerArticle.push([commentsPerArticle[i].title.substr(0, commentsPerArticle[i].title.indexOf(':')), commentsPerArticle[i].commentsNum, commentsPerArticle[i].title ])
    }

    this.annotationsForConsultation = [];
    for (var i=0; i<annotationsForConsultation.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationsForConsultation.push([annotationsForConsultation[i].annotationTag.description, annotationsForConsultation[i].numberOfComments, annotationsForConsultation[i].annotationTag.description ])
    }

    this.annotationProblemsForConsultation = [];
    for (var i=0; i<annotationProblemsForConsultation.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationProblemsForConsultation.push([ annotationProblemsForConsultation[i].annotationTag.description, annotationProblemsForConsultation[i].numberOfComments, annotationProblemsForConsultation[i].annotationTag.description ])
    }

    this.annotationsPerArticle = [];
    for (var i=0; i<annotationsPerArticle.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationsPerArticle.push([annotationsPerArticle[i].article_name.substr(0, annotationsPerArticle[i].article_name.indexOf(':')) + ": " + annotationsPerArticle[i].annotationTag.description,  annotationsPerArticle[i].numberOfComments, annotationsPerArticle[i].article_name + annotationsPerArticle[i].annotationTag.description ])
    }

    this.annotationProblemsPerArticle = [];
    for (var i=0; i<annotationProblemsPerArticle.length; i++) //create a map for quick access with id: The discussion thread client id and value: a object with info.
    {
        this.annotationProblemsPerArticle.push([annotationProblemsPerArticle[i].article_name.substr(0, annotationProblemsPerArticle[i].article_name.indexOf(':')) + ": " + annotationProblemsPerArticle[i].annotationTag.description,  annotationProblemsPerArticle[i].numberOfComments, annotationProblemsPerArticle[i].article_name + annotationProblemsPerArticle[i].annotationTag.description ])
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

    var width = document.getElementById("statsDiv").offsetWidth;

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

        createChart = function(dataForChart, chartId, chartName, xName, yName, strName, numName, chartWidth, chartType) {
            /*var data = dataForChart;
            var linearColorScale = d3.scale.linear()
                .domain([0, data.length])
                .range(["#A2C0DA", "#2A4E6C"])
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.num})])
                .range([0, width])
            var y = d3.scale.linear()
                .domain([0, data[data.length -1]])
                .range([0, 450]);
            d3.select("." + chartClass)
                .selectAll("div")
                .data(data)
                .enter()
                .append("div")
                .style("width", function(d) { return x(d.num)  + "px"; })
                .style("background-color", function(d,i) { return linearColorScale(i)})
                    .text(function(d) { return d.title.substr(0, d.title.indexOf(':')) + ' | ' + d.num + ' σχόλια'; });*/
            console.log(dataForChart);
            function drawMultSeries() {
                //var data  = new google.visualization.arrayToDataTable(dataForChart, true);
                var data = new google.visualization.DataTable();

                data.addColumn('string', strName);
                data.addColumn('number', numName);
                data.addColumn({type:'string', role:'annotationText'});
                data.addRows(dataForChart);
                var numRows = dataForChart.length;
                var expectedHeight = numRows * 30;
                if(expectedHeight < 250) {
                    expectedHeight = 450;
                }
                console.log(expectedHeight);
                var options = {
                    'displayAnnotations': true,
                    'title': chartName,
                    'height': expectedHeight,
                    'chartArea': {width: chartWidth,'height': '450' },
                    'hAxis': {
                        title: xName,
                        minValue: 0
                    },
                    'is3D':true,
                    'vAxis': {
                        title: yName
                    },
                    legend: {position: 'left',alignment:'start'},
                    'chartArea.left': '300',
                    'fontSize' : 15
                };

                switch(chartType) {
                    case 'bar':
                        var chart = new google.visualization.BarChart(document.getElementById(chartId));
                        break;
                    case 'pie':
                        var chart = new google.visualization.PieChart(document.getElementById(chartId));
                        break;
                    default:
                        break
                }

                chart.draw(data, options);
            }

            google.setOnLoadCallback(drawMultSeries);

        },

        createAnnotationTagsForConsultationChart = function(annotationsForConsultation, chartClass) {
            var data = annotationsForConsultation;
            var linearColorScale = d3.scale.linear()
                .domain([0, data.length])
                .range(["#A2C0DA", "#2A4E6C"])
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.num})])
                .range([0, width])
            var y = d3.scale.linear()
                .domain([0, data[data.length -1]])
                .range([0, 450]);
            d3.select("." + chartClass)
                .selectAll("div")
                .data(data)
                .enter()
                    .append("div")
                    .style("width", function(d) { return x(d.num)  + "px"; })
                    .style("background-color", function(d,i) { return linearColorScale(i)})
                    .text(function(d) { return d.annotation.description + ' | ' + d.num + ' σχόλια'; });
        },
        createAnnotationsPerArticleChart = function(annotationsPerArticle, chartClass) {
            var data = annotationsPerArticle;
            var linearColorScale = d3.scale.linear()
                .domain([0, data.length])
                .range(["#A2C0DA", "#2A4E6C"])
            var x = d3.scale.linear()
                .domain([0, d3.max(data, function(d) { return d.num})])
                .range([0, width])
            var y = d3.scale.linear()
                .domain([0, data[data.length -1]])
                .range([0, 450]);
            d3.select("." + chartClass)
                .selectAll("div")
                .data(data)
                .enter()
                .append("div")
                    .style("width", function(d) { return x(d.num)  + "px"; })
                    .style("background-color", function(d,i) { return linearColorScale(i)})
                    .text(function(d) { return d.annotation.description + ' | ' + d.title.substr(0, d.title.indexOf(':')) + ' | ' + d.num + ' σχόλια'; });
        }

    init = function(){
        var instance= this;
        moment.locale('el');
        addRelevantLawsHandler();
        createChart(this.commentsPerArticle, "commentsPerArticleChart", "Σχόλια ανά άρθρο", "Αριθμός σχολίων", "Άρθρα", "Άρθρο", "Σχόλια", '75%', 'bar');
        createChart(this.annotationsForConsultation, "annotationsForConsultationChart", "Σχόλια ανά Tag Αναφοράς", "Αριθμός σχολίων", "Tag", "Tag Αναφοράς", "Σχόλια", '90%', 'pie');
        createChart(this.annotationProblemsForConsultation, "annotationProblemsForConsultationChart", "Σχόλια ανά Tag Προβλήματος", "Αριθμός σχολίων", "Tag", "Tag Προβλήματος", "Σχόλια", '90%', 'pie');
        createChart(this.annotationsPerArticle, "annotationsPerArticleChart", "Tag Αναφοράς ανά άρθρο", "Αριθμός σχολίων", "Tag", "Tag Αναφοράς", "Σχόλια", '90%', 'pie');
        createChart(this.annotationProblemsPerArticle, "annotationProblemsPerArticleChart", "Tag Προβλήματος ανά άρθρο", "Αριθμός σχολίων", "Tag", "Tag Προβλήματος", "Σχόλια", '90%', 'pie');

    };

    return {
        init:init
    }
}();
