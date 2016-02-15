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
            console.log(data);
            this.state.comment = data.comment;
            this.state.display = true;
            this.state.busy = true;
            this.setState(this.state);
            //TODO: fetch report data
            /*if(this.props.finalLawDiv != undefined)
                this.fetchAnnotationData();*/
        },
        closeModal: function closeModal() {
            this.state.display = false;
            this.setState(this.state);
        },
        render: function render() {
            var showReportCommentModal = classNames("hide");
            if (this.state.display) showReportCommentModal = classNames("in show");
            if (this.state.busy) var innerContent = React.createElement(scify.ReactLoader, { display: this.state.busy });
            return React.createElement(
                "div",
                { id: "reporterCommentModal", className: classNames("modal", "fade", showReportCommentModal), role: "dialog" },
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
                        React.createElement("div", { className: "saveBtnContainer" }),
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