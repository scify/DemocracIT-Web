(function(){

    scify.WordCloud = React.createClass({
        getInitialState: function() {
          return {
              consultationid: this.props.consultationid,
              frequency_list: [],
              busy: false,
              display: false
          };
        },
        refreshComments : function(){
            var instance = this;
            if (instance.state.commentsCount > instance.state.comments.length )
                instance.getCommentsFromServer.call(instance);
            else if (instance.state.display)
                instance.setVisibibility.call(instance,false);
            else
                instance.setVisibibility.call(instance,true);
        },
        getConsWordCloudFromServer : function(consultationId){

            console.log("getWordCloudFromServer");
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/consultation/wordCloud/" + consultationId,
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    var multiplier = 2;
                    var sizes = 0;
                    var average;

                    for(var i=0; i<data.results.length ; i++) {
                        sizes += data.results[i].freq;
                    }
                    average = sizes / data.results.length;
                    console.log("average: " + average);
                    if(average < 3) {
                        multiplier = 10;
                    } else if(average < 5) {
                        multiplier = 8;
                    } else if (average < 10) {
                        multiplier = 4;
                    } else if (average < 20) {
                        multiplier = 2;
                    } else if(average > 80) {
                        multiplier = 0.5;
                    }
                    var arr = $.map(data, function(el) {
                        var results = [];
                        for(var item in el) {
                            results.push({"text":el[item].term, "size":Math.floor(el[item].freq * multiplier)})
                        }
                        return results;
                    });
                    instance.state.frequency_list = arr;
                    console.log(instance.state.frequency_list);
                    instance.state.parent = "cons";
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
        getArticleWordCloudFromServer : function(articleId, commentsNum){
            this.state.frequency_list = [];
            console.log(articleId);
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/article/wordCloud/" + articleId,
                beforeSend: function(){
                    instance.state.frequency_list = [];
                    var chart = document.getElementById("wordCloudChart");
                    while (chart.firstChild) {
                        chart.removeChild(chart.firstChild);
                    }
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    var multiplier = 2;
                    var sizes = 0;
                    var average;
                    if(commentsNum < 20) {
                        multiplier = 5;
                    }
                    for(var i=0; i<data.results.length ; i++) {
                        sizes += data.results[i].freq;
                    }
                    average = sizes / data.results.length;
                    if(average < 3) {
                        multiplier = 12;
                    } else if(average > 80) {
                        multiplier = 0.5;
                    }
                    var arr = $.map(data, function(el) {
                        var results = [];
                        for(var item in el) {
                            results.push({"text":el[item].term, "size":Math.floor(el[item].freq * multiplier)});
                        }
                        return results;
                    });

                    instance.state.frequency_list = arr;
                    instance.state.parent = "article";
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
        drawD3 : function() {
            var fill = d3.scale.category20();
            var instance = this;
            var translate = "";
            if (instance.state.parent == "cons") {
                var translate = "translate(500,250)";
            } else if(instance.state.parent == "article") {
                var translate = "translate(500,180)";
            }
            if(this.state.frequency_list.length > 0) {
                var color = d3.scale.linear()
                    .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                    .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

                var color = d3.scale.linear()
                    .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                    .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);
                console.log(this.state.frequency_list);
                d3.layout.cloud().size([800, 300])
                    .words(this.state.frequency_list)
                    .rotate(function () {
                        return ~~(Math.random() * 2) * 90;
                    })
                    .font("Impact")
                    .fontSize(function (d) {
                        return d.size +2;
                    })
                    .padding(5)
                    .on("end", draw)
                    .start();

                function draw(words) {
                    console.log(words);
                    d3.select("#wordCloudChart").append("svg")
                        .attr("width", "100%")
                        .attr("height", 500)
                        .append("g")
                        .attr("transform", translate)
                        .selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", function (d) {
                            return d.size + "px";
                        })
                        .style("font-family", "Impact")
                        .style("fill", function(d, i) { return fill(i); })
                        .attr("text-anchor", "middle")
                        .attr("transform", function (d) {
                            return "translate(" + [d.x, d.y] + ")";
                        })
                        .text(function (d) {
                            return d.text;
                        });

                    instance.state.frequency_list = [];
                }
            } else {

                return "empty";
            }
        },
        render: function() {
            if(this.state.display) {
                if (this.state.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                } else {
                    var draw = this.drawD3();
                    if(draw == "empty") {
                        console.log("empty");
                        return ( <div className="noStats">Δεν βρέθηκαν δεδομένα.</div> );
                    }

                }
            }
            return (
                <div></div>
            );
        }
    });

})()


