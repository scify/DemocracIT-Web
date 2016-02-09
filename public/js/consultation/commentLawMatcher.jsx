(function(){

    window.scify.commentLawMatcher = React.createClass({
        getInitialState: function() {
            return {
                comment : this.props.comment,
                display :"",
                finalLawId: this.props.finalLawId,
                annotators: [],
                showInnerModal: false,
                innerModalMessage: ""
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
                if(instance.props.userId == "") {
                    instance.showNotLoggedInModal();
                    return;
                }
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
                    finalLawId:instance.state.finalLawId,
                    commentId:instance.state.comment.id
                };
                console.log(dataToSend);
                if(dataToSend.annotationIds.length == 0) {
                    instance.showNoAnnSelectedModal();
                }
                instance.sendDataToController(dataToSend);
            });
        },
        showNoAnnSelectedModal() {
            this.state.showInnerModal = true;
            this.state.innerModalMessage = "Παρακαλώ επιλέξτε τις περιοχές του τελικού νόμου στις οποίες ελήφθη υπ' όψη το σχόλιο.";
            this.setState(this.state);
        },
        showNotLoggedInModal() {
            this.state.showInnerModal = true;
            this.state.innerModalMessage = 'Για αυτή την ενέργεια χρειάζεται να είστε <a href="/signIn?returnUrl=@request.uri">συνδεδεμένοι</a>';
            this.setState(this.state);
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
        fetchAnnotationData: function() {
            var instance = this;
            var dataToSend = {
                commentId: this.state.comment.id,
                finalLawId: this.state.finalLawId
            };
            $.ajax({
                method: "GET",
                url: "/finallaw/annotations/get",
                data: dataToSend,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend:function(){
                    //TODO: set busy to display loader
                },
                success : function(data){
                    console.log(data);
                    instance.state.annotators = data;
                    instance.setState(instance.state);
                },
                complete: function(){
                    //TODO: set not busy or display a message?
                }
            });
        },
        display: function(data){
            this.state.comment = data.comment;
            this.state.display = "in show";
            this.setState(this.state);
            this.fetchAnnotationData();
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
        closeInnerModal: function() {
            this.state.showInnerModal = false;
            this.setState(this.state);
            console.log(this.state.showInnerModal);
        },
        render: function() {
            var annotatorBox = <div></div>;
            if(this.state.annotators.length > 0) {
                annotatorBox = <AnnotationButtons annotators={this.state.annotators} commentId={this.state.comment.id} userId={this.props.userId}/>
            }
            var innerContent =  <scify.ReactLoader display={this.props.busy} />;
            var showInnerModalClasses = classNames("in show",{ hide :!this.state.showInnerModal});
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
                                    shouldDisplayShareBtn={false}
                                    shouldDisplayCommentBody={true}
                                    shouldDisplayEmotion={true}
                                    shouldDisplayAnnotatedText={true}
                                    shouldDisplayReplyBox={false}
                                    shouldDisplayReplies={false}
                                    optionsEnabled={false}
                                    shouldDisplayTopics={true}
                                    commentClassNames="comment"
                                    shouldDisplayFinalLawAnnBtn={false}/>
                                <div className="annotatorBox">
                                    {annotatorBox}
                                </div>
                                <div id="noRateModal" className={ classNames("modal","fade", showInnerModalClasses)}
                                     role="dialog">
                                    <div className={ classNames("modal-backdrop","fade",showInnerModalClasses)}></div>
                                    <div className="modal-dialog">
                                        <div className="modal-content">
                                            <div className="modal-header">
                                                <button type="button" className="close" id="closeInnerModal" onClick={this.closeInnerModal}>&times;</button>
                                            </div>
                                            <div className="modal-body">
                                                <div className="notLoggedinWrapper">
                                                    <div className="msg"><i class="fa fa-exclamation-triangle"></i>
                                                        <p className="notLoggedText" dangerouslySetInnerHTML={{__html:this.state.innerModalMessage}}></p></div>
                                                </div>
                                            </div>

                                            <div className="modal-footer">
                                                <button className="close btn red innerModalCloseBtn" type="button" onClick={this.closeInnerModal}>Κλείσιμο</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
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

    var AnnotationButtons = React.createClass({
        getInitialState: function() {
            return {
                annotators: this.props.annotators,
                commentId: this.props.commentId
            };
        },
        //function to produce a random CSS color
        getRandomColor: function() {
            var letters = '0123456789ABCDEF'.split('');
            var color = '#';
            for (var i = 0; i < 6; i++ ) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        //function to handle click on annotator button
        handleMatchingBtn: function(e) {
            e.preventDefault();
            var btnIndex = e.target.id.split("_")[1];
            var btnColor = $(e.target).css("background-color");
            var annotationDivs = this.state.annotators[btnIndex].annotationIds;

            $.each( annotationDivs, function( index, divDataId ) {
                $("[data-id=" + divDataId + "]").css("background-color", btnColor);
                $("[data-id=" + divDataId + "]").css("color", "#fff");
            });
            if(!$("[data-id=" + annotationDivs[0] + "]").closest(".article-body").parent().hasClass("in"))
                $("[data-id=" + annotationDivs[0] + "]").closest(".article-body").parent().prev().find(".show-hide").trigger("click");
            var articleDomId = $("[data-id=" + annotationDivs[0] + "]").closest(".article-body").parent().attr("id");
            this.scrollToTargetDiv(articleDomId);
        },
        //function to scroll to the target div of comment - final law matched areas
        scrollToTargetDiv: function(targetDivId) {
            //distOfTarget is the distance (number of pixels) between the div we want to scroll to and the top
            var distOfTarget = $('#' + targetDivId).offset().top;
            //distOfTopDiv is the distance (number of pixels) between the top and the parent div
            var distOfTopDiv = $('#finalLawAnnDiv').offset().top;
            console.log($('#finalLawAnnDiv').scrollTop());
            //initialScroll is the difference between the top and the current position of the scrollbar
            var initialScroll = $('#finalLawAnnDiv').scrollTop();
            $("#finalLawAnnDiv").animate({ scrollTop: distOfTarget - distOfTopDiv  + initialScroll }, 500);
        },
        //function to produce a button for each user that has matched the comment with the final law
        renderAnnotatorBtns: function() {
            var instance = this;
            var annotatorIndex = 0;
            //for each annotator User, we should create a button element
            var annotatorBtns = this.state.annotators.map(function (annotatorObj){
                var btnId = "finalLawMatch_" + annotatorIndex;
                annotatorIndex ++;
                //each button should have a random color
                var btnRandomColor = {
                    backgroundColor: instance.getRandomColor() + " !important"
                };
                return(
                    <button id={btnId} className="btn blue annotatorBtn" onClick={instance.handleMatchingBtn} style={btnRandomColor}>{annotatorObj.userName}</button>
                );
            });
            var annotatorBtnContainer = this.state.annotators.length > 0 ?
                <div id={"annotatorBtnContainer_" + this.state.commentId} className="annotatorBtnContainer">
                    {annotatorBtns}
                </div>:"";
            return (annotatorBtnContainer);

        },
        render: function() {

            return(
                <div>
                    {this.renderAnnotatorBtns()}
                </div>
            );
        }
    });

})()