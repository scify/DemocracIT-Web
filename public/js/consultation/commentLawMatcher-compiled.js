"use strict";

(function () {

    window.scify.commentLawMatcher = React.createClass({
        displayName: "commentLawMatcher",

        getInitialState: function getInitialState() {
            return {
                comment: this.props.comment,
                display: "",
                finalLawId: this.props.finalLawId,
                annotators: []
            };
        },
        componentDidMount: function componentDidMount() {
            this.updateFinalLawDivDataTarget();
            this.createAnnotationAreasForFinalLaw();
            this.formSubmitHandler();
        },
        //TODO: implement clearForm function to clear all selected checkboxes

        formSubmitHandler: function formSubmitHandler() {
            var instance = this;
            $("#saveFinalLawAnnotation").on("click", function (e) {

                e.preventDefault();
                var inputs = $("#FinalLawAnnForm :input");
                var values = [];
                var index = 0;
                $(inputs).each(function () {
                    if (this.type == "checkbox") {
                        if ($(this).is(":checked")) {
                            var dataId = $(this).parent().parent().attr("data-id");
                            values[index] = dataId;
                            index++;
                        }
                    }
                });
                var dataToSend = {
                    annotationIds: values,
                    finalLawId: instance.state.finalLawId,
                    commentId: instance.state.comment.id
                };
                console.log(dataToSend);
                instance.sendDataToController(dataToSend);
            });
        },
        sendDataToController: function sendDataToController(data) {

            $.ajax({
                method: "POST",
                url: "/finallaw/annotate",
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend: function beforeSend() {},
                success: function success(data) {
                    console.log(data);
                },
                complete: function complete() {}
            });
        },
        fetchAnnotationData: function fetchAnnotationData() {
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
                beforeSend: function beforeSend() {},
                success: function success(data) {
                    console.log(data);
                    instance.state.annotators = data;
                    instance.setState(instance.state);
                },
                complete: function complete() {}
            });
        },
        display: function display(data) {
            this.state.comment = data.comment;
            this.state.display = "in show";
            this.setState(this.state);
            this.fetchAnnotationData();
        },
        updateFinalLawDivDataTarget: function updateFinalLawDivDataTarget() {
            //we want to change the data-target value of the final law div to be unique
            $("#commentLawMatcher a[data-target^='#finalLawUploadedBody']").each(function (index) {
                $(this).attr("data-target", "#finalLawAnnBody-" + $(this).attr("data-target").split("-")[1]);
                $(this).parent().next().attr("id", "finalLawAnnBody-" + $(this).attr("data-target").split("-")[1]);
            });
        },
        createAnnotationAreasForFinalLaw: function createAnnotationAreasForFinalLaw() {
            var finalLawAnn = new scify.Annotator("#commentLawMatcher .article-body, #commentLawMatcher .article-title-text", "fl-ann");
            finalLawAnn.init();
            $("#commentLawMatcher .fl-ann").append("<span class='fl-ann-icon' title='κλικ εδώ για δήλωση κειμένου που συμπεριελήφθη το σχόλιο'><input type='checkbox'></span>");
        },
        closeModal: function closeModal() {
            this.state.display = "";
            this.setState(this.state);
        },
        render: function render() {
            var annotatorBox = React.createElement("div", null);
            if (this.state.annotators.length > 0) {
                annotatorBox = React.createElement(AnnotationButtons, { annotators: this.state.annotators, commentId: this.state.comment.id });
            }
            var innerContent = React.createElement(scify.ReactLoader, { display: this.props.busy });

            if (!this.props.busy) {
                innerContent = React.createElement(
                    "div",
                    { className: "finalLawAnnModalContent" },
                    React.createElement("div", { id: "finalLawAnnDiv", dangerouslySetInnerHTML: { __html: this.props.finalLawDiv } }),
                    React.createElement(
                        "div",
                        { className: "annFinalLawComment" },
                        React.createElement(
                            "div",
                            { className: "body commentBox" },
                            React.createElement(scify.Comment, {
                                imagesPath: this.props.imagesPath,
                                key: this.props.comment.id,
                                data: this.props.comment,
                                shouldDisplayCommenterName: true,
                                shouldDisplayEditIcon: false,
                                shouldDisplayCommentEdited: true,
                                shouldDisplayShareBtn: false,
                                shouldDisplayCommentBody: true,
                                shouldDisplayEmotion: true,
                                shouldDisplayAnnotatedText: true,
                                shouldDisplayReplyBox: false,
                                shouldDisplayReplies: false,
                                optionsEnabled: false,
                                shouldDisplayTopics: true,
                                commentClassNames: "comment",
                                shouldDisplayFinalLawAnnBtn: false }),
                            React.createElement(
                                "div",
                                { className: "annotatorBox" },
                                annotatorBox
                            )
                        )
                    )
                );
            }
            return React.createElement(
                "form",
                { id: "FinalLawAnnForm" },
                React.createElement(
                    "div",
                    { id: "finalLawCommentModal", className: classNames("modal", "fade", "consFinalLawModal", this.state.display), role: "dialog" },
                    React.createElement("div", { className: classNames("modal-backdrop", "fade", this.state.display), style: { height: 966 + "px" } }),
                    React.createElement(
                        "div",
                        { className: "modal-dialog " },
                        React.createElement(
                            "div",
                            { className: "modal-content" },
                            React.createElement(
                                "div",
                                { className: "modal-header" },
                                React.createElement(
                                    "h4",
                                    { className: "modal-title" },
                                    "Αντιστοίχηση σχολίου με τον τελικό νόμο ",
                                    React.createElement("i", { className: "fa fa-question-circle", title: "Επεξήγηση" })
                                ),
                                React.createElement(
                                    "button",
                                    { type: "button", className: "close", onClick: this.closeModal },
                                    "×"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-body" },
                                { innerContent: innerContent }
                            ),
                            React.createElement(
                                "div",
                                { className: "saveBtnContainer" },
                                React.createElement(
                                    "button",
                                    { id: "saveFinalLawAnnotation", className: "btn blue" },
                                    "Καταχώρηση"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-default", onClick: this.closeModal },
                                    "Κλείσιμο"
                                )
                            )
                        )
                    )
                )
            );
        }
    });

    var AnnotationButtons = React.createClass({
        displayName: "AnnotationButtons",

        getInitialState: function getInitialState() {
            return {
                annotators: this.props.annotators,
                commentId: this.props.commentId
            };
        },
        renderAnnotatorBtns: function renderAnnotatorBtns() {
            console.log(this.state.annotators);
            var annotatorBtns = this.state.annotators.map(function (annotatorObj) {
                return React.createElement(
                    "button",
                    { id: "saveFinalLawAnnotation", className: "btn blue" },
                    annotatorObj.userName
                );
            });
            var annotatorBtnContainer = this.state.annotators.length > 0 ? React.createElement(
                "div",
                { id: "annotatorBtnContainer_" + this.state.commentId, className: "annotatorBtnContainer" },
                annotatorBtns
            ) : "";
            return annotatorBtnContainer;
        },
        render: function render() {

            return React.createElement(
                "div",
                null,
                this.renderAnnotatorBtns()
            );
        }
    });
})();

//TODO: set busy to display loader

//TODO: set not busy or display a message?

//TODO: set busy to display loader

//TODO: set not busy or display a message?

//# sourceMappingURL=commentLawMatcher-compiled.js.map