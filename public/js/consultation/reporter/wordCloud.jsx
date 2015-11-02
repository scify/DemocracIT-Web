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
        getWordCloudFromServer : function(consultationId){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "http://localhost:28084/WordCloud/WordCloud",
                cache:false,
                data:{
                    consultation_id :3957
                },
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    var arr = $.map(data, function(el) {
                        var results = [];
                        for(var item in el) {
                            //console.log(el[item]);
                            results.push({"text":el[item].term, "size":Math.floor(el[item].freq)})
                        }
                        return results;
                    });
                    instance.state.frequency_list = arr;
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
            if(this.state.frequency_list.length > 0) {
                var color = d3.scale.linear()
                    .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                    .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

                var color = d3.scale.linear()
                    .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                    .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

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
                        .attr("transform", "translate(500,250)")
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
                }
            }
        },
        render: function() {
                if (this.props.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.props.busy}/>
                        </div>
                    );
                } else {
                    this.drawD3();
                }

                return (
                    <div id="wordCloudChart"></div>
                );
        }
    });

})()


