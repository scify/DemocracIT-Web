"use strict";

(function () {

    window.scify.commentLawMatcher = React.createClass({
        displayName: "commentLawMatcher",

        getInitialState: function getInitialState() {
            return {
                comment: this.props.comment,
                display: "",
                finalLawId: this.props.finalLawId,
                annotators: [],
                showInnerModal: false,
                innerModalMessage: ""
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
                if (instance.props.userId == "") {
                    instance.showNotLoggedInModal();
                    return;
                }
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
                if (dataToSend.annotationIds.length == 0) {
                    instance.showNoAnnSelectedModal();
                }
                instance.sendDataToController(dataToSend);
            });
        },
        showNoAnnSelectedModal: function showNoAnnSelectedModal() {
            this.state.showInnerModal = true;
            this.state.innerModalMessage = "Παρακαλώ επιλέξτε τις περιοχές του τελικού νόμου στις οποίες ελήφθη υπ' όψη το σχόλιο.";
            this.setState(this.state);
        },
        showNotLoggedInModal: function showNotLoggedInModal() {
            this.state.showInnerModal = true;
            this.state.innerModalMessage = "Για αυτή την ενέργεια χρειάζεται να είστε <a href=\"/signIn?returnUrl=@request.uri\">συνδεδεμένοι</a>";
            this.setState(this.state);
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
        closeInnerModal: function closeInnerModal() {
            this.state.showInnerModal = false;
            this.setState(this.state);
            console.log(this.state.showInnerModal);
        },
        render: function render() {
            var annotatorBox = React.createElement("div", null);
            if (this.state.annotators.length > 0) {
                annotatorBox = React.createElement(AnnotationButtons, { annotators: this.state.annotators, commentId: this.state.comment.id, userId: this.props.userId });
            }
            var innerContent = React.createElement(scify.ReactLoader, { display: this.props.busy });
            var showInnerModalClasses = classNames("in show", { hide: !this.state.showInnerModal });
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
                            ),
                            React.createElement(
                                "div",
                                { id: "noRateModal", className: classNames("modal", "fade", showInnerModalClasses),
                                    role: "dialog" },
                                React.createElement("div", { className: classNames("modal-backdrop", "fade", showInnerModalClasses) }),
                                React.createElement(
                                    "div",
                                    { className: "modal-dialog" },
                                    React.createElement(
                                        "div",
                                        { className: "modal-content" },
                                        React.createElement(
                                            "div",
                                            { className: "modal-header" },
                                            React.createElement(
                                                "button",
                                                { type: "button", className: "close", id: "closeInnerModal", onClick: this.closeInnerModal },
                                                "×"
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "modal-body" },
                                            React.createElement(
                                                "div",
                                                { className: "notLoggedinWrapper" },
                                                React.createElement(
                                                    "div",
                                                    { className: "msg" },
                                                    React.createElement("i", { "class": "fa fa-exclamation-triangle" }),
                                                    React.createElement("p", { className: "notLoggedText", dangerouslySetInnerHTML: { __html: this.state.innerModalMessage } })
                                                )
                                            )
                                        ),
                                        React.createElement(
                                            "div",
                                            { className: "modal-footer" },
                                            React.createElement(
                                                "button",
                                                { className: "close btn red innerModalCloseBtn", type: "button", onClick: this.closeInnerModal },
                                                "Κλείσιμο"
                                            )
                                        )
                                    )
                                )
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
        //function to produce a random CSS color
        getRandomColor: function getRandomColor() {
            var letters = "0123456789ABCDEF".split("");
            var color = "#";
            for (var i = 0; i < 6; i++) {
                color += letters[Math.floor(Math.random() * 16)];
            }
            return color;
        },
        //function to handle click on annotator button
        handleMatchingBtn: function handleMatchingBtn(e) {
            e.preventDefault();
            var btnIndex = e.target.id.split("_")[1];
            var btnColor = $(e.target).css("background-color");
            var annotationDivs = this.state.annotators[btnIndex].annotationIds;

            $.each(annotationDivs, function (index, divDataId) {
                $("[data-id=" + divDataId + "]").css("background-color", btnColor);
                $("[data-id=" + divDataId + "]").css("color", "#fff");
            });
            if (!$("[data-id=" + annotationDivs[0] + "]").closest(".article-body").parent().hasClass("in")) $("[data-id=" + annotationDivs[0] + "]").closest(".article-body").parent().prev().find(".show-hide").trigger("click");
            var articleDomId = $("[data-id=" + annotationDivs[0] + "]").closest(".article-body").parent().attr("id");
            this.scrollToTargetDiv(articleDomId);
        },
        //function to scroll to the target div of comment - final law matched areas
        scrollToTargetDiv: function scrollToTargetDiv(targetDivId) {
            //distOfTarget is the distance (number of pixels) between the div we want to scroll to and the top
            var distOfTarget = $("#" + targetDivId).offset().top;
            //distOfTopDiv is the distance (number of pixels) between the top and the parent div
            var distOfTopDiv = $("#finalLawAnnDiv").offset().top;
            console.log($("#finalLawAnnDiv").scrollTop());
            //initialScroll is the difference between the top and the current position of the scrollbar
            var initialScroll = $("#finalLawAnnDiv").scrollTop();
            $("#finalLawAnnDiv").animate({ scrollTop: distOfTarget - distOfTopDiv + initialScroll }, 500);
        },
        //function to produce a button for each user that has matched the comment with the final law
        renderAnnotatorBtns: function renderAnnotatorBtns() {
            var instance = this;
            var annotatorIndex = 0;
            //for each annotator User, we should create a button element
            var annotatorBtns = this.state.annotators.map(function (annotatorObj) {
                var btnId = "finalLawMatch_" + annotatorIndex;
                annotatorIndex++;
                //each button should have a random color
                var btnRandomColor = {
                    backgroundColor: instance.getRandomColor() + " !important"
                };
                return React.createElement(
                    "button",
                    { id: btnId, className: "btn blue annotatorBtn", onClick: instance.handleMatchingBtn, style: btnRandomColor },
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