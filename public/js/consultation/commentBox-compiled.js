"use strict";

var CommentBox = React.createClass({
    displayName: "CommentBox",

    getInitialState: function getInitialState() {
        return { comments: [] };
    },
    getCommentsFromServer: function getCommentsFromServer(url) {
        var instance = this;
        //todo: cancel any previous events
        $.ajax({
            method: "POST",
            url: url,
            beforeSend: function beforeSend() {
                instance.state.loading = true;
                instance.setState(instance.state);
            },
            success: function success(data) {
                instance.state.comments = data;
                instance.state.loading = false;
                instance.state.display = true;
                instance.setState(instance.state);
            },
            error: function error(x, z, y) {
                alert(x);
            }
        });
    },
    setVisibibility: function setVisibibility(display) {
        this.state.display = display;
        this.setState(this.state);
    },
    refreshComments: function refreshComments(url) {
        var instance = this;
        if (!instance.state.comments || instance.state.comments.length == 0) instance.getCommentsFromServer.call(instance, url);else if (instance.state.display) instance.setVisibibility.call(instance, false);else instance.setVisibibility.call(instance, true);
    },
    render: function render() {
        if (this.state.loading) {
            return React.createElement(
                "div",
                { className: "loading-wrp" },
                React.createElement(
                    "div",
                    { className: "spinner-loader" },
                    "Φόρτωση"
                )
            );
        }
        var classes = classNames("commentBox", { hide: !this.state.display });

        return React.createElement(
            "div",
            { className: classes },
            React.createElement(CommentForm, null),
            React.createElement(CommentList, { data: this.state.comments })
        );
    }
});
var CommentForm = React.createClass({
    displayName: "CommentForm",

    render: function render() {
        return React.createElement(
            "div",
            { className: "commentForm" },
            React.createElement("textarea", { placeholder: "leave your comment here" })
        );
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
                React.createElement("span", { dangerouslySetInnerHTML: { __html: this.props.data.body } })
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

$(function () {
    scify.commentBox = React.render(React.createElement(CommentBox, null), document.getElementById("comment-box-wrp"));
});

//# sourceMappingURL=commentBox-compiled.js.map