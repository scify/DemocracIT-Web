"use strict";

(function () {

    scify.CommentBox = React.createClass({
        displayName: "CommentBox",

        getInitialState: function getInitialState() {
            return { comments: [],
                discussionThreadId: this.props.discussionthreadid,
                commentsCount: this.props.commentsCount
            };
        },
        getCommentsFromServer: function getCommentsFromServer(url) {
            var instance = this;

            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve",
                cache: false,
                data: {
                    consultationId: this.props.consultationid,
                    articleId: this.props.articleid,
                    source: this.props.source,
                    discussionthreadid: this.state.discussionthreadid,
                    discussionthreadclientid: this.props.discussionthreadclientid
                },
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    instance.state.comments = data;
                    instance.state.busy = false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function error(x, z, y) {
                    alert(x);
                }
            });

            return promise;
        },
        saveComment: function saveComment(url, data) {
            var instance = this;

            var postedData = {
                consultationId: this.props.consultationid,
                articleId: this.props.articleid,
                body: data.body,
                annotationTagId: data.annotationTagId, //the id from the select box
                annotationTagText: data.annotationTagText, //the text from the select box
                userAnnotatedText: data.userAnnotatedText, //the user user annotated
                discussionThreadId: instance.state.discussionthreadid,
                discussionthreadclientid: this.props.discussionthreadclientid, //the id generated by javascript
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text

                fullName: this.props.fullName,
                dateAdded: new Date()
            };

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data: postedData,
                beforeSend: function beforeSend() {
                    instance.state.display = true;
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(comment) {
                    instance.state.discussionthreadid = comment.discussionThread.id; //set discussion thread to state

                    instance.state.commentsCount = instance.state.commentsCount + 1;
                    //attach first
                    instance.state.comments.push(comment);
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.state.display = instance.state.comments.length > 0;
                    instance.setState(instance.state);
                }
            });
        },
        setVisibibility: function setVisibibility(display) {
            this.state.display = display;
            this.setState(this.state);
        },
        refreshComments: function refreshComments() {
            var instance = this;
            if (instance.state.commentsCount > instance.state.comments.length) instance.getCommentsFromServer.call(instance);else if (instance.state.display) instance.setVisibibility.call(instance, false);else instance.setVisibibility.call(instance, true);
        },
        toogleBox: function toogleBox() {
            this.state.display = !this.state.display;
            this.setState(this.state);
        },
        shouldDisplayLoadMoreOption: function shouldDisplayLoadMoreOption() {
            return this.state.commentsCount > this.state.comments.length;
        },
        render: function render() {
            if (this.state.busy) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(TotalCommentsLink, { onClick: this.refreshComments, count: this.state.commentsCount }),
                    React.createElement(
                        "div",
                        { className: "loading-wrp" },
                        React.createElement(
                            "div",
                            { className: "spinner-loader" },
                            "..."
                        )
                    )
                );
            }
            var topClasses = classNames({ hide: this.state.commentsCount == 0 });
            var commendBoxclasses = classNames("commentBox", { hide: !this.state.display });
            var loadMoreClasses = classNames("load-more", { hide: !this.shouldDisplayLoadMoreOption() });
            return React.createElement(
                "div",
                { className: topClasses },
                React.createElement(TotalCommentsLink, { onClick: this.refreshComments, count: this.state.commentsCount, source: this.props.source }),
                React.createElement(
                    "div",
                    { className: commendBoxclasses },
                    React.createElement(
                        "div",
                        { className: loadMoreClasses },
                        React.createElement(
                            "a",
                            { onClick: this.refreshComments },
                            "φόρτωση ολων των σχολίων"
                        )
                    ),
                    React.createElement(CommentList, { data: this.state.comments }),
                    React.createElement(CommentForm, null)
                )
            );
        }
    });
    var TotalCommentsLink = React.createClass({
        displayName: "TotalCommentsLink",

        handleClick: function handleClick() {
            this.props.onClick();
        },
        render: function render() {

            var label = "σχόλια";
            if (this.props.count == 1) label = "σχόλιο";

            if (this.props.source && this.props.source == "opengov") label += " απο το opengov";

            if (this.props.count > 0) return React.createElement(
                "a",
                { className: "load", onClick: this.handleClick },
                this.props.count,
                " ",
                label,
                " "
            );else //todo: how can i return an empty element?
                return React.createElement("span", null);
        }
    });
    var CommentForm = React.createClass({
        displayName: "CommentForm",

        render: function render() {
            return React.createElement("div", { className: "commentForm" });
        }
    });
    var CommentList = React.createClass({
        displayName: "CommentList",

        render: function render() {
            var commentNodes = this.props.data.map(function (comment) {
                return React.createElement(Comment, { data: comment });
            });

            return React.createElement(
                "div",
                { className: "commentList" },
                commentNodes
            );
        }
    });
    var Comment = React.createClass({
        displayName: "Comment",

        getInitialState: function getInitialState() {
            return {
                likeCounter: 0, //this.props.likeCounter,
                dislikeCounter: 0, //this.props.dislikeCounter,
                liked: null
            };
        },
        rateComment: function rateComment() {
            var instance = this;
            //todo: make ajax call and increment decremet the counters.
            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: "/comments/rate",
                data: { comment_id: this.props.data.id, liked: instance.state.liked },
                beforeSend: function beforeSend() {
                    instance.setState(instance.state);
                },
                success: function success(response) {
                    var x = "stop";
                },
                complete: function complete() {},
                error: function error(x, y, z) {
                    console.log(x);
                }
            });
        },
        handleLikeComment: function handleLikeComment() {
            //user pressed the liked button
            var oldLikeStatus = this.state.liked;
            var newLikeStatus = true;

            if (oldLikeStatus === true) {
                //if comment was already liked, undo it
                newLikeStatus = null;
                this.state.likeCounter = this.state.likeCounter - 1;
            }
            if (oldLikeStatus === false) //comment was disliked and now it was liked, remove it from counter
                this.state.dislikeCounter = this.state.dislikeCounter - 1;

            if (newLikeStatus === true) this.state.likeCounter = this.state.likeCounter + 1;

            this.state.liked = newLikeStatus;
            this.rateComment();
        },
        handleDislikeComment: function handleDislikeComment() {
            //user pressed the dislike button
            var oldLikeStatus = this.state.liked;
            var newLikeStatus = false;

            if (oldLikeStatus === false) {
                //if comment was already disliked, undo it
                newLikeStatus = null;
                this.state.dislikeCounter = this.state.dislikeCounter - 1;
            }
            if (oldLikeStatus === true) //comment was liked and now it was disliked, remove it from counter
                this.state.likeCounter = this.state.likeCounter - 1;

            if (newLikeStatus === false) this.state.dislikeCounter = this.state.dislikeCounter + 1;

            this.state.liked = newLikeStatus;
            this.rateComment();
        },
        render: function render() {
            var date = moment(this.props.data.dateAdded).format("llll");

            var tagNodes = this.props.data.annotationTags.map(function (tag) {
                return React.createElement(
                    "div",
                    { className: "tag" },
                    React.createElement(
                        "span",
                        null,
                        tag.description
                    )
                );
            });

            //todo: enable reply functionality, now its hidden
            var replyClasses = classNames("reply", "hide"); //,{hide: this.props.data.source.commentSource ==2}); //hide for opengov
            var agreeClasses = classNames("agree", { active: this.state.liked === true });
            var disagreeClasses = classNames("disagree", { active: this.state.liked === false });
            return React.createElement(
                "div",
                { className: "comment" },
                React.createElement(
                    "div",
                    { className: "avatar" },
                    React.createElement("img", { src: "/assets/images/profile_default.jpg" })
                ),
                React.createElement(
                    "div",
                    { className: "body" },
                    React.createElement(
                        "span",
                        { className: "commentAuthor" },
                        this.props.data.fullName
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.body } }),
                    tagNodes
                ),
                React.createElement(
                    "div",
                    { className: "options" },
                    React.createElement(
                        "a",
                        { className: agreeClasses, onClick: this.handleLikeComment, href: "#" },
                        "Συμφωνώ",
                        React.createElement("i", { className: "fa fa-thumbs-o-up" })
                    ),
                    " ",
                    this.state.likeCounter,
                    React.createElement(
                        "a",
                        { className: disagreeClasses, onClick: this.handleDislikeComment, href: "#" },
                        "Διαφωνώ",
                        React.createElement("i", { className: "fa fa-thumbs-o-down" })
                    ),
                    " ",
                    this.state.dislikeCounter,
                    React.createElement(
                        "a",
                        { className: replyClasses, href: "#" },
                        "Απάντηση ",
                        React.createElement("i", { className: "fa fa-reply" })
                    ),
                    React.createElement(
                        "span",
                        { className: "date" },
                        date
                    )
                )
            );
        }
    });
})();
/*  <a onClick={this.toogleBox}>{this.state.display? "Κλεισιμο" : "Ανοιγμα"}</a> */

//# sourceMappingURL=commentBox-compiled.js.map