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
            this.state.comment = data.comment;
            this.state.display = true;
            this.state.busy = true;
            console.log(this.props.userId);
            //if the user is not logged in
            if(this.props.userId == undefined || this.props.userId == '') {
                this.state.busy = false;
                this.state.message = <div>Για αυτή την ενέργεια χρειάζεται να είστε <a href="/signIn?returnUrl=@request.uri">συνδεδεμένοι</a></div>;
            }
            else {
                //check if the logged in user has already reported this comment
                this.checkIfUserHasReportedThisComment(this.state.comment.id);
            }
            this.setState(this.state);

        },
        checkIfUserHasReportedThisComment(commentId) {
            var instance = this;
            $.ajax({
                method: "GET",
                url: "/comment/report/check/" + commentId,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend:function(){
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    if(data == false) {
                        instance.state.shouldDisplaySubmitBtn = true;
                        instance.state.message = 'Αν είστε σίγουροι ότι αυτό το σχόλιο είναι υβριστικό, πατήστε "Αναφορά":';
                    }
                    else {
                        instance.state.shouldDisplaySubmitBtn = false;
                        instance.state.message = 'Έχετε ήδη αναφέρει αυτό το σχόλιο ως υβριστικό';
                    }
                    instance.setState(instance.state);
                },
                complete: function(){
                    instance.state.busy = false;
                    instance.setState(instance.state);
                }
            });
        },
        reportComment: function(){
            var instance = this;
            $.ajax({
                method: "POST",
                url: "/comment/report",
                data:JSON.stringify({commentId: instance.state.comment.id}),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend:function(){
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.shouldDisplaySubmitBtn = false;
                    instance.state.message = 'Η αναφορά καταχωρήθηκε. Πατήστε "Κλείσιμο" για να επιστρέψετε στην προηγούμενη σελίδα.';
                    instance.setState(instance.state);
                },
                complete: function(){
                    instance.state.busy = false;
                    instance.setState(instance.state);
                }
            });
        },
        closeModal:function(){
            this.state.display = false;
            this.setState(this.state);
        },
        render: function() {
            var showReportCommentModal = classNames("hide");
            var innerContent = <div className="reportCommentMsg">{this.state.message}</div>;
            if(this.state.display)
                showReportCommentModal = classNames("in show");
            if(this.state.busy)
                innerContent =  <div className="reportCommentMsg"><scify.ReactLoader display={this.state.busy} /></div>;
            if(this.state.shouldDisplaySubmitBtn && this.props.userId != undefined)
                var submitBtn = <button id="saveCommentReport" className="btn blue" onClick={this.reportComment}>Αναφορά</button>;

            return(
                <div id="reportCommentModal" className={ classNames("modal","fade", showReportCommentModal)} role="dialog">
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
                                {submitBtn}
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