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
                innerModalMessage: "",
                annotationDivBusy: false,
                submitBtnText: this.props.messages.submitbtn,
                shouldDisplaySubmitBtn: this.props.shouldDisplaySubmitBtn,
                messages: this.props.messages
            };
        },
        componentDidMount: function componentDidMount() {
            this.updateFinalLawDivDataTarget();
            this.createAnnotationAreasForFinalLaw();
            this.formSubmitHandler();
            this.highlightCheckedAreaListener();
        },
        //function to highlight appropriate area on checkbox checked
        highlightCheckedAreaListener: function highlightCheckedAreaListener() {
            $(".fl-ann-icon").find("input:checkbox").on("click", function () {
                if ($(this).is(":checked")) {
                    $(this).parent().parent().css("background-color", "lightblue");
                    $(this).parent().parent().css("color", "#fff");
                } else {
                    $(this).parent().parent().css("background-color", "#fff");
                    $(this).parent().parent().css("color", "#000");
                }
            });
        },
        //function to clear all selected checkboxes
        clearAnnotationForm: function clearAnnotationForm() {
            var inputs = $("#FinalLawAnnForm :input");
            $(inputs).each(function () {
                if (this.type == "checkbox") {
                    if ($(this).is(":checked")) {
                        $(this).attr("checked", false);
                    }
                }
            });
            $("[data-id^=\"fl-ann\"]").css("background-color", "#fff");
            $("[data-id^=\"fl-ann\"]").css("color", "#000");
        },
        //function that handles annotation form submission
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
                if (dataToSend.annotationIds.length == 0) {
                    instance.showNoAnnSelectedModal();
                    return;
                }
                instance.sendDataToController(dataToSend);
            });
        },
        //function to check if the logged in user has already matched the comment with the final law
        checkIfTheUserHasAnnotated: function checkIfTheUserHasAnnotated() {
            var instance = this;
            var answer = false;
            $.each(this.state.annotators, function (index, annotator) {
                if (annotator.userId == instance.props.userId) {
                    answer = true;
                }
            });
            return answer;
        },
        //function to show appropriate modal for empty form submissions (no annotation areas selected)
        showNoAnnSelectedModal: function showNoAnnSelectedModal() {
            this.state.showInnerModal = true;
            this.state.innerModalMessage = this.state.messages.matchingNoAnn;
            this.setState(this.state);
        },
        //function to show appropriate modal for for not logged in user
        showNotLoggedInModal: function showNotLoggedInModal() {
            this.state.showInnerModal = true;
            this.state.innerModalMessage = this.state.messages.notlogedintext;
            this.setState(this.state);
        },
        //function to update the text of submit button
        updateSubmitBtnText: function updateSubmitBtnText() {
            if (this.checkIfTheUserHasAnnotated()) {
                this.state.submitBtnText = this.state.messages.editMatching;
                this.setState(this.state);
            }
        },
        // function to send form submission data to controller
        sendDataToController: function sendDataToController(data) {
            var dataToSend = data;
            var instance = this;
            var url = "/finallaw/annotate";
            if (this.checkIfTheUserHasAnnotated()) url = "/finallaw/annotate/update";
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(data),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend: function beforeSend() {
                    instance.state.annotationDivBusy = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    var newAnnObj = {
                        annotationIds: dataToSend.annotationIds,
                        commentId: dataToSend.commentId,
                        userId: instance.props.userId,
                        userName: data
                    };
                    console.log(newAnnObj);
                    if (instance.checkIfTheUserHasAnnotated()) instance.replaceAnnotation(newAnnObj);else instance.addToAnnotatorsArr(newAnnObj);
                },
                complete: function complete() {
                    instance.state.annotationDivBusy = false;
                    instance.setState(instance.state);

                    console.log(instance.checkIfTheUserHasAnnotated());
                    instance.updateSubmitBtnText();
                }
            });
        },
        //function to replace existing annotation object after annotation update
        replaceAnnotation: function replaceAnnotation(updatedAnnotator) {
            var instance = this;
            $.each(this.state.annotators, function (index, annotator) {
                if (annotator.userId == updatedAnnotator.userId) {
                    instance.state.annotators[index] = updatedAnnotator;
                    return;
                }
            });
        },
        //function to add new annotation object to annotators array
        addToAnnotatorsArr: function addToAnnotatorsArr(newAnnotator) {
            this.state.annotators.push(newAnnotator);
            this.setState(this.state);
        },
        //function to fetch initial annotation data (comment-final law matches)
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
                beforeSend: function beforeSend() {
                    instance.state.annotationDivBusy = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    console.log(data);
                    instance.state.annotators = data;
                    instance.setState(instance.state);
                },
                complete: function complete() {
                    instance.state.annotationDivBusy = false;
                    instance.setState(instance.state);
                    instance.clearAnnotationForm();
                    instance.updateSubmitBtnText();
                }
            });
        },
        //function to display the whole React class
        display: function display(data) {
            this.state.comment = data.comment;
            this.state.display = "in show";
            this.setState(this.state);
            if (this.props.finalLawDiv != undefined) this.fetchAnnotationData();
        },
        updateFinalLawDivDataTarget: function updateFinalLawDivDataTarget() {
            //we want to change the data-target value of the final law div to be unique
            $("#commentLawMatcher a[data-target^='#finalLawUploadedBody']").each(function (index) {
                $(this).attr("data-target", "#finalLawAnnBody-" + $(this).attr("data-target").split("-")[1]);
                $(this).parent().next().attr("id", "finalLawAnnBody-" + $(this).attr("data-target").split("-")[1]);
            });
        },
        //function to initialize Annotator for final law text and attach checkboxes
        createAnnotationAreasForFinalLaw: function createAnnotationAreasForFinalLaw() {
            var finalLawAnn = new scify.Annotator("#commentLawMatcher .article-body, #commentLawMatcher .article-title-text", "fl-ann");
            finalLawAnn.init();
            $("#commentLawMatcher .fl-ann").prepend("<div class='fl-ann-icon' title='" + this.state.messages.matchingPrompt + "'><input type='checkbox'></div>");
            $("#commentLawMatcher .fl-ann").wrap("<div class=\"annotatableArea\"></div>>");
        },
        closeModal: function closeModal() {
            this.state.display = "";
            this.setState(this.state);
            this.clearAnnotationForm();
        },
        closeInnerModal: function closeInnerModal() {
            this.state.showInnerModal = false;
            this.setState(this.state);
            console.log(this.state.showInnerModal);
        },
        render: function render() {
            var finalLawDiv = this.props.finalLawDiv;
            var finalLawHtml = React.createElement("div", { id: "finalLawAnnDiv", dangerouslySetInnerHTML: { __html: this.props.finalLawDiv } });
            var url = window.location.href;
            if (url.indexOf("?target=finalLaw") == -1) url += "?target=finalLaw";
            if (finalLawDiv == undefined) {
                finalLawHtml = React.createElement(
                    "div",
                    { id: "finalLawAnnDiv", className: "noFinalLawText" },
                    this.state.messages.matchingNoLaw1,
                    " ",
                    React.createElement(
                        "a",
                        { href: url },
                        this.state.messages.here
                    )
                );
            }
            var annotatorBox = React.createElement("div", null);
            if (this.state.annotationDivBusy) {
                annotatorBox = React.createElement(
                    "div",
                    { className: "annotatorBtnContainer" },
                    React.createElement(scify.ReactLoader, { display: this.state.annotationDivBusy })
                );
            } else {
                if (this.state.annotators.length > 0) {
                    annotatorBox = React.createElement(AnnotationButtons, { annotators: this.state.annotators, commentId: this.state.comment.id,
                        userId: this.props.userId,
                        messages: this.state.messages });
                } else {
                    annotatorBox = React.createElement(
                        "div",
                        { className: "noAnnotators" },
                        this.state.messages.commentNotMatched,
                        React.createElement("br", null),
                        this.state.messages.commentNotMatchedExpl,
                        " ",
                        React.createElement("i", { className: "fa fa-arrow-right" })
                    );
                }
            }
            var innerContent = React.createElement(scify.ReactLoader, { display: this.props.busy });
            var showInnerModalClasses = classNames("in show", { hide: !this.state.showInnerModal });
            if (this.state.shouldDisplaySubmitBtn) var submitBtn = React.createElement(
                "button",
                { id: "saveFinalLawAnnotation", className: "btn blue" },
                this.state.submitBtnText
            );
            if (!this.props.busy) {
                innerContent = React.createElement(
                    "div",
                    { className: "finalLawAnnModalContent" },
                    finalLawHtml,
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
                                shouldDisplayFinalLawAnnBtn: false,
                                shouldDisplayReportAction: false,
                                messages: this.state.messages }),
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
                                                    React.createElement("i", { className: "fa fa-exclamation-triangle" }),
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
                                                this.state.messages.closebtn
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
                                    this.state.messages.commentFLMatchingTitle,
                                    " ",
                                    React.createElement("i", { className: "fa fa-question-circle", title: this.state.messages.commentFLMatchingTitle })
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
                                submitBtn
                            ),
                            React.createElement(
                                "div",
                                { className: "modal-footer" },
                                React.createElement(
                                    "button",
                                    { type: "button", className: "btn btn-default", onClick: this.closeModal },
                                    this.state.messages.closebtn
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
                commentId: this.props.commentId,
                messages: this.props.messages
            };
        },
        //function to produce a random CSS color
        getRandomColor: function getRandomColor() {
            var letters = "0123456701AB0123".split("");
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
                React.createElement(
                    "div",
                    { className: "annotatorsAreaTitle" },
                    this.state.messages.commentFLMatchingSeeUsersTitle,
                    ":"
                ),
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

//# sourceMappingURL=commentLawMatcher-compiled.js.map