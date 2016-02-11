
scify.EvaluatorPageHandler = function(consultationsPerMonth) {

    //console.log(consultationsPerMonth);
    this.consultationsPerMonth = [];
    for (var i=0; i<consultationsPerMonth.length; i++)
    {
        this.consultationsPerMonth.push([ consultationsPerMonth[i].date, consultationsPerMonth[i].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:150px">' + consultationsPerMonth[i].date + '</h5>' + '<h5>Διαβουλέυσεις: ' + consultationsPerMonth[i].numberOfConsultations + '</h5></div>', consultationsPerMonth[i].numberOfConsultations.toString(),consultationsPerMonth[i].cons_ids])
    }
    //console.log(this.consultationsPerMonth);
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
                React.unmountComponentAtNode(document.getElementById('firstChartLoader'));
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
                window.ConsListComponent = React.render(React.createElement(scify.consultationForChart, null), domElementConsList);
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
    createConsFrequencyPerOrganizationDiv = function() {
        var domElementConsFreqPerOrganization = document.getElementById("consultationsPerOrganizationInnerDiv");
        if (domElementConsFreqPerOrganization) {
            //console.log('this record already exists');
            window.ConsFreqPerOrganizationComponent = React.render(React.createElement(scify.evaluatorChart, null), domElementConsFreqPerOrganization);
        } else {
            //console.log('this record does not exist');
        }
        loadConsFrequencyPerOrganization();
    },
    createConsDurationPerOrganizationDiv = function() {
        var domElementConsDurationPerOrganization = document.getElementById("consDurationPerOrganizationInnerChart");
        if (domElementConsDurationPerOrganization) {
            //console.log('this record already exists');
            window.ConsDurationPerOrganizationComponent = React.render(React.createElement(scify.evaluatorChart, null), domElementConsDurationPerOrganization);
        } else {
            //console.log('this record does not exist');
        }
        loadConsDurationPerOrganization();
    },
    createConsDurationDiv = function() {
        var domElementConsDuration = document.getElementById("consDurationInnerChart");
        if (domElementConsDuration) {
            window.ConsDurationComponent = React.render(React.createElement(scify.evaluatorChart, null), domElementConsDuration);
        } else {
            //console.log('this record does not exist');
        }
        loadConsDuration();
    },

    createConsCommPerOrganizationDiv = function() {
        var domElementConsCommPerOrganization = document.getElementById("commConsOrgInnerChart");
        if (domElementConsCommPerOrganization) {
            window.ConsCommPerOrganizationComponent = React.render(React.createElement(scify.evaluatorChart, null), domElementConsCommPerOrganization);
        } else {
            //console.log('this record does not exist');
        }
        loadConsCommPerOrganization();
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
    }
    var init = function() {
        var instance = this;
        if(this.consultationsPerMonth.length > 0) {
            var numRows = this.consultationsPerMonth.length;
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
                'title': "Αριθμός νέων διαβουλεύσεων ανά μήνα",
                'height': expectedHeight,
                'width':'1300',
                bar: {groupWidth: "90%"},
                'chartArea': {width: '75%','height': chartHeight,left:'90'},
                'hAxis': {
                    title: "Μήνες",
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
                    title: "Αριθμός διαβουλεύσεων",
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
            /*$("#consultationsPerMonthInnerChart").css("display", "none");
            setTimeout(function(){
                React.unmountComponentAtNode(document.getElementById('firstChartLoader'));
                $("#consultationsPerMonthInnerChart").css("display", "block");
            }, 6000);*/
            createChart(instance.consultationsPerMonth, consultationsPerMonthOptions, "consultationsPerMonthInnerChart", "Διαβούλευση", "Σχόλια", 'bar', instance);
        }

        createConsFrequencyPerOrganizationDiv();
        createConsDurationPerOrganizationDiv();
        createConsDurationDiv();
        createConsCommPerOrganizationDiv();
        fbq('track', 'InitiateCheckout');
    }
    return {
        init:init
    }
}();