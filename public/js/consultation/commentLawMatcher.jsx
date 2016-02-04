(function(){

    window.scify.commentLawMatcher = React.createClass({
        getInitialState: function() {
            return {
                comment : this.props.comment,
                display :""
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
                console.log("click");
                var inputs = $("#FinalLawAnnForm :input");
                var values = {};
                var index = 0;
                $(inputs).each(function() {
                    if(this.type == "checkbox") {
                        if($(this).is(':checked')) {
                            console.log($(this).parent().parent().attr("data-id"));
                            var dataId = $(this).parent().parent().attr("data-id");
                            values[index] = dataId;
                            index++;
                        }
                    }
                });
                console.log(values);
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
            //$("#" + this.state.divId + "#finalLawAnnDiv").removeAttr("id");
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
                var iconsClasses = classNames("icons",
                    {
                        hide: this.props.comment.source.commentSource == 2 ||
                        this.props.comment.dateAdded < this.props.consultationEndDate
                    });
                console.log(this.props.finalLawDiv);
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
                                    <button type="button" className="close" data-dismiss="modal">&times;</button>
                                </div>
                                <div className="modal-body">
                                    {{ innerContent }}
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn btn-default" data-dismiss="modal">Κλείσιμο</button>
                                    <button id="saveFinalLawAnnotation" className="btn blue">Καταχώρηση</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            );
        }
    });

})()