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
                    console.log(data);
                    if(data.results.length != 0)
                        instance.computeMultiplierByAverageFreq(data, instance);
                    //instance.state.parent = "cons";
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
                    console.log(data);
                    if(data.results.length != 0)
                        instance.computeMultiplierByAverageFreq(data, instance);
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
        computeMultiplierByAverageFreq: function(data, instance) {
            var multiplier = 2;
            var sizes = 0;
            var average;
            //we sort the array of values so that we can get the min and max values
            //this will help map the values to a [40-120] values range, so that we are independent of the initial values
            data.results.sort(function (a, b) {
                return a.freq - b.freq
            });
            var min = data.results[0].freq,
                max = data.results[data.results.length - 1].freq;
            if(min == max)
                max += 100;

                //TODO: remove fallback method:
            //we compute the average frequency so that we can be able to initialize the multiplier
            //the multiplier serves the purpose of augmenting the words in terms of pixels
            //e.g. a word that has frequency one, with a 1- multiplier will get 10 pixels.
            /*console.log("min: " + min);
            console.log("max: " + max);*/
            //Y = (X-A)/(B-A) * (D-C) + C
            /*for(var i=0; i<data.results.length ; i++) {
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
            } else if(average > 120) {
                multiplier = 0.3;
                instance.state.cloudHeight = 700;
                instance.state.translateHeight = 300;
            } else if(average > 80) {
                multiplier = 0.5;
                instance.state.cloudHeight = 700;
                instance.state.translateHeight = 300;
            }*/
            var arr = $.map(data, function(el) {
                var results = [];
                for(var item in el) {
                    //results.push({"text":el[item].term, "size":Math.floor(el[item].freq * multiplier)})
                    var num = Math.floor((el[item].freq - min) / (max - min) * (120 - 40) + 10);
                    //console.log("freq: " + el[item].freq + " num: " + num);
                    results.push({"text":el[item].term, "size":num})
                }
                return results;
            });
            instance.state.frequency_list = arr;
        },
        drawD3 : function() {
            var fill = d3.scale.category20();
            var instance = this;
            //translate gives padding to the top
            var translate = "translate(500," + instance.state.translateHeight + ")";
            if(this.state.frequency_list.length > 0) {
                var color = d3.scale.linear()
                    .domain([0, 1, 2, 3, 4, 5, 6, 10, 15, 20, 100])
                    .range(["#ddd", "#ccc", "#bbb", "#aaa", "#999", "#888", "#777", "#666", "#555", "#444", "#333", "#222"]);

                var words =this.state.frequency_list;
                d3.layout.cloud().size(["1000", 700])
                    .words(words)
                    .rotate(function() { return (~~(Math.random() * 6) - 3) * 10; })
                    .font("Impact")
                    .fontSize(function (d) {
                        return d.size;
                    })
                    .padding(5)
                    .on("end", draw)
                    .start();

                function draw(words) {
                    d3.select("#wordCloudChart").append("svg")
                        .attr("width", "1000")
                        .attr("height", 700)
                        .append("g")
                        .attr("transform", "translate(" + 1200 / 2 + "," + 700 / 2 + ")")
                        .selectAll("text")
                        .data(words)
                        .enter().append("text")
                        .style("font-size", function (d) {
                            return d.size + "px";
                        })
                        .style("font-family", "Impact")
                        .style("fill", function(d, i) { return fill(i); })
                        .attr("text-anchor", "middle")
                        .attr("transform", function(d) {
                            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
                        })
                        .text(function (d) {
                            return d.text;
                        });
                    //re-initialize frequency list
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


