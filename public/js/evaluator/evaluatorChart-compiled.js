"use strict";

(function () {

    scify.evaluatorChart = React.createClass({
        displayName: "evaluatorChart",

        getInitialState: function getInitialState() {
            return {
                frequency_list: [],
                busy: false,
                display: false
            };
        },
        getFrequencyPerOrganization: function getFrequencyPerOrganization() {
            //console.log("getFrequencyPerOrganization");
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/evaluator/frequency/organization",
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    //console.log(data);
                    var index = 0;
                    /*15 is the number of months we are querying for*/
                    var numberOfOrganizations = data.length / 18;
                    for (var i = 0; i < numberOfOrganizations; i++) {
                        var chartId = "chart_" + data[index].organizationId;
                        var chartTitle = data[index].organizationName;
                        var dataForCurrentOrganization = [];
                        var noConsultations = 1;
                        //console.log(chartId);
                        for (var j = index; j < index + 18; j++) {
                            dataForCurrentOrganization.push([data[j].date, data[j].numberOfConsultations, "<div style=\"padding-left: 10px\"><h5 style=\"width:150px\">" + data[j].date + "</h5>" + "<h5>Διαβουλέυσεις: " + data[j].numberOfConsultations + "</h5></div>", data[j].numberOfConsultations]);
                            if (data[j].numberOfConsultations != 0) {
                                noConsultations = 0;
                            }
                        }
                        $("#consultationsPerOrganizationInnerDiv").append("<div class=\"organizationChart\"><div id=\"" + chartId + "\"></div></div>");
                        //console.log(dataForCurrentOrganization);
                        if (noConsultations) {
                            $("#" + chartId).append("" + "<div class=\"explanation organizationName\">" + chartTitle + "</div>" + "<div class=\"explanation\">Αυτός ο φορέας δεν έχει αναρτήσει δημόσιες διαβουλέυσεις τους τελευταίους 18 μήνες.</div>");
                        } else {
                            $("#" + chartId).before("" + "<div class=\"explanation organizationName\">" + chartTitle + "</div>");
                            instance.createChart(dataForCurrentOrganization, chartId, chartTitle, "bar");
                        }
                        index += 18;
                        noConsultations = 1;
                    }
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function error(x, z, y) {
                    console.log(x);
                }
            });

            return promise;
        },
        createChart: function createChart(dataForChart, chartId, chartTitle, chartType) {
            var max = dataForChart.reduce(function (max, arr) {
                return Math.max(max, arr[1]);
            }, -Infinity);
            //console.log(chartTitle + ": " +max);
            var data = new google.visualization.DataTable();
            //console.log(dataForChart);
            data.addColumn("string", "");
            data.addColumn("number", "");
            data.addColumn({ type: "string", role: "tooltip", "p": { "html": true } });
            data.addColumn({ type: "number", role: "annotation" });
            data.addRows(dataForChart);
            var chartHeight = 300;
            if (max < 2) {
                chartHeight = 200;
            } else if (max > 20) {
                chartHeight = 900;
            } else if (max > 10) {
                chartHeight = 700;
            } else if (max > 5) {
                chartHeight = 400;
            }

            var options = {
                tooltip: { isHtml: true },
                "displayAnnotations": true,
                "title": "<div class=\"organizationName\">" + chartTitle + "</div>", titlePosition: "none",
                "height": chartHeight,
                "width": "1300",
                bar: { groupWidth: "90%" },
                "chartArea": { width: "75%", "height": chartHeight - 100, left: "200" },
                "hAxis": {
                    title: "Μήνες",
                    textStyle: {
                        fontSize: 11,
                        color: "#053061",
                        bold: false,
                        italic: false
                    }

                },
                animation: {
                    duration: 2000,
                    easing: "out",
                    startup: true
                },
                "is3D": true,
                "vAxis": {
                    title: "Αριθμός διαβουλεύσεων",
                    viewWindow: {
                        max: max,
                        min: 0
                    }, format: "#",
                    gridlines: {
                        count: max + 1
                    }
                },
                legend: { position: "none", alignment: "start" },
                "fontSize": 15
            };

            var chart;
            switch (chartType) {
                case "bar":
                    chart = new google.visualization.ColumnChart(document.getElementById(chartId));
                    break;
                case "pie":
                    chart = new google.visualization.PieChart(document.getElementById(chartId));
                    break;
                default:
                    break;
            }
            chart.draw(data, options);
        },
        render: function render() {
            if (this.state.display) {
                if (this.state.busy) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(scify.ReactLoader, { display: this.state.busy })
                    );
                }
            }
            return React.createElement("div", null);
        }
    });
})();

//# sourceMappingURL=evaluatorChart-compiled.js.map