(function(){

    scify.evaluatorChart = React.createClass({
        getInitialState: function() {
          return {
              frequency_list: [],
              busy: false,
              display: false
          };
        },
        getFrequencyPerOrganization : function(){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/evaluator/frequency/organization",
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    //console.log(data);
                    var index = 0;
                    /*18 is the number of months we are querying for
                    * so, we iterate through the dataset, with an iteration gap of 18*/
                    var numberOfOrganizations = data.length / 18;
                    for(var i = 0; i < numberOfOrganizations; i++) {
                        var chartId = "chart_" + data[index].organizationId;
                        var chartTitle = data[index].organizationName;
                        var dataForCurrentOrganization = [];
                        /*if noConsultations dont change while the iteration
                        * it means that this organization has no consultations*/
                        var noConsultations = 1;
                        for(var j = index; j < index + 18; j++) {
                            dataForCurrentOrganization.push([data[j].date, data[j].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:150px">' + data[j].date + '</h5>' + '<h5>Διαβουλέυσεις: ' + data[j].numberOfConsultations + '</h5></div>', data[j].numberOfConsultations.toString()]);
                            if(data[j].numberOfConsultations != 0) {
                                noConsultations = 0;
                            }
                        }
                        $( "#consultationsPerOrganizationInnerDiv" ).append( '<div class="organizationChart"><div id="' + chartId  + '"></div></div>' );
                        if(noConsultations) {
                            $("#" + chartId).append('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>' +
                                    '<div class="explanation">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις τους τελευταίους 18 μήνες.</div>');
                        } else {
                            $("#" + chartId).before('' +
                                '<div class="explanation organizationName">' + chartTitle + '</div>');
                            instance.createBarChart(dataForCurrentOrganization, chartId, "Αριθμός Διαβουλέυσεων", "Μήνες", 1, null);
                        }
                        /*Increase index*/
                        index+=18;
                        /*Reset noConsultations checker*/
                        noConsultations = 1;
                    }
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function(x,z,y){
                    console.log(x);
                }
            });
            return promise;
        },
        getDurationPerOrganization : function(){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/evaluator/duration/organization",
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    var curOrganization = data[0].organizationId;
                    var dataForCurrentOrganization = [];
                    /*if noConsultations dont change while the iteration
                     * it means that this organization has no consultations*/
                    var noConsultations = 1;
                    for(var i = 0; i < data.length; i++) {
                        /*Here we know we have changed organization when the id has changed*/
                        if(data[i].organizationId == curOrganization ) {
                            dataForCurrentOrganization.push([data[i].periods, data[i].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:150px">' + data[i].periods + ' ημέρες</h5>' + '<h5>Διαβουλέυσεις: ' + data[i].numberOfConsultations + '</h5></div>', data[i].numberOfConsultations.toString()]);
                            if(data[i].numberOfConsultations != 0) {
                                noConsultations = 0;
                            }
                        } else {
                            var chartId = "chart_duration_" + data[i-1].organizationId;
                            /*The first time we have changed organization, the organization that is completed is the previous one*/
                            var chartTitle = data[i-1].organizationName;
                            $("#consDurationPerOrganizationInnerChart").append('<div class="organizationChart"><div id="' + chartId + '"></div></div>');
                            if(noConsultations) {
                                $("#" + chartId).append('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>' +
                                    '<div class="explanation">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις.</div>');
                            } else {
                                $("#" + chartId).before('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>');
                                instance.createBarChart(dataForCurrentOrganization, chartId, "Αριθμός Διαβουλέυσεων", "Ημέρες που οι διαβουλεύσεις ήταν ενεργές", 1, 450);
                            }
                            dataForCurrentOrganization = [];
                            curOrganization = data[i].organizationId;
                            noConsultations = 1;
                        }
                        /*When reading the las element of the dataset, we are in the last organization, so we display it*/
                        if(i == data.length -1) {
                            var chartId = "chart_duration_" + data[i - 1].organizationId;
                            var chartTitle = data[i - 1].organizationName;
                            $("#consDurationPerOrganizationInnerChart").append('<div class="organizationChart"><div id="' + chartId + '"></div></div>');
                            if (noConsultations) {
                                $("#" + chartId).append('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>' +
                                    '<div class="explanation">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις.</div>');
                            } else {
                                $("#" + chartId).before('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>');
                                instance.createBarChart(dataForCurrentOrganization, chartId, "Αριθμός Διαβουλέυσεων", "Ημέρες που οι διαβουλεύσεις ήταν ενεργές", 1, 450);
                            }
                        }
                    }
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function(x,z,y){
                    console.log(x);
                }
            });

            return promise;
        },
        getDuration : function(){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/evaluator/duration/all",
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    console.log(data);
                    var dataForDuration = [];
                    var chartId = "consDurationChartForAll";
                    var chartTitle = "Κατανομή Διαβουλεύσεων";
                    for(var i = 0; i < data.length; i++) {
                        dataForDuration.push([data[i].periods, data[i].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:150px">' + data[i].periods + ' ημέρες</h5>' + '<h5>Διαβουλέυσεις: ' + data[i].numberOfConsultations + '</h5>' + '<h5>Ποσοστό: ' + data[i].percentage + ' %</h5>' + '</div>', data[i].numberOfConsultations  + " (" + data[i].percentage  + "%)"]);
                    }
                    $( "#consDurationInnerChart" ).append( '<div style="margin-top: 20px" class="organizationChart"><div id="' + chartId + '"></div></div>' );
                    $("#" + chartId).before('' +
                        '<div class="explanation organizationName">' + chartTitle + '</div>');
                    console.log(dataForDuration);
                    instance.createBarChart(dataForDuration, chartId, "Αριθμός Διαβουλέυσεων", "Ημέρες που οι διαβουλεύσεις ήταν ενεργές", 0, 450);
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function(x,z,y){
                    console.log(x);
                }
            });

            return promise;
        },
        getConsCommPerOrganization : function(){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/evaluator/comments/organization",
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    var curOrganization = data[0].organizationId;
                    var dataForCurrentOrganization = [];
                    var noConsultations = 1;
                    for(var i = 0; i < data.length; i++) {
                        /*Here we know we have changed organization when the id has changed*/
                        if(data[i].organizationId == curOrganization ) {
                            dataForCurrentOrganization.push([data[i].commentWindow, data[i].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:150px">' + data[i].commentWindow + ' σχόλια</h5>' + '<h5>Διαβουλέυσεις: ' + data[i].numberOfConsultations + '</h5></div>', data[i].numberOfConsultations.toString()]);
                            if(data[i].numberOfConsultations != 0) {
                                noConsultations = 0;
                            }
                        } else {
                            /*The first time we have changed organization, the organization that is completed is the previous one*/
                            var chartId = "chart_comments_" + data[i-1].organizationId;
                            var chartTitle = data[i-1].organizationName;
                            $("#commConsOrgInnerChart").append('<div class="organizationChart"><div id="' + chartId + '"></div></div>');
                            if(noConsultations) {
                                $("#" + chartId).append('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>' +
                                    '<div class="explanation">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις.</div>');
                            } else {
                                $("#" + chartId).before('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>');
                                instance.createBarChart(dataForCurrentOrganization, chartId, "Αριθμός Διαβουλέυσεων", "Αριθμός σχολίων",1, 450);
                            }
                            dataForCurrentOrganization = [];
                            curOrganization = data[i].organizationId;
                            noConsultations = 1;
                        }

                        if(i == data.length -1) {
                            var chartId = "chart_comments_" + data[i - 1].organizationId;
                            var chartTitle = data[i - 1].organizationName;
                            $("#commConsOrgInnerChart").append('<div class="organizationChart"><div id="' + chartId + '"></div></div>');
                            if (noConsultations) {
                                $("#" + chartId).append('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>' +
                                    '<div class="explanation">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις.</div>');
                            } else {
                                $("#" + chartId).before('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>');
                                instance.createBarChart(dataForCurrentOrganization, chartId, "Αριθμός Διαβουλέυσεων", "Αριθμός σχολίων",1, 450);
                            }
                        }
                    }
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function(x,z,y){
                    console.log(x);
                }
            });

            return promise;
        },
        /**
         * If you want to customize further the function, it is recommended you extend it by creating another one.
         * function createBarChart
         * @param object dataForChart
         * it should be and obect with the following members: {string: Key, number: Value, string:Tooltip (what is displayed when hovering), string:annotation(what is on the bar)}
         * @param string chartId: a string containing the is of the DOM element we want the chart to appear
         * @param yName: a string containing the title of the Y Axis
         * @param xName: a string containing the title of the X Axis
         * @param gridLines: it contains the number of the lines we want our scale to have. For charts that are long scaled (eg 0-200), pass 1. Otherwise, pass 0
         * @param recommendedHeight: the recommendedHeight for the chart. If null passed, the height will be computed based on the max number of the chart
         */
        createBarChart : function(dataForChart, chartId, yName, xName, gridLines, recommendedHeight) {
            /*We find the max element (value) of the dataSet, to define the scale*/
            var max = dataForChart.reduce(function(max, arr) {
                return Math.max(max, arr[1]);
            }, -Infinity);
            if(gridLines == 1) {
                gridLines = {
                    count: max + 1
                };
            }
            var data = new google.visualization.DataTable();
            data.addColumn('string', "");
            data.addColumn('number', "");
            data.addColumn({type:'string', role:'tooltip','p': {'html': true}});
            data.addColumn({type:'string', role:'annotation'});
            data.addRows(dataForChart);
            if(recommendedHeight == null) {
                var chartHeight = 300;
                if (max < 2) {
                    chartHeight = 200;
                } else if (max > 20) {
                    chartHeight = 900;
                } else if (max > 10) {
                    chartHeight = 600;
                } else if (max > 5) {
                    chartHeight = 400;
                }
                recommendedHeight = chartHeight;
            }


            var options = {
                tooltip: {isHtml: true},
                'displayAnnotations': true,
                'title': '',titlePosition: 'none',
                'height': recommendedHeight,
                'width':'1300',
                bar: {groupWidth: "90%"},
                'chartArea': {width: '75%','height': recommendedHeight -100,left:'200'},
                'hAxis': {
                    title: xName,
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
                'is3D':false,
                'vAxis': {
                    title: yName,
                    viewWindow:{
                        max:max,
                        min:0
                    },
                    format: "#",
                    gridlines: gridLines
                },
                legend: {position: 'none',alignment:'start'},
                'fontSize' : 15
            };

            var chart;
            chart = new google.visualization.ColumnChart(document.getElementById(chartId));
            chart.draw(data, options);
        },
        render: function() {
            if(this.state.display) {
                if (this.state.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                }
            }
            return (
                <div></div>
            );
        }
    });

})()


