"use strict";

(function () {

    scify.UserBox = React.createClass({
        displayName: "UserBox",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user,
                comments: [],
                busy: false,
                display: false,
                commentsCount: this.props.commentsCount
            };
        },
        setVisibibility: function setVisibibility(display) {
            this.state.display = display;
            this.setState(this.state);
        },
        refreshComments: function refreshComments() {
            var instance = this;
            if (instance.state.commentsCount > instance.state.comments.length) instance.getCommentsFromServer.call(instance);else if (instance.state.display) instance.setVisibibility.call(instance, false);else instance.setVisibibility.call(instance, true);
        },
        getCommentsFromServer: function getCommentsFromServer() {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/cons/retrieve",
                cache: false,
                data: {
                    consultationId: this.props.consultationid,
                    userId: this.props.userId
                },
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    instance.state.comments = data;
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function error(x, z, y) {
                    console.log(x);
                }
            });

            return promise;
        },
        render: function render() {
            return React.createElement(
                "div",
                { className: "", onClick: this.refreshComments },
                React.createElement(
                    "a",
                    null,
                    this.props.user.first_name,
                    " ",
                    this.props.user.last_name
                ),
                React.createElement(scify.InfoBox, { imagesPath: this.props.imagesPath, display: this.state.display, busy: this.state.busy, data: this.state.comments })
            );
        }
    });

    scify.InfoBox = React.createClass({
        displayName: "InfoBox",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user,
                display: this.props.display
            };
        },
        render: function render() {
            var instance = this;
            if (this.props.display) {
                if (this.props.busy) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(scify.ReactLoader, { display: this.props.busy })
                    );
                }
                var commentNodes = this.props.data.map(function (commentWithArticleName) {
                    commentWithArticleName.comment.userAnnotatedText = commentWithArticleName.article_name;
                    //define the source as Democracit
                    commentWithArticleName.comment.source.commentSource = 2;
                    var comment = commentWithArticleName.comment;
                    return React.createElement(scify.Comment, {
                        imagesPath: instance.props.imagesPath,
                        key: commentWithArticleName.comment.id,
                        data: comment,
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
                        shouldDisplayFinalLawAnnBtn: false });
                });
                return React.createElement(
                    "div",
                    { className: "commentList" },
                    commentNodes
                );
            } else {
                return React.createElement("div", null);
            }
        }
    });
})();

//# sourceMappingURL=userBox-compiled.js.map