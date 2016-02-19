(function(){

    scify.consultationForChart = React.createClass({
        getInitialState: function() {
            return {
                consultations: [],
                displayedConsultations:[],
                busy: false,
                display: false,
                page:10,
                shouldDisplayLoadMoreBtn: true,
                messages: this.props.evaluationMessages
            };
        },
        displayNextBatch: function(event){
            //event.preventDefault();
            var loaded = this.state.displayedConsultations.length;
            var nextBatchMargin = this.state.page;
            var toLoad = loaded + nextBatchMargin;
            if(toLoad > this.state.consultations.length) {
                toLoad = this.state.consultations.length;
                this.state.shouldDisplayLoadMoreBtn = false;
            }
            this.state.displayedConsultations = this.state.consultations.slice(0, toLoad);
            this.setState(this.state);
        },
        getConsultationsFromServer : function(cons_ids){
            //console.log(cons_ids)
            this.state.consultations = [];
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/evaluator/consultations/get",
                data: {cons_ids:cons_ids},
                beforeSend: function(){
                    instance.state.consultations = [];
                    instance.state.displayedConsultations= [];
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
                    instance.displayNextBatch.call(instance);
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
                    console.log(instance.state.displayedConsultations.length);
                    instance.state.displayedConsultations.forEach(function(consultation) {
                        //console.log(consultation);
                        divToDisplay.push(<div className="consItem comment"><div className="consTitle"><a href={"/consultation/" + consultation.id}>{consultation.title}</a></div>
                            <div>{instance.state.messages.dateWhenConsWasActive}:
                                <span className="consDate">{new Date(consultation.start_date).toLocaleDateString('el-EL', {hour: '2-digit'})}
                                </span> {instance.state.messages.consTo} <span className="consDate">{new Date(consultation.end_date).toLocaleDateString('el-EL', {hour: '2-digit'})}</span></div>
                        </div>);
                    });
                    var loadMoreBtnClasses = classNames("loadMoreBtn",{ hide :!instance.state.shouldDisplayLoadMoreBtn});
                    return (
                        <div className="commentList">{divToDisplay}
                        <div className={loadMoreBtnClasses} onClick={this.displayNextBatch}>load more <div className="loadMoreIcon"><i className="fa fa-sort-desc"></i></div></div>
                        </div>

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