'use strict';

scify.ConsultationReporterPageHandler = function (consultationid, userId, fullName, commentsPerArticle, annotationsForConsultation, annotationProblemsForConsultation, annotationsPerArticle, annotationProblemsPerArticle, commenters, consultationEndDate) {
    this.consultationid = consultationid;
    this.userId = userId;
    this.fullName = fullName;

    this.consultationEndDate = consultationEndDate;

    this.commentsPerArticle = [];
    for (var i = 0; i < commentsPerArticle.length; i++) {
        this.commentsPerArticle.push([commentsPerArticle[i].title.substr(0, commentsPerArticle[i].title.indexOf(':')), commentsPerArticle[i].commentsNum, '<div style="padding-left: 10px"><h5 style="width:100%">' + commentsPerArticle[i].title + '</h5>' + '<h5>Σχόλια: ' + commentsPerArticle[i].commentsNum + '</h5></div>']);
    }

    this.annotationsForConsultation = [];
    for (var i = 0; i < annotationsForConsultation.length; i++) {
        this.annotationsForConsultation.push([annotationsForConsultation[i].annotationTag.description, annotationsForConsultation[i].numberOfComments, annotationsForConsultation[i].annotationTag.description]);
    }

    this.annotationProblemsForConsultation = [];
    for (var i = 0; i < annotationProblemsForConsultation.length; i++) {
        this.annotationProblemsForConsultation.push([annotationProblemsForConsultation[i].annotationTag.description, annotationProblemsForConsultation[i].numberOfComments, annotationProblemsForConsultation[i].annotationTag.description]);
    }

    this.annotationsPerArticle = [];
    for (var i = 0; i < annotationsPerArticle.length; i++) {
        this.annotationsPerArticle.push([annotationsPerArticle[i].article_name.substr(0, annotationsPerArticle[i].article_name.indexOf(':')) + ': ' + annotationsPerArticle[i].annotationTag.description, annotationsPerArticle[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:100%">' + annotationsPerArticle[i].article_name + '<div>Tag: ' + annotationsPerArticle[i].annotationTag.description + '</div></h5>' + '<h5>Σχόλια: ' + annotationsPerArticle[i].numberOfComments + '</h5></div>']);
    }

    this.annotationProblemsPerArticle = [];
    for (var i = 0; i < annotationProblemsPerArticle.length; i++) {
        this.annotationProblemsPerArticle.push([annotationProblemsPerArticle[i].article_name.substr(0, annotationProblemsPerArticle[i].article_name.indexOf(':')) + ': ' + annotationProblemsPerArticle[i].annotationTag.description, annotationProblemsPerArticle[i].numberOfComments, '<div style="padding-left: 10px"><h5 style="width:100%">' + annotationProblemsPerArticle[i].article_name + '<div>Tag: ' + annotationProblemsPerArticle[i].annotationTag.description + '</div></h5>' + '<h5>Σχόλια: ' + annotationProblemsPerArticle[i].numberOfComments + '</h5></div>']);
    }

    console.log(commenters);

    getUserById = function (userId) {
        for (var i = 0; i < commenters.length; i++) {
            if (userId == commenters[i].user_id) {
                return commenters[i];
            }
        }
    };
};

scify.ConsultationReporterPageHandler.prototype = (function () {

    var addRelevantLawsHandler = function addRelevantLawsHandler() {
        $('.relevantLawsBtn').on('click', function () {
            console.log($(this).context.id);
            $('.relevantLaw #' + $(this).context.id + ' .relevantLawsBtn').toggleClass('clicked');
            if ($('.relevantLaw #' + $(this).context.id + ' .relevantLawsBtn').hasClass('clicked')) {
                $('.relevantLaw #' + $(this).context.id + ' i').removeClass('fa-chevron-down');
                $('.relevantLaw #' + $(this).context.id + ' i').addClass('fa-chevron-up');
                $('.relevantLaw #' + $(this).context.id + ' .childLaws').show('slow');
            } else {
                $('.relevantLaw #' + $(this).context.id + ' i').removeClass('fa-chevron-up');
                $('.relevantLaw #' + $(this).context.id + ' i').addClass('fa-chevron-down');
                $('.relevantLaw #' + $(this).context.id + ' .childLaws').hide('fast');
            }
        });
    },
        createChart = function createChart(dataForChart, chartId, chartName, xName, yName, strName, numName, chartWidth, chartType) {
        function drawMultSeries() {
            var data = new google.visualization.DataTable();

            data.addColumn('string', strName);
            data.addColumn('number', numName);
            data.addColumn({ type: 'string', role: 'tooltip', 'p': { 'html': true } });
            data.addRows(dataForChart);
            var numRows = dataForChart.length;
            var expectedHeight = numRows * 30;
            if (expectedHeight < 400) {
                expectedHeight = 600;
            }
            var options = {
                tooltip: { isHtml: true },
                'displayAnnotations': true,
                'title': chartName,
                'height': expectedHeight,
                'width': '1000',
                'chartArea': { width: chartWidth, 'height': '400', left: '300' },
                'hAxis': {
                    title: xName,
                    minValue: 0
                },
                'is3D': true,
                'vAxis': {
                    title: yName
                },
                legend: { position: 'right', alignment: 'start' },
                'fontSize': 15
            };

            switch (chartType) {
                case 'bar':
                    var chart = new google.visualization.BarChart(document.getElementById(chartId));
                    break;
                case 'pie':
                    var chart = new google.visualization.PieChart(document.getElementById(chartId));
                    break;
                default:
                    break;
            }

            chart.draw(data, options);
        }

        google.setOnLoadCallback(drawMultSeries);
    },

    /*createChartD3 = function(annotationsForConsultation, chartClass) {
        var width = document.getElementById("statsDiv").offsetWidth;
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
    },*/

    createUserBox = function createUserBox(instance) {

        scify.userBoxes = {};
        $('.statsForUser').each(function (index, userDiv) {
            var userId = $(userDiv).data('id');
            var userObj = getUserById(userId);
            var userBoxProperties = {
                consultationid: instance.consultationid,
                userId: userId,
                user: userObj
            };
            var domElementToAddComponent = document.getElementById('box_' + userId);
            scify.userBoxes[userId] = React.render(React.createElement(scify.UserBox, userBoxProperties), domElementToAddComponent);
        });
    };

    init = function () {
        var instance = this;
        moment.locale('el');
        addRelevantLawsHandler();
        createChart(this.commentsPerArticle, 'commentsPerArticleChart', 'Σχόλια ανά άρθρο', 'Αριθμός σχολίων', 'Άρθρα', 'Άρθρο', 'Σχόλια', '75%', 'bar');
        createChart(this.annotationsForConsultation, 'annotationsForConsultationChart', 'Σχόλια ανά Tag Αναφοράς', 'Αριθμός σχολίων', 'Tag', 'Tag Αναφοράς', 'Σχόλια', '90%', 'pie');
        createChart(this.annotationProblemsForConsultation, 'annotationProblemsForConsultationChart', 'Σχόλια ανά Tag Προβλήματος', 'Αριθμός σχολίων', 'Tag', 'Tag Προβλήματος', 'Σχόλια', '90%', 'pie');
        createChart(this.annotationsPerArticle, 'annotationsPerArticleChart', 'Tag Αναφοράς ανά άρθρο', 'Αριθμός σχολίων', '', 'Tag Αναφοράς', 'Σχόλια', '75%', 'bar');
        createChart(this.annotationProblemsPerArticle, 'annotationProblemsPerArticleChart', 'Tag Προβλήματος ανά άρθρο', 'Αριθμός σχολίων', '', 'Tag Προβλήματος', 'Σχόλια', '75%', 'bar');
        createUserBox(this);
    };

    return {
        init: init
    };
})();

//# sourceMappingURL=scify-consultationReporterPageHandler-compiled.js.map