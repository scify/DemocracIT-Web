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
        getConsWordCloudFromServer : function(consultationId, wordCloudPath){

            console.log("getWordCloudFromServer");
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: wordCloudPath,
                cache:false,
                data:{
                    consultation_id :consultationId
                },
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    console.log(data);
                    var arr = $.map(data, function(el) {
                        var results = [];
                        for(var item in el) {
                            //console.log(el[item]);
                            results.push({"text":el[item].term, "size":Math.floor(el[item].freq)})
                        }
                        return results;
                    });
                    instance.state.frequency_list = arr;
                    console.log(instance.state.frequency_list);
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
        getArticleWordCloudFromServer : function(articleId, wordCloudPath){
            this.state.frequency_list = [];
            console.log(articleId);
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: wordCloudPath,
                cache:false,
                data:{
                    article_id :articleId,
                    max_terms : 30
                },
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
                    var arr = $.map(data, function(el) {
                        var results = [];
                        for(var item in el) {
                            //console.log(el[item]);
                            results.push({"text":el[item].term, "size":Math.floor(el[item].freq * 2)})
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
            var instance = this;
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

                    instance.state.frequency_list = [];
                }
            } else {
                return (
                    <div id="explanation">Δεν βρέθηκαν δεδομένα.</div>
                );
            }
        },
        render: function() {
            console.log(this.state);
            if(this.state.display) {
                if (this.state.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                } else {
                    console.log("drawing now");
                    this.drawD3();
                }
            }
            return (
                <div></div>
            );
        }
    });

})()


