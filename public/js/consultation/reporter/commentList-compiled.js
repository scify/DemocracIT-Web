"use strict";

(function () {

    scify.commentList = React.createClass({
        displayName: "commentList",

        getInitialState: function getInitialState() {
            return {
                articleId: this.props.articleId,
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
        getOpenGovCommentsByArticleId: function getOpenGovCommentsByArticleId(articleId) {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/forarticle/opengov",
                cache: false,
                data: {
                    articleId: articleId
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
            //return promise;
        },
        getDITCommentsByArticleId: function getDITCommentsByArticleId(articleId) {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/forarticle/dit",
                cache: false,
                data: {
                    articleId: articleId
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
            //return promise;
        },
        getCommentsByAnnId: function getCommentsByAnnId(annId, consultationId) {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/byannid",
                cache: false,
                data: {
                    annId: annId,
                    consultationId: consultationId
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
            //return promise;
        },
        getCommentsByAnnIdPerArticle: function getCommentsByAnnIdPerArticle(annId, articleId) {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/byannid/perarticle",
                cache: false,
                data: {
                    annId: annId,
                    articleId: articleId
                },
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    instance.state.comments = data;
                    //console.log(data);
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
            //return promise;
        },
        render: function render() {
            if (this.state.display) {
                if (this.state.busy) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(scify.ReactLoader, { display: this.state.busy })
                    );
                }
                return React.createElement(scify.CommentList, {
                    appState: this.props.appState,
                    consultationId: this.props.consultationId,
                    imagesPath: this.props.imagesPath,
                    consultationEndDate: this.props.consultationEndDate,
                    userId: this.props.userId,
                    userDefined: this.props.userDefined,
                    data: this.state.comments,
                    parent: "reporter" });
            } else {
                return React.createElement("div", null);
            }
        }
    });
})();

//# sourceMappingURL=commentList-compiled.js.map