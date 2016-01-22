"use strict";

(function () {

    scify.CommentBox = React.createClass({
        displayName: "CommentBox",

        getInitialState: function getInitialState() {
            return { comments: [], //the comments that will be displayed (either all comments or top comments)
                allComments: [], //in case we display a subset of comments, this array contains all the comments
                topComments: [], //contains the top comments, the one with the most likes
                discussionThreadId: this.props.discussionthreadid,
                totalCommentsCount: this.props.commentsCount
            };
        },
        findTopComments: function findTopComments(comments) {

            if (comments.length < 9) return comments; //dont filter;

            var topComments = _.filter(comments, function (comment) {
                return comment.likesCounter > 0;
            }); //get all comments with likes,

            topComments = _.sortBy(topComments, function (comment) {
                // sort comments by likes descending
                return -comment.likesCounter;
            });

            if (topComments.length > 1) //display the first 5 comments if we have at least two 2 top comments
                return topComments.splice(0, 5);else return comments;
        },
        topCommentsAreDisplayed: function topCommentsAreDisplayed() {
            return this.state.topComments.length == this.state.comments.length;
        },
        commentsLoadedFromServer: function commentsLoadedFromServer() {
            return this.state.allComments.length > 0;
        },
        getCommentsFromServer: function getCommentsFromServer() {
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
                    instance.state.topComments = instance.findTopComments(data);
                    instance.state.comments = instance.state.topComments;
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
                discussionthreadtypeid: data.discussionroomtypeid,
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text
                fullName: this.props.fullName,
                dateAdded: new Date(),
                userAnnotatedText: data.userAnnotatedText,
                body: data.body,
                annotationTagTopics: data.annotationTagTopics,
                annotationTagProblems: data.annotationTagProblems,
                emotionId: data.emotionId
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
                    instance.state.totalCommentsCount = instance.state.totalCommentsCount + 1;

                    if (instance.commentsLoadedFromServer()) {
                        instance.state.allComments.unshift(comment);
                        //if we have comments loaded, and all are displayed (not just the top comments) also display the new one
                        if (!instance.topCommentsAreDisplayed()) instance.state.comments.unshift(comment);
                    }
                },
                complete: function complete() {

                    if (instance.commentsLoadedFromServer()) {
                        instance.state.busy = false;
                        instance.setState(instance.state);
                    } else {
                        instance.getCommentsFromServer.call(instance);
                    }
                }
            });
        },
        setVisibibility: function setVisibibility(display) {
            this.state.display = display;
            this.setState(this.state);
        },
        refreshComments: function refreshComments() {
            var instance = this;
            if (instance.state.totalCommentsCount > instance.state.comments.length) instance.getCommentsFromServer.call(instance);else if (instance.state.display) instance.setVisibibility.call(instance, false);else instance.setVisibibility.call(instance, true);
        },
        toogleBox: function toogleBox() {
            this.state.display = !this.state.display;
            this.setState(this.state);
        },
        shouldDisplayLoadMoreOption: function shouldDisplayLoadMoreOption() {
            return this.state.totalCommentsCount > this.state.comments.length;
        },
        render: function render() {

            if (this.state.busy) {
                return React.createElement(
                    "div",
                    null,
                    React.createElement(TotalCommentsLink, { onClick: this.refreshComments, count: this.state.totalCommentsCount }),
                    React.createElement(scify.ReactLoader, { display: this.state.busy })
                );
            }
            var topClasses = classNames({ hide: this.state.totalCommentsCount == 0 });
            var commendBoxclasses = classNames("commentBox", { hide: !this.state.display });
            var loadAllClasses = classNames("load-all", { hide: !this.shouldDisplayLoadMoreOption() });
            return React.createElement(
                "div",
                { className: topClasses },
                React.createElement(TotalCommentsLink, { onClick: this.refreshComments,
                    count: this.state.totalCommentsCount,
                    source: this.props.source,
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
                    React.createElement(scify.CommentList, {
                        consultationEndDate: this.props.consultationEndDate,
                        userId: this.props.userId,
                        data: this.state.comments,
                        parent: this.props.parent,
                        userDefined: this.props.userDefined,
                        imagesPath: this.props.imagesPath,
                        scrollToComment: this.props.scrollToComment }),
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
                return React.createElement(scify.Comment, { scrollToComment: instance.props.scrollToComment, imagesPath: instance.props.imagesPath, userId: instance.props.userId,
                    userDefined: instance.props.userDefined, parent: instance.props.parent,
                    consultationEndDate: instance.props.consultationEndDate, key: comment.id, data: comment });
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
            function sortByKey(array, key) {
                return array.sort(function (a, b) {
                    var x = a[key];var y = b[key];
                    return x > y ? -1 : x < y ? 1 : 0;
                });
            }
            if (this.props.data.commentReplies != undefined) if (this.props.data.commentReplies.length > 1) sortByKey(this.props.data.commentReplies, "dateAdded");
            return {
                likeCounter: this.props.data.likesCounter,
                dislikeCounter: this.props.data.dislikesCounter,
                liked: this.props.data.loggedInUserRating, //if not null it means has liked/disliked this comment
                comment: this.props.data,
                displayReplyBox: false
            };
        },

        componentDidMount: function componentDidMount() {
            $(React.findDOMNode(this)).find("[data-toggle=\"tooltip\"]").tooltip();
            if (this.props.scrollToComment != undefined && this.getHashValue("commentid") == this.props.data.id) {
                this.props.scrollToComment();
            }
        },
        getHashValue: function getHashValue(key) {
            var matches = location.hash.match(new RegExp(key + "=([^&]*)"));
            return matches ? matches[1] : null;
        },
        handleReply: function handleReply() {
            this.state.displayReplyBox = !this.state.displayReplyBox;
            this.setState(this.state);
        },
        handleSavedComment: function handleSavedComment(comment) {
            //add the new comment to the list of replies
            this.state.comment.commentReplies.unshift(comment);
            this.setState(this.state);
        },
        render: function render() {
            if (this.props.parent == "consultation" || this.props.parent == "reporter" || this.props.parent == "comment") {
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
                options = React.createElement(CommentActionsEnabled, { userDefined: this.props.userDefined, handleReply: this.handleReply, source: this.props.data.source.commentSource,
                    id: this.props.data.id, dateAdded: this.props.data.dateAdded, likeCounter: this.props.data.likesCounter,
                    dislikeCounter: this.props.data.dislikesCounter, loggedInUserRating: this.props.loggedInUserRating,
                    emotionId: this.props.data.emotionId, imagesPath: this.props.imagesPath });

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

                if (this.props.data.source.commentSource == 1) {
                    var replyBox = React.createElement(scify.ReplyBox, { onReplySuccess: this.handleSavedComment,
                        discussionthreadclientid: this.props.data.discussionThread.id,
                        userId: this.props.userId, parentId: this.props.data.id,
                        articleId: this.props.data.articleId,
                        display: this.state.displayReplyBox });
                } else {
                    var replyBox = React.createElement("div", null);
                }

                var replies = React.createElement("div", null);
                if (this.props.data.commentReplies.length > 0) {
                    replies = React.createElement(scify.CommentList, { consultationEndDate: this.props.consultationEndDate,
                        userId: this.props.userId,
                        data: this.props.data.commentReplies,
                        parent: "comment",
                        userDefined: this.props.userDefined,
                        updateComments: this.handleSavedComment });
                }
                var commentClassNames = "comment";
            } else if (this.props.parent == "reporterUserStats") {
                options = React.createElement(CommentActionsDisabled, { imagesPath: this.props.imagesPath, dateAdded: this.props.data.comment.dateAdded, likeCounter: this.props.data.comment.likesCounter, dislikeCounter: this.props.data.comment.dislikesCounter, loggedInUserRating: this.props.loggedInUserRating, emotionId: this.props.data.comment.emotionId });
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
                if (this.props.data.comment.discussionThread.discussion_thread_type_id == 2) annotatedText = React.createElement(
                    "div",
                    { className: "htmlText" },
                    React.createElement("i", { className: "fa fa-file-text-o" }),
                    React.createElement(
                        "span",
                        { className: "partName" },
                        "Τμήμα κειμένου: "
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.article_name } })
                );else annotatedText = React.createElement(
                    "div",
                    { className: "htmlText" },
                    React.createElement("i", { className: "fa fa-file-text-o" }),
                    React.createElement(
                        "span",
                        { className: "partName" },
                        "Όνομα άρθρου: "
                    ),
                    React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.article_name } })
                );
                var replyBox = React.createElement("div", null);
                var commentClassNames = "comment";
            } else if (this.props.parent == "comment") {
                options = React.createElement(CommentActionsEnabled, { imagesPath: this.props.imagesPath, userDefined: this.props.userDefined, handleReply: this.handleReply, source: 2, id: this.props.data.id, dateAdded: this.props.data.dateAdded, likeCounter: this.props.data.likesCounter, dislikeCounter: this.props.data.dislikesCounter, loggedInUserRating: this.props.loggedInUserRating });
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
                var replyBox = React.createElement("div", null);
                var replies = React.createElement("div", null);
                var commentClassNames = "comment replyComment";
            }
            if (this.props.parent == "reporter") {
                if (this.props.data.userAnnotatedText != null) {
                    if (this.props.data.userAnnotatedText) if (this.props.data.discussionThread.discussion_thread_type_id == 2) annotatedText = React.createElement(
                        "div",
                        { className: "htmlText" },
                        React.createElement("i", { className: "fa fa-file-text-o" }),
                        React.createElement(
                            "span",
                            { className: "partName" },
                            "Τμήμα κειμένου: "
                        ),
                        React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.userAnnotatedText } })
                    );else annotatedText = React.createElement(
                        "div",
                        { className: "htmlText" },
                        React.createElement("i", { className: "fa fa-file-text-o" }),
                        React.createElement(
                            "span",
                            { className: "partName" },
                            "Όνομα άρθρου: "
                        ),
                        React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.userAnnotatedText } })
                    );
                }
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
            //console.log(this.props);
            if (this.props.data.commentReplies != undefined) if (this.props.data.commentReplies.length > 0) {
                var replyTitle = React.createElement(
                    "div",
                    { className: "replyTitle" },
                    "Απαντήσεις σε αυτό το σχόλιο:"
                );
            }
            return React.createElement(
                "div",
                { className: commentClassNames, id: this.props.data.id },
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
                ),
                replyBox,
                replyTitle,
                replies
            );
        }
    });

    var CommentActionsEnabled = React.createClass({
        displayName: "CommentActionsEnabled",

        getInitialState: function getInitialState() {
            return {
                likeCounter: this.props.likeCounter,
                dislikeCounter: this.props.dislikeCounter,
                liked: this.props.loggedInUserRating, //if not null it means has liked/disliked this comment
                source: this.props.source, //source =1 for democracIt, source = 2 for opengov
                handleReply: this.props.handleReply
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
                beforeSend: function beforeSend() {},
                success: function success(response) {},
                complete: function complete() {
                    instance.setState(instance.state);
                },
                error: function error(err) {
                    console.log(err);
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
            var replyClasses = classNames("reply", { hide: this.state.source == 2 }); //,{hide: this.props.data.source.commentSource ==2}); //hide for opengov
            var agreeClasses = classNames("agree", { active: this.state.liked === true });
            var disagreeClasses = classNames("disagree", { active: this.state.liked === false });
            var date = moment(this.props.dateAdded).format("llll");
            var emotion = React.createElement("span", null);
            if (this.props.emotionId != undefined) {
                var image = "";
                switch (this.props.emotionId) {
                    case 1:
                        image = "/emoticons/emoticon-superhappy.png";
                        break;
                    case 2:
                        image = "/emoticons/emoticon-happy.png";
                        break;
                    case 3:
                        image = "/emoticons/emoticon-worried.png";
                        break;
                    case 4:
                        image = "/emoticons/emoticon-sad.png";
                        break;
                    case 5:
                        image = "/emoticons/emoticon-angry.png";
                        break;
                }
                var imageWithPath = this.props.imagesPath + image;
                emotion = React.createElement(
                    "span",
                    { className: "userEmotion" },
                    "Συναίσθημα: ",
                    React.createElement("img", { src: imageWithPath })
                );
            }
            return React.createElement(
                "div",
                { className: "optionsContainer" },
                React.createElement(
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
                        { className: replyClasses, onClick: this.state.handleReply },
                        "Απάντηση ",
                        React.createElement("i", { className: "fa fa-reply" })
                    ),
                    React.createElement(
                        "span",
                        { className: "date" },
                        date
                    ),
                    emotion
                )
            );
        }
    });
    var CommentActionsDisabled = React.createClass({
        displayName: "CommentActionsDisabled",

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
            var emotion = React.createElement("span", null);
            if (this.props.emotionId != undefined) {
                var image = "";
                switch (this.props.emotionId) {
                    case 1:
                        image = "/emoticons/emoticon-superhappy.png";
                        break;
                    case 2:
                        image = "/emoticons/emoticon-happy.png";
                        break;
                    case 3:
                        image = "/emoticons/emoticon-worried.png";
                        break;
                    case 4:
                        image = "/emoticons/emoticon-sad.png";
                        break;
                    case 5:
                        image = "/emoticons/emoticon-angry.png";
                        break;
                }
                var imageWithPath = this.props.imagesPath + image;
                emotion = React.createElement(
                    "span",
                    { className: "userEmotion" },
                    "Συναίσθημα: ",
                    React.createElement("img", { src: imageWithPath })
                );
            }
            return React.createElement(
                "div",
                { className: "optionsContainerDisabled" },
                React.createElement(
                    "div",
                    { className: "options" },
                    React.createElement(
                        "div",
                        { className: agreeClasses },
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
                    ),
                    emotion
                )
            );
        }
    });
})();

//# sourceMappingURL=commentBox-compiled.js.map