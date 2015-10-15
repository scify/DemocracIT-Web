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
        findTopComments: function findTopComments(comments) {

            if (comments.length < 9) return comments; //dont filter;

            var topComments = _.filter(comments, function (comment) {
                return comment.likesCounter > 0;
            }); //get all comments with likes, and then sort them

            topComments = _.sortBy(topComments, function (comment) {
                return -comment.likesCounter;
            });

            if (topComments.length > 1) //display top if they more than one
                return topComments.splice(0, 5);else return comments;
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
                    instance.state.allComments = data;
                    instance.state.topcomments = instance.findTopComments(data);
                    instance.state.comments = instance.state.topcomments;
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
        loadAll: function loadAll() {
            this.setState({ comments: this.state.allComments });
        },
        saveComment: function saveComment(url, data) {
            var instance = this;

            var postedData = {
                consultationId: this.props.consultationid,
                articleId: this.props.articleid,
                discussionThreadId: instance.state.discussionthreadid,
                discussionthreadclientid: this.props.discussionthreadclientid, //the id generated by javascript
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text
                fullName: this.props.fullName,
                dateAdded: new Date(),
                userAnnotatedText: data.userAnnotatedText,
                body: data.body,
                annotationTagTopics: data.annotationTagTopics,
                annotationTagProblems: data.annotationTagProblems
            };

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(postedData),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend: function beforeSend() {
                    instance.state.display = true;
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(comment) {
                    instance.state.discussionthreadid = comment.discussionThread.id; //set discussion thread to state
                    instance.state.commentsCount = instance.state.commentsCount + 1;
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
                    React.createElement(scify.ReactLoader, { display: this.state.busy })
                );
            }
            var topClasses = classNames({ hide: this.state.commentsCount == 0 });
            var commendBoxclasses = classNames("commentBox", { hide: !this.state.display });
            var loadAllClasses = classNames("load-all", { hide: !this.shouldDisplayLoadMoreOption() });

            return React.createElement(
                "div",
                { className: topClasses },
                React.createElement(TotalCommentsLink, { onClick: this.refreshComments,
                    count: this.state.commentsCount,
                    ource: this.props.source,
                    isdiscussionForTheWholeArticle: this.props.isdiscussionForTheWholeArticle }),
                React.createElement(
                    "div",
                    { className: commendBoxclasses },
                    React.createElement(
                        "div",
                        { className: loadAllClasses },
                        "βλέπετε τα ",
                        this.state.comments.length,
                        " πιο δημοφιλη σχόλια ",
                        React.createElement(
                            "a",
                            { onClick: this.loadAll },
                            "κλικ εδώ για να τα δείτε όλα"
                        )
                    ),
                    React.createElement(scify.CommentList, { consultationEndDate: this.props.consultationEndDate, data: this.state.comments, parent: this.props.parent }),
                    React.createElement(CommentForm, null)
                )
            );
        }
    });
    var TotalCommentsLink = React.createClass({
        displayName: "TotalCommentsLink",

        render: function render() {

            var label = "σχόλια";
            if (this.props.count == 1) label = "σχόλιο";

            if (this.props.source && this.props.source == "opengov") label += " απο το opengov ";

            if (this.props.isdiscussionForTheWholeArticle) label += " για ολόκληρο το άρθρο";else label += " για το τμήμα κειμένου";

            if (this.props.count > 0) return React.createElement(
                "a",
                { className: "load", onClick: this.props.onClick },
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
    window.scify.CommentList = React.createClass({
        displayName: "CommentList",

        render: function render() {
            var instance = this;
            var commentNodes = this.props.data.map(function (comment) {
                return React.createElement(scify.Comment, { parent: instance.props.parent, consultationEndDate: instance.props.consultationEndDate, key: comment.id, data: comment });
            });

            return React.createElement(
                "div",
                { className: "commentList" },
                commentNodes
            );
        }
    });
    window.scify.Comment = React.createClass({
        displayName: "Comment",

        getInitialState: function getInitialState() {
            return {
                likeCounter: this.props.data.likesCounter,
                dislikeCounter: this.props.data.dislikesCounter,
                liked: this.props.data.loggedInUserRating //if not null it means has liked/disliked this comment
            };
        },
        componentDidMount: function componentDidMount() {
            $(React.findDOMNode(this)).find("[data-toggle=\"tooltip\"]").tooltip();
        },
        render: function render() {
            if (this.props.parent == "consultation" || this.props.parent == "reporter") {
                var commentFromDB = this.props.data;
            } else {
                var commentFromDB = this.props.data.comment;
            }
            var taggedProblems = commentFromDB.annotationTagProblems.map(function (tag) {
                if (tag != undefined) {
                    return React.createElement(
                        "span",
                        { className: "tag pr" },
                        React.createElement(
                            "span",
                            null,
                            tag.description
                        )
                    );
                }
            });
            var taggedTopics = commentFromDB.annotationTagTopics.map(function (tag) {
                if (tag != undefined) {
                    return React.createElement(
                        "span",
                        { className: "tag topic" },
                        React.createElement(
                            "span",
                            null,
                            "#" + tag.description
                        )
                    );
                }
            });
            var taggedProblemsContainer = commentFromDB.annotationTagProblems.length > 0 ? React.createElement(
                "span",
                null,
                "Προβλήματα: ",
                taggedProblems,
                " "
            ) : "";
            var taggedTopicsContainer = commentFromDB.annotationTagTopics.length > 0 ? React.createElement(
                "span",
                null,
                "Κατηγορία: ",
                taggedTopics,
                " "
            ) : "";

            //todo: enable reply functionality, now its hidden

            //hide lock icon for open gov consultations, and for comments that we posted before the end of the consultation date
            var iconsClasses = classNames("icons", {
                hide: commentFromDB.source.commentSource == 2 || commentFromDB.dateAdded < this.props.consultationEndDate
            });

            var options, avatarDiv, commenterName, commentBody, annotatedText, topicsHtml;
            if (this.props.parent == "consultation" || this.props.parent == "reporter") {
                options = React.createElement(DisplayForConsultation, { id: this.props.data.id, dateAdded: this.props.data.dateAdded, likeCounter: this.props.data.likesCounter, dislikeCounter: this.props.data.dislikesCounter, loggedInUserRating: this.props.loggedInUserRating });
                avatarDiv = React.createElement(
                    "div",
                    { className: "avatar" },
                    React.createElement("img", { src: this.props.data.avatarUrl ? this.props.data.avatarUrl : "/assets/images/profile_default.jpg" })
                );

                if (this.props.data.profileUrl) commenterName = React.createElement(
                    "span",
                    { className: "commentAuthor" },
                    React.createElement(
                        "a",
                        { target: "_blank", href: this.props.data.profileUrl },
                        this.props.data.fullName
                    )
                );else commenterName = React.createElement(
                    "span",
                    { className: "commentAuthor" },
                    this.props.data.fullName
                );

                commentBody = React.createElement(
                    "div",
                    { className: "htmlText" },
                    React.createElement("i", { className: "fa fa-comment-o" }),
                    React.createElement(
                        "span",
                        { className: "partName" },
                        "Σχόλιο: "
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.body } })
                );
            } else if (this.props.parent == "reporterUserStats") {
                console.log(this.props.data);
                options = React.createElement(DisplayForReporter, { dateAdded: this.props.data.comment.dateAdded, likeCounter: this.props.data.comment.likesCounter, dislikeCounter: this.props.data.comment.dislikesCounter, loggedInUserRating: this.props.loggedInUserRating });
                commentBody = React.createElement(
                    "div",
                    { className: "htmlText" },
                    React.createElement("i", { className: "fa fa-comment-o" }),
                    React.createElement(
                        "span",
                        { className: "partName" },
                        "Σχόλιο: "
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.comment.body } })
                );
                annotatedText = React.createElement(
                    "div",
                    { className: "htmlText" },
                    React.createElement("i", { className: "fa fa-file-text-o" }),
                    React.createElement(
                        "span",
                        { className: "partName" },
                        "Τμήμα κειμένου: "
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.article_name } })
                );
            }
            if (this.props.parent == "reporter") {
                if (this.props.data.userAnnotatedText != null) annotatedText = React.createElement(
                    "div",
                    { className: "htmlText" },
                    React.createElement("i", { className: "fa fa-file-text-o" }),
                    React.createElement(
                        "span",
                        { className: "partName" },
                        "Τμήμα κειμένου: "
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.userAnnotatedText } })
                );
            }
            if (taggedProblems.length > 0 || taggedTopics.length > 0) topicsHtml = React.createElement(
                "div",
                { className: "tags htmlText" },
                React.createElement("i", { className: "fa fa-thumb-tack" }),
                React.createElement(
                    "span",
                    { className: "partName" },
                    "Θέματα: "
                ),
                " ",
                taggedProblemsContainer,
                " ",
                taggedTopicsContainer
            );

            return React.createElement(
                "div",
                { className: "comment" },
                avatarDiv,
                React.createElement(
                    "div",
                    { className: "body" },
                    commenterName,
                    commentBody,
                    annotatedText,
                    topicsHtml
                ),
                options,
                React.createElement(
                    "div",
                    { className: iconsClasses },
                    React.createElement(
                        "a",
                        { "data-toggle": "tooltip", "data-original-title": "Το σχόλιο εισήχθει μετά τη λήξη της διαβούλευσης" },
                        React.createElement("img", { src: "/assets/images/closed.gif" })
                    )
                )
            );
        }
    });

    var DisplayForConsultation = React.createClass({
        displayName: "DisplayForConsultation",

        getInitialState: function getInitialState() {
            return {
                likeCounter: this.props.likeCounter,
                dislikeCounter: this.props.dislikeCounter,
                liked: this.props.loggedInUserRating //if not null it means has liked/disliked this comment
            };
        },
        postRateCommentAndRefresh: function postRateCommentAndRefresh() {
            var instance = this;
            //todo: make ajax call and increment decremet the counters.
            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: "/comments/rate",
                data: { comment_id: this.props.id, liked: instance.state.liked },
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
            this.postRateCommentAndRefresh();
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
            this.postRateCommentAndRefresh();
        },
        render: function render() {
            var replyClasses = classNames("reply", "hide"); //,{hide: this.props.data.source.commentSource ==2}); //hide for opengov
            var agreeClasses = classNames("agree", { active: this.state.liked === true });
            var disagreeClasses = classNames("disagree", { active: this.state.liked === false });
            var date = moment(this.props.dateAdded).format("llll");
            return React.createElement(
                "div",
                { className: "options" },
                React.createElement(
                    "a",
                    { className: agreeClasses, onClick: this.handleLikeComment },
                    "Συμφωνώ",
                    React.createElement("i", { className: "fa fa-thumbs-o-up" })
                ),
                React.createElement(
                    "span",
                    { className: "c" },
                    " (",
                    this.state.likeCounter,
                    ")"
                ),
                React.createElement(
                    "a",
                    { className: disagreeClasses, onClick: this.handleDislikeComment },
                    "Διαφωνώ",
                    React.createElement("i", { className: "fa fa-thumbs-o-down" })
                ),
                " ",
                React.createElement(
                    "span",
                    { className: "c" },
                    " (",
                    this.state.dislikeCounter,
                    ")"
                ),
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
            );
        }
    });

    var DisplayForReporter = React.createClass({
        displayName: "DisplayForReporter",

        getInitialState: function getInitialState() {
            return {
                likeCounter: this.props.likeCounter,
                dislikeCounter: this.props.dislikeCounter,
                liked: this.props.loggedInUserRating //if not null it means has liked/disliked this comment
            };
        },
        render: function render() {
            var agreeClasses = classNames("agree", { active: this.state.liked === true });
            var disagreeClasses = classNames("disagree", { active: this.state.liked === false });
            var date = moment(this.props.dateAdded).format("llll");
            return React.createElement(
                "div",
                { className: "options" },
                React.createElement(
                    "div",
                    { className: agreeClasses, onClick: this.handleLikeComment },
                    "Χρήστες που συμφωνούν",
                    React.createElement("i", { className: "fa fa-thumbs-o-up" })
                ),
                React.createElement(
                    "span",
                    { className: "c" },
                    " (",
                    this.state.likeCounter,
                    ")"
                ),
                React.createElement(
                    "div",
                    { className: disagreeClasses },
                    "Χρήστες που διαφωνούν",
                    React.createElement("i", { className: "fa fa-thumbs-o-down" })
                ),
                " ",
                React.createElement(
                    "span",
                    { className: "c" },
                    " (",
                    this.state.dislikeCounter,
                    ")"
                ),
                React.createElement(
                    "span",
                    { className: "date" },
                    date
                )
            );
        }
    });
})();

//# sourceMappingURL=commentBox-compiled.js.map