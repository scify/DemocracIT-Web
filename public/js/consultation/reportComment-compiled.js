"use strict";

(function () {

    window.scify.reportComment = React.createClass({
        displayName: "reportComment",

        getInitialState: function getInitialState() {
            return {
                comment: this.props.comment,
                display: false
            };
        },
        //function to display the whole React class
        display: function display(data) {
            this.state.comment = data.comment;
            this.state.display = true;
            this.state.busy = true;
            console.log(this.props.userId);
            //if the user is not logged in
            if (this.props.userId == undefined || this.props.userId == "") {
                this.state.busy = false;
                this.state.message = React.createElement(
                    "div",
                    null,
                    "Για αυτή την ενέργεια χρειάζεται να είστε ",
                    React.createElement(
                        "a",
                        { href: "/signIn?returnUrl=@request.uri" },
                        "συνδεδεμένοι"
                    )
                );
            } else {
                //check if the logged in user has already reported this comment
                this.checkIfUserHasReportedThisComment(this.state.comment.id);
            }
            this.setState(this.state);
        },
        checkIfUserHasReportedThisComment: function checkIfUserHasReportedThisComment(commentId) {
            var instance = this;
            $.ajax({
                method: "GET",
                url: "/comment/report/check/" + commentId,
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    if (data == false) {
                        instance.state.shouldDisplaySubmitBtn = true;
                        instance.state.message = "Αν είστε σίγουροι ότι αυτό το σχόλιο είναι υβριστικό, πατήστε \"Αναφορά\":";
                    } else {
                        instance.state.shouldDisplaySubmitBtn = false;
                        instance.state.message = "Έχετε ήδη αναφέρει αυτό το σχόλιο ως υβριστικό";
                    }
                    instance.setState(instance.state);
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.setState(instance.state);
                }
            });
        },
        reportComment: function reportComment() {
            var instance = this;
            $.ajax({
                method: "POST",
                url: "/comment/report",
                data: JSON.stringify({ commentId: instance.state.comment.id }),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    instance.state.shouldDisplaySubmitBtn = false;
                    instance.state.message = "Η αναφορά καταχωρήθηκε. Πατήστε \"Κλείσιμο\" για να επιστρέψετε στην προηγούμενη σελίδα.";
                    instance.setState(instance.state);
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.setState(instance.state);
                }
            });
        },
        closeModal: function closeModal() {
            this.state.display = false;
            this.setState(this.state);
        },
        render: function render() {
            var showReportCommentModal = classNames("hide");
            var innerContent = React.createElement(
                "div",
                { className: "reportCommentMsg" },
                this.state.message
            );
            if (this.state.display) showReportCommentModal = classNames("in show");
            if (this.state.busy) innerContent = React.createElement(
                "div",
                { className: "reportCommentMsg" },
                React.createElement(scify.ReactLoader, { display: this.state.busy })
            );
            if (this.state.shouldDisplaySubmitBtn && this.props.userId != undefined) var submitBtn = React.createElement(
                "button",
                { id: "saveCommentReport", className: "btn blue", onClick: this.reportComment },
                "Αναφορά"
            );

            return React.createElement(
                "div",
                { id: "reportCommentModal", className: classNames("modal", "fade", showReportCommentModal), role: "dialog" },
                React.createElement("div", { className: classNames("modal-backdrop", "fade", showReportCommentModal) }),
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
                                "Αναφορά σχολίου ως υβριστικό ",
                                React.createElement("i", { className: "fa fa-question-circle", title: "Αφορά σχόλια με υβριστικό περιεχόμενο" })
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
                                    shouldDisplayReportAction: false })
                            ),
                            innerContent
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
                                "Κλείσιμο"
                            )
                        )
                    )
                )
            );
        }
    });
})();

//# sourceMappingURL=reportComment-compiled.js.map