(function(){

    window.scify.reportComment = React.createClass({
        getInitialState: function(){
            return {
                comment : this.props.comment,
                display: false
            }
        },
        //function to display the whole React class
        display: function(data){
            console.log(data);
            this.state.comment = data.comment;
            this.state.display = true;
            this.state.busy = true;
            this.setState(this.state);
            //TODO: fetch report data
            /*if(this.props.finalLawDiv != undefined)
                this.fetchAnnotationData();*/
        },
        closeModal:function(){
            this.state.display = false;
            this.setState(this.state);
        },
        render: function() {
            var showReportCommentModal = classNames("hide");
            if(this.state.display)
                showReportCommentModal = classNames("in show");
            if(this.state.busy)
                var innerContent =  <scify.ReactLoader display={this.state.busy} />;
            return(
                <div id="reporterCommentModal" className={ classNames("modal","fade", showReportCommentModal)} role="dialog">
                    <div className={ classNames("modal-backdrop","fade",showReportCommentModal)}></div>
                    <div className="modal-dialog ">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h4 className="modal-title">Αναφορά σχολίου ως υβριστικό <i className="fa fa-question-circle" title="Αφορά σχόλια με υβριστικό περιεχόμενο"></i></h4>
                                <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                            </div>
                            <div className="modal-body">
                                <div className='body commentBox'>
                                    <scify.Comment
                                        imagesPath = {this.props.imagesPath}
                                        key={this.props.comment.id}
                                        data={this.props.comment}
                                        shouldDisplayCommenterName={true}
                                        shouldDisplayEditIcon={false}
                                        shouldDisplayCommentEdited={true}
                                        shouldDisplayShareBtn={false}
                                        shouldDisplayCommentBody={true}
                                        shouldDisplayEmotion={true}
                                        shouldDisplayAnnotatedText={true}
                                        shouldDisplayReplyBox={false}
                                        shouldDisplayReplies={false}
                                        optionsEnabled={false}
                                        shouldDisplayTopics={true}
                                        commentClassNames="comment"
                                        shouldDisplayFinalLawAnnBtn={false}
                                        shouldDisplayReportAction={false}/>
                                </div>
                                {innerContent}
                            </div>
                            <div className="saveBtnContainer">

                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-default" onClick={this.closeModal}>Κλείσιμο</button>
                            </div>
                        </div>
                    </div>
                </div>
            );
        }
    });
})()