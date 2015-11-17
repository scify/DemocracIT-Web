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
            //console.log("getFrequencyPerOrganization");
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
                    /*15 is the number of months we are querying for*/
                    var numberOfOrganizations = data.length / 15;
                    for(var i = 0; i < numberOfOrganizations; i++) {
                        var chartId = "chart_" + data[index].organizationId;
                        var chartTitle = data[index].organizationName;
                        var dataForCurrentOrganization = [];
                        var noConsultations = 1;
                        //console.log(chartId);
                        for(var j = index; j < index + 15; j++) {
                            dataForCurrentOrganization.push([data[j].date, data[j].numberOfConsultations, '<div style="padding-left: 10px"><h5 style="width:100%">' + data[j].date + '</h5>' + '<h5>Διαβουλέυσεις: ' + data[j].numberOfConsultations + '</h5></div>', data[j].numberOfConsultations]);
                            if(data[j].numberOfConsultations != 0) {
                                noConsultations = 0;
                            }
                        }
                        $( "#consultationsPerOrganizationInnerDiv" ).append( '<div class="organizationChart"><div id="' + chartId  + '"></div></div>' );
                        //console.log(dataForCurrentOrganization);
                        if(noConsultations) {
                            $("#" + chartId).append('' +
                                    '<div class="explanation organizationName">' + chartTitle + '</div>' +
                                    '<div class="explanation">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις τους τελευταίους 15 μήνες.</div>');
                        } else {
                            instance.createChart(dataForCurrentOrganization, chartId, chartTitle, 'bar');
                        }
                        index+=15;
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
        createChart : function(dataForChart, chartId, chartTitle, chartType) {
                var data = new google.visualization.DataTable();
                //console.log(dataForChart);
                data.addColumn('string', "");
                data.addColumn('number', "");
                data.addColumn({type:'string', role:'tooltip','p': {'html': true}});
                data.addColumn({type:'number', role:'annotation'});
                data.addRows(dataForChart);

                var options = {
                    tooltip: {isHtml: true},
                    'displayAnnotations': true,
                    'title': chartTitle,
                    'height': 500,
                    'width':'1300',
                    bar: {groupWidth: "90%"},
                    'chartArea': {width: '75%','height': 400,left:'200'},
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
                        title: "Αριθμός διαβουλεύσεων"
                    },
                    legend: {position: 'none',alignment:'start'},
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


