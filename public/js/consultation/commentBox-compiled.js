"use strict";

(function () {

    scify.CommentBox = React.createClass({
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
        saveComment: function saveComment(url, data) {
            var instance = this;
            data.discussionthreadid = this.props.discussionthreadid;

            //Render it before it is saved
            var comment = {
                fullName: "full name",
                body: data.comment,
                annText: data.text,
                annTagId: -1,
                annTagText: data.tagText,
                dateAdded: new Date()
            };
            instance.state.comments.push(comment);
            instance.state.saving = true;
            instance.state.display = true;
            instance.setState(instance.state);

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data: data,
                success: function success(comment) {
                    instance.state.saving = false;
                    instance.setState(instance.state);
                },
                error: function error(_error) {
                    alert(_error);
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
                React.createElement(CommentForm, { consultationid: this.props.consultationid,
                    articleid: this.props.articleid
                }),
                React.createElement(CommentList, { data: this.state.comments })
            );
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
            if (this.props.data.annTagid > 0 && this.props.data.annTagText && this.props.data.annTagText.length > 0) tagInfo = React.createElement(
                "span",
                { className: "tag" },
                this.props.data.annTagText
            );

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
/*
<form action="/home/save" method="post">
   <div>
       Επισημείωση για το τμήμα κειμένου:
       <blockquote></blockquote></div>
   <div>
       <hr/>
       <select name="tagId">
           <option>Υπόδειξη προβλήματος:</option>
           <option value="-1">πρόβλημα 1</option>
           <option value="-2">πρόβλημα 2</option>
           <option value="-3">πρόβλημα 3</option>
       </select>
   </div>
   <div className="comment-wrap">
       Θα ηθελα να δηλωσω οτι:
       <textarea name="comment"></textarea>
   </div>
   <input type="hidden" name="consultationId" value="{this.props.consulationid}"/>
   <input type="hidden" name="articleId" value="{this.props.articleid}"/>
   <input type="hidden" name="startIndex" value="-1"/>
   <input type="hidden" name="endIndex" value="-1"/>
   <input type="hidden" name="annotation-tag" value="{this.state.annotationId}"/>
   <input type="hidden" name="text" value="{this.state.annotation.text}"/>
   <button className="btn blue" type="submit">Καταχώρηση</button>
   <button className="close btn red" type="button"  >Κλείσιμο</button>
</form>
*/

//# sourceMappingURL=commentBox-compiled.js.map