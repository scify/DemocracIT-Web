
scify.EvaluatorPageHandler = function(consultationsPerMonth, evaluationMessages) {

    this.consultationsPerMonth = [];
    this.evaluationMessages = evaluationMessages;
    for (var i=0; i<consultationsPerMonth.length; i++)
    {
        this.consultationsPerMonth.push([ consultationsPerMonth[i].date, consultationsPerMonth[i].numberOfConsultations,
            '<div style="padding-left: 10px"><h5 style="width:150px">' + consultationsPerMonth[i].date + '</h5>' +
            '<h5>' + this.evaluationMessages.consultations + ': ' + consultationsPerMonth[i].numberOfConsultations +
            '</h5></div>', consultationsPerMonth[i].numberOfConsultations.toString(),consultationsPerMonth[i].cons_ids])
    }
    this.evaluationChartProperties = {
        evaluationMessages: evaluationMessages
    };
};
scify.EvaluatorPageHandler.prototype = function(){
    var createChart = function(dataForChart, chartOptions, chartId, strName, numName, chartType, instance) {
        //console.log(dataForChart);
        function drawMultSeries() {
            var data = new google.visualization.DataTable();
            //console.log(dataForChart);
            data.addColumn('string', strName);
            data.addColumn('number', numName);
            data.addColumn({type:'string', role:'tooltip','p': {'html': true}});
            data.addColumn({type:'string', role:'annotation'});
            data.addColumn({type:'string', role:'scope'});
            data.addRows(dataForChart);

            var options = chartOptions;

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
            $("#" + chartId).css("display", "none");
            var showChart = function() {
                $("#" + chartId).css("display", "block");
                $("#firstChartLoader").css("display","none");
            };
            google.visualization.events.addListener(chart, 'animationfinish', showChart);
            chart.draw(data, options);
            // When a row is selected, the listener is triggered.
            google.visualization.events.addListener(chart, 'select', function() {
                /*Remove current list*/
                $("#consList").remove();
                var selection = chart.getSelection();
                var cons_ids = dataForChart[selection[0].row][4];
                /*Create new element for the list*/
                $("#" + chartId).after('<div id="consList"></div>');
                var domElementConsList = document.getElementById("consList");
                window.ConsListComponent = React.render(React.createElement(scify.consultationForChart, instance.evaluationChartProperties), domElementConsList);
                window.ConsListComponent.getConsultationsFromServer(cons_ids);
                chart.setSelection();
                /*switch (chartId) {
                    case "consultationsPerMonthInnerChart":
                        $("#consList").remove();
                        var selection = chart.getSelection();
                        var cons_ids = dataForChart[selection[0].row][3];
                        $("#" + chartId).after('<div id="consList"></div>');
                        var domElementConsList = document.getElementById("consList");
                        window.ConsListComponent = React.render(React.createElement(scify.consultationForChart, null), domElementConsList);
                        window.ConsListComponent.getConsultationsFromServer(cons_ids);
                        chart.setSelection();
                        break;
                    default:
                        break;
                }*/
            });
        }
        google.setOnLoadCallback(drawMultSeries);
    },
    createConsFrequencyPerOrganizationDiv = function(instance) {
        var domElementConsFreqPerOrganization = document.getElementById("consultationsPerOrganizationInnerDiv");
        if (domElementConsFreqPerOrganization) {
            //console.log('this record already exists');
            window.ConsFreqPerOrganizationComponent = React.render(React.createElement(scify.evaluatorChart, instance.evaluationChartProperties), domElementConsFreqPerOrganization);
        } else {
            //console.log('this record does not exist');
        }
        loadConsFrequencyPerOrganization();
    },
    createConsDurationPerOrganizationDiv = function(instance) {
        var domElementConsDurationPerOrganization = document.getElementById("consDurationPerOrganizationInnerChart");
        if (domElementConsDurationPerOrganization) {
            //console.log('this record already exists');
            window.ConsDurationPerOrganizationComponent = React.render(React.createElement(scify.evaluatorChart, instance.evaluationChartProperties), domElementConsDurationPerOrganization);
        } else {
            //console.log('this record does not exist');
        }
        loadConsDurationPerOrganization();
    },
    createConsDurationDiv = function(instance) {
        var domElementConsDuration = document.getElementById("consDurationInnerChart");
        if (domElementConsDuration) {
            window.ConsDurationComponent = React.render(React.createElement(scify.evaluatorChart, instance.evaluationChartProperties), domElementConsDuration);
        } else {
            //console.log('this record does not exist');
        }
        loadConsDuration();
    },

    createConsCommPerOrganizationDiv = function(instance) {
        var domElementConsCommPerOrganization = document.getElementById("commConsOrgInnerChart");
        if (domElementConsCommPerOrganization) {
            window.ConsCommPerOrganizationComponent = React.render(React.createElement(scify.evaluatorChart, instance.evaluationChartProperties), domElementConsCommPerOrganization);
        } else {
            //console.log('this record does not exist');
        }
        loadConsCommPerOrganization();
    },
    createConsFinalLawStatsDiv = function(instance) {
        var domElementConsFinalLawStats = document.getElementById("finalLawComparisonChart");
        if (domElementConsFinalLawStats) {
            window.ConsFinalLawStatsComponent = React.render(React.createElement(scify.evaluatorChart, instance.evaluationChartProperties), domElementConsFinalLawStats);
        } else {
            console.log('finalLawComparisonChart div does not exist');
        }
        loadConsFinalLawStats();
    },
    loadConsFrequencyPerOrganization = function() {
        window.ConsFreqPerOrganizationComponent.getFrequencyPerOrganization();
    },
    loadConsDurationPerOrganization = function() {
        window.ConsDurationPerOrganizationComponent.getDurationPerOrganization();
    },
    loadConsDuration = function() {
        window.ConsDurationComponent.getDuration();
    },
    loadConsCommPerOrganization = function() {
        window.ConsCommPerOrganizationComponent.getConsCommPerOrganization();
    },
    loadConsFinalLawStats = function() {
        window.ConsFinalLawStatsComponent.getConsFinalLawStats();
    },
    createFirstChart = function(instance) {
        if(instance.consultationsPerMonth.length > 0) {
            var numRows = instance.consultationsPerMonth.length;
            var expectedHeight = numRows * 30;
            if(expectedHeight < 400) {
                expectedHeight = 600;
            }
            /*var max = this.consultationsPerMonth.reduce(function(max, arr) {
             return Math.max(max, arr[1]);
             }, -Infinity);*/
            var chartHeight = expectedHeight - 100;
            var consultationsPerMonthOptions = {
                tooltip: {isHtml: true},
                'displayAnnotations': true,
                //'title': "Αριθμός νέων διαβουλεύσεων ανά μήνα (πατήστε πάνω σε μια μπάρα για να δείτε τις διαβουλεύσεις)",
                'title': instance.evaluationMessages.numberOfNewConsPerMonth,
                'height': expectedHeight,
                'width':'1300',
                bar: {groupWidth: "90%"},
                'chartArea': {width: '75%','height': chartHeight,left:'90'},
                'hAxis': {
                    title: instance.evaluationMessages.months,
                    textStyle: {
                        fontSize: 11,
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
                    title: instance.evaluationMessages.numberOfCons,
                    format: '#'
                    /*gridlines: {
                     count: max + 1
                     }*/
                },
                legend: {position: 'none',alignment:'start'},
                'fontSize' : 15
            };
            var domElementLoader = document.getElementById("firstChartLoader");
            if (domElementLoader) {
                window.domElementLoader = React.render(React.createElement(scify.ReactLoader, {display:true}), domElementLoader);
            }
            $(domElementLoader).prepend("<div style='text-align: center; margin-bottom: 5px'>" + instance.evaluationMessages.loading + "...</div>");
            createChart(instance.consultationsPerMonth, consultationsPerMonthOptions,
                "consultationsPerMonthInnerChart", instance.evaluationMessages.consultation,
                instance.evaluationMessages.commentsPlural, 'bar', instance);
        }
    },
    init = function() {
        var instance = this;

        createFirstChart(instance);
        createConsFrequencyPerOrganizationDiv(instance);
        createConsDurationPerOrganizationDiv(instance);
        createConsDurationDiv(instance);
        createConsCommPerOrganizationDiv(instance);
        createConsFinalLawStatsDiv(instance);
        fbq('track', 'InitiateCheckout');
    }
    return {
        init:init
    }
}();