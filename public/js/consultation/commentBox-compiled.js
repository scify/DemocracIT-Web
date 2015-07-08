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

            $.ajax({
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
        },
        saveComment: function saveComment(url, data) {
            var instance = this;

            var comment = {
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
                data: comment,
                beforeSend: function beforeSend() {
                    instance.state.display = true;
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(response) {
                    comment.id = response.id;
                    instance.state.discussionthreadid = response.discussionThread.id; //set discussion thread to state
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
            if (!instance.state.comments || instance.state.comments.length == 0) instance.getCommentsFromServer.call(instance);else if (instance.state.display) instance.setVisibibility.call(instance, false);else instance.setVisibibility.call(instance, true);
        },
        toogleBox: function toogleBox() {
            this.state.display = !this.state.display;
            this.setState(this.state);
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
            var classes = classNames("commentBox", { hide: !this.state.display });

            return React.createElement(
                "div",
                { className: topClasses },
                React.createElement(TotalCommentsLink, { onClick: this.refreshComments, count: this.state.commentsCount, source: this.props.source }),
                React.createElement(
                    "div",
                    { className: classes },
                    React.createElement(
                        "a",
                        { onClick: this.toogleBox },
                        this.state.display ? "Κλεισιμο" : "Ανοιγμα"
                    ),
                    React.createElement(CommentForm, null),
                    React.createElement(CommentList, { data: this.state.comments })
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
                { onClick: this.handleClick },
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

        render: function render() {
            var date = moment(this.props.data.dateAdded).format("llll");
            //new Date(this.props.data.dateAdded).toDateString()
            // console.log(this.props.data.dateAdded);
            var tagInfo;
            if (this.props.data.annTagId > 0 && this.props.data.tagText && this.props.data.tagText.length > 0) {
                tagInfo = React.createElement(
                    "div",
                    { className: "tag" },
                    React.createElement(
                        "span",
                        null,
                        this.props.data.tagText
                    )
                );
            }

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
                    tagInfo
                ),
                React.createElement(
                    "div",
                    { className: "options" },
                    React.createElement(
                        "a",
                        { className: "agree", href: "#" },
                        "Συμφωνώ",
                        React.createElement("i", { className: "fa fa-thumbs-o-up" })
                    ),
                    React.createElement(
                        "a",
                        { className: "disagree", href: "#" },
                        "Διαφωνώ",
                        React.createElement("i", { className: "fa fa-thumbs-o-down" })
                    ),
                    React.createElement(
                        "a",
                        { className: "reply", href: "#" },
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

//# sourceMappingURL=commentBox-compiled.js.map