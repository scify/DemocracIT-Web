"use strict";

(function () {

    scify.WordCloud = React.createClass({
        displayName: "WordCloud",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                frequency_list: [],
                busy: false,
                display: false
            };
        },
        refreshComments: function refreshComments() {
            var instance = this;
            if (instance.state.commentsCount > instance.state.comments.length) instance.getCommentsFromServer.call(instance);else if (instance.state.display) instance.setVisibibility.call(instance, false);else instance.setVisibibility.call(instance, true);
        },
        getConsWordCloudFromServer: function getConsWordCloudFromServer(consultationId) {
            console.log("getWordCloudFromServer");
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/consultation/wordCloud/" + consultationId,
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    console.log(data);
                    var multiplier = 2;
                    var sizes = 0;
                    var average;

                    for (var i = 0; i < data.results.length; i++) {
                        sizes += data.results[i].freq;
                    }
                    average = sizes / data.results.length;
                    console.log("average: " + average);
                    if (average < 3) {
                        multiplier = 10;
                    } else if (average < 5) {
                        multiplier = 8;
                    } else if (average < 10) {
                        multiplier = 4;
                    } else if (average < 20) {
                        multiplier = 2;
                    } else if (average > 120) {
                        multiplier = 0.3;
                        instance.state.cloudHeight = 700;
                        instance.state.translateHeight = 300;
                    } else if (average > 80) {
                        multiplier = 0.5;
                        instance.state.cloudHeight = 700;
                        instance.state.translateHeight = 300;
                    }
                    var arr = $.map(data, function (el) {
                        var results = [];
                        for (var item in el) {
                            results.push({ "text": el[item].term, "size": Math.floor(el[item].freq * multiplier) });
                        }
                        return results;
                    });
                    instance.state.frequency_list = arr;
                    //instance.state.parent = "cons";
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
        getArticleWordCloudFromServer: function getArticleWordCloudFromServer(articleId, commentsNum) {
            this.state.frequency_list = [];
            console.log(articleId);
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/article/wordCloud/" + articleId,
                beforeSend: function beforeSend() {
                    instance.state.frequency_list = [];
                    var chart = document.getElementById("wordCloudChart");
                    while (chart.firstChild) {
                        chart.removeChild(chart.firstChild);
                    }
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    var multiplier = 2;
                    var sizes = 0;
                    var average;
                    if (commentsNum < 20) {
                        multiplier = 5;
                    }
                    for (var i = 0; i < data.results.length; i++) {
                        sizes += data.results[i].freq;
                    }
                    average = sizes / data.results.length;
                    if (average < 3) {
                        multiplier = 12;
                    } else if (average > 120) {
                        multiplier = 0.3;
                        instance.state.cloudHeight = 700;
                        instance.state.translateHeight = 300;
                    } else if (average > 80) {
                        multiplier = 0.5;
                        instance.state.cloudHeight = 700;
                        instance.state.translateHeight = 300;
                    }
                    var arr = $.map(data, function (el) {
                        var results = [];
                        for (var item in el) {
                            results.push({ "text": el[item].term, "size": Math.floor(el[item].freq * multiplier) });
                        }
                        return results;
                    });

                    instance.state.frequency_list = arr;
                    //instance.state.parent = "article";
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
        drawD3: function drawD3() {
            var fill = d3.scale.category20();
            var instance = this;
            //translate gives padding to the top
            var translate = "translate(500," + instance.state.translateHeight + ")";
            if (this.state.frequency_list.length > 0) {
                var draw = function draw(words) {
                    d3.select("#wordCloudChart").append("svg").attr("width", 1000).attr("height", 700).append("g").attr("transform", "translate(" + 1200 / 2 + "," + 700 / 2 + ")").selectAll("text").data(words).enter().append("text").style("font-size", function (d) {
                        return d.size + "px";
                    }).style("font-family", "Impact").style("fill", function (d, i) {
                        return fill(i);
                    }).attr("text-anchor", "middle").attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    }).text(function (d) {
                        return d.text;
                    });
                    //re-initialize frequency list
                    instance.state.frequency_list = [];
                };

                var color = d3.scale.linear().domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100]).range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

                var words = this.state.frequency_list;
                d3.layout.cloud().size([1000, 700]).words(words).rotate(function () {
                    return (~ ~(Math.random() * 6) - 3) * 10;
                }).font("Impact").fontSize(function (d) {
                    return d.size;
                }).padding(5).on("end", draw).start();
            } else {
                return "empty";
            }
        },
        render: function render() {
            if (this.state.display) {
                if (this.state.busy) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(scify.ReactLoader, { display: this.state.busy })
                    );
                } else {
                    var draw = this.drawD3();
                    if (draw == "empty") {
                        return React.createElement(
                            "div",
                            { className: "noStats" },
                            "Δεν βρέθηκαν δεδομένα."
                        );
                    }
                }
            }
            return React.createElement("div", null);
        }
    });
})();

//# sourceMappingURL=wordCloud-compiled.js.map