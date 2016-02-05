(function(){

    window.scify.commentLawMatcher = React.createClass({
        getInitialState: function() {
            return {
                comment : this.props.comment,
                display :"",
                finalLawId: this.props.finalLawId
            };
        },
        componentDidMount: function() {
            this.updateFinalLawDivDataTarget();
            this.createAnnotationAreasForFinalLaw();
            this.formSubmitHandler();
        },
        //TODO: implement clearForm function to clear all selected checkboxes

        formSubmitHandler: function() {
            var instance = this;
            $('#saveFinalLawAnnotation').on("click",function(e) {

                e.preventDefault();
                var inputs = $("#FinalLawAnnForm :input");
                var values = [];
                var index = 0;
                $(inputs).each(function() {
                    if(this.type == "checkbox") {
                        if($(this).is(':checked')) {
                            var dataId = $(this).parent().parent().attr("data-id");
                            values[index] = dataId;
                            index++;
                        }
                    }
                });
                var dataToSend = {
                    annotationIds: values,
                    commenterId:instance.state.comment.userId,
                    finalLawId:instance.state.finalLawId
                };
                console.log(dataToSend);
                instance.sendDataToController(dataToSend);
            });
        },
        sendDataToController: function(data) {
            $.ajax({
                method: "POST",
                url: "/finallaw/annotate",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend:function(){
                    //TODO: set busy to display loader
                },
                success : function(data){
                    console.log(data);
                },
                complete: function(){
                    //TODO: set not busy or display a message?
                }
            });
        },
        display: function(data){
            console.log(data);
            this.state.comment = data.comment;
            this.state.display = "in show";
            this.setState(this.state);
        },
        updateFinalLawDivDataTarget: function() {
            //we want to change the data-target value of the final law div to be unique
            $("#commentLawMatcher a[data-target^='#finalLawUploadedBody']").each(function(index){
                $(this).attr("data-target", "#finalLawAnnBody-" + $(this).attr("data-target").split("-")[1]);
                $(this).parent().next().attr("id", "finalLawAnnBody-" + $(this).attr("data-target").split("-")[1]);
            });
        },
        createAnnotationAreasForFinalLaw: function() {
            var finalLawAnn = new scify.Annotator("#commentLawMatcher .article-body, #commentLawMatcher .article-title-text", "fl-ann");
            finalLawAnn.init();
            $("#commentLawMatcher .fl-ann").append("<span class='fl-ann-icon' title='κλικ εδώ για δήλωση κειμένου που συμπεριελήφθη το σχόλιο'><input type='checkbox'></span>");

        },
        closeModal:function(){
            this.state.display = "";
            this.setState(this.state);
        },
        render: function() {

            var innerContent =  <scify.ReactLoader display={this.props.busy} />;

            if(!this.props.busy) {
                innerContent =
                    <div className="finalLawAnnModalContent">
                        <div id="finalLawAnnDiv" dangerouslySetInnerHTML={{__html:this.props.finalLawDiv}}></div>
                        <div className="annFinalLawComment">
                            <div className='body commentBox'>
                                <scify.Comment
                                    imagesPath = {this.props.imagesPath}
                                    key={this.props.comment.id}
                                    data={this.props.comment}
                                    shouldDisplayCommenterName={true}
                                    shouldDisplayEditIcon={false}
                                    shouldDisplayCommentEdited={true}
                                    shouldDisplayShareBtn={true}
                                    shouldDisplayCommentBody={true}
                                    shouldDisplayEmotion={true}
                                    shouldDisplayAnnotatedText={true}
                                    shouldDisplayReplyBox={false}
                                    shouldDisplayReplies={false}
                                    optionsEnabled={false}
                                    shouldDisplayTopics={true}
                                    commentClassNames="comment"
                                    shouldDisplayFinalLawAnnBtn={false}/>
                            </div>
                        </div>
                    </div>
            }
            return (
                <form id="FinalLawAnnForm">
                    <div id="finalLawCommentModal" className={ classNames("modal","fade","consFinalLawModal",this.state.display)} role="dialog">
                        <div className={ classNames("modal-backdrop","fade",this.state.display)} style={{height: 966 +"px"}}></div>
                        <div className="modal-dialog ">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h4 className="modal-title">Αντιστοίχηση σχολίου με τον τελικό νόμο <i className="fa fa-question-circle" title="Επεξήγηση"></i></h4>
                                    <button type="button" className="close" onClick={this.closeModal}>&times;</button>
                                </div>
                                <div className="modal-body">
                                    {{ innerContent }}
                                </div>
                                <div className="saveBtnContainer">
                                    <button id="saveFinalLawAnnotation" className="btn blue">Καταχώρηση</button>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" onClick={this.closeModal}>Κλείσιμο</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
    });

})()