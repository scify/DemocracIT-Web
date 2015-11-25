(function(){

    scify.consultationForChart = React.createClass({
        getInitialState: function() {
            return {
                consultations: [],
                busy: false,
                display: false
            };
        },
        getConsultationsFromServer : function(cons_ids){
            console.log(cons_ids)
            this.state.consultations = [];
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/evaluator/consultations/get",
                data: {cons_ids:cons_ids},
                beforeSend: function(){
                    instance.state.consultations = [];
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    //console.log(data);
                    instance.state.consultations = data;
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
            var instance = this;
            if(this.state.display) {
                if (this.state.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                } else {
                    var divToDisplay = [];
                    instance.state.consultations.forEach(function(consultation) {
                        console.log(consultation);
                        divToDisplay.push(<div className="consItem comment"><div className="consTitle">{consultation.title}</div>
                            <div>Ημερομηνία που ήταν ανοιχτή η διαβούλευση: <span className="consDate">{new Date(consultation.start_date).toLocaleDateString('el-EL', {hour: '2-digit'})}</span> έως <span className="consDate">{new Date(consultation.end_date).toLocaleDateString('el-EL', {hour: '2-digit'})}</span></div>
                            <div className="linkToCons">Δείτε τη διαβούλευση <a href={"/consultation/" + consultation.id}>εδώ</a></div>
                            <div className="linkToCons">Δείτε τη διαβούλευση στο <a href={consultation.opengov_url}>opengov</a></div>
                        </div>);
                    });
                    return (

                        <div className="commentList">{divToDisplay}</div>
                    );
                }
            } else {
                return (
                    <div></div>
                );
            }
        }
    });

})()