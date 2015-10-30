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
        getWordCloudFromServer: function getWordCloudFromServer(consultationId) {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "http://localhost:28084/WordCloud/WordCloud",
                cache: false,
                data: {
                    consultation_id: 3957
                },
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    var arr = $.map(data, function (el) {
                        var results = [];
                        for (var item in el) {
                            //console.log(el[item]);
                            results.push({ "text": el[item].term, "size": Math.floor(el[item].freq) });
                        }
                        return results;
                    });
                    console.log(arr);
                    instance.state.frequency_list = arr;
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
        render: function render() {
            if (this.props.busy) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(scify.ReactLoader, { display: this.props.busy })
                );
            }
            var color = d3.scale.linear().domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100]).range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

            var color = d3.scale.linear().domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100]).range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

            d3.layout.cloud().size([800, 300]).words(this.state.frequency_list).rotate(0).fontSize(function (d) {
                return d.size;
            }).on("end", draw).start();

            function draw(words) {
                if (words.length > 0) {
                    d3.select("#wordCloudChart").append("svg").attr("width", 850).attr("height", 350).attr("class", "wordcloud").append("g")
                    // without the transform, words words would get cutoff to the left and top, they would
                    // appear outside of the SVG area
                    .attr("transform", "translate(320,200)").selectAll("text").data(words).enter().append("text").style("font-size", function (d) {
                        return d.size + "px";
                    }).style("fill", function (d, i) {
                        return color(i);
                    }).attr("transform", function (d) {
                        return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                    }).text(function (d) {
                        return d.text;
                    });
                }
            }
            return React.createElement("div", { id: "wordCloudChart" });
        }
    });
})();

//# sourceMappingURL=wordCloud-compiled.js.map