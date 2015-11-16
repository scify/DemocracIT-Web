
scify.EvaluatorPageHandler = function(consultationsPerMonth) {

    console.log(consultationsPerMonth);
    this.consultationsPerMonth = [];
    for (var i=0; i<consultationsPerMonth.length; i++)
    {
        this.consultationsPerMonth.push([ consultationsPerMonth[i].date, consultationsPerMonth[i].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:100%">' + consultationsPerMonth[i].date + '</h5>' + '<h5>Διαβουλέυσεις: ' + consultationsPerMonth[i].numberOfConsultations + '</h5></div>'])
    }
};
scify.EvaluatorPageHandler.prototype = function(){
    createChart = function(dataForChart, chartId, chartName, xName, yName, strName, numName, chartWidth, chartType, instance) {
        function drawMultSeries() {
            var data = new google.visualization.DataTable();
            console.log(dataForChart);
            data.addColumn('string', strName);
            data.addColumn('number', numName);
            data.addColumn({type:'string', role:'tooltip','p': {'html': true}});
            data.addRows(dataForChart);
            var numRows = dataForChart.length;
            var expectedHeight = numRows * 30;
            if(expectedHeight < 400) {
                expectedHeight = 600;
            }
            var chartHeight = expectedHeight - 80;
            var options = {
                tooltip: {isHtml: true},
                'displayAnnotations': true,
                'title': chartName,
                'height': expectedHeight,
                'width':'1800',
                'chartArea': {width: chartWidth,'height': chartHeight,left:'100'},
                'hAxis': {
                    title: yName,
                    textStyle: {
                        fontSize: 12,
                        color: '#053061',
                        bold: false,
                        italic: false
                    }

                },
                animation:{
                    duration: 2000,
                    easing: 'out',
                    startup: true
                },
                'is3D':true,
                'vAxis': {
                    title: xName
                },
                legend: {position: 'right',alignment:'start'},
                'fontSize' : 15
            };

            var chart;
            switch(chartType) {
                case 'bar':
                    chart = new google.visualization.ColumnChart(document.getElementById(chartId));
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
    }
    var init = function() {
        var instance = this;
        if(this.consultationsPerMonth.length > 0) {
            createChart(this.consultationsPerMonth, "consultationsPerMonthInnerChart", "Διασπορά διαβουλέυεσων ανά μήνα (πατήστε πάνω σε μια μπάρα για να δείτε τις διαβουλέυεις)", "Αριθμός διαβουλεύσεων", "Μήνες", "Διαβούλευση", "Σχόλια", '75%', 'bar', instance);
        }

    }
    return {
        init:init
    }
}();