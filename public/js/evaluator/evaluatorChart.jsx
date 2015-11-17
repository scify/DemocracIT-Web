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
            console.log("getFrequencyPerOrganization");
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
                    console.log(data);
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
        render: function() {
            if(this.state.display) {
                if (this.state.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                } else {
                    //var draw = this.drawD3();
                    var draw = "empty"
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


