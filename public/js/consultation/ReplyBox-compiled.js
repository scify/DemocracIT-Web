'use strict';

(function () {
    scify.ReplyBox = React.createClass({
        displayName: 'ReplyBox',

        getInitialState: function getInitialState() {
            return {
                displayLoader: false
            };
        },
        handleReplySave: function handleReplySave(event) {
            event.preventDefault();
            var parentId = this.props.parentId;
            var articleId = this.props.articleId;
            var discussionthreadclientid = this.props.discussionthreadclientid;
            console.log(this.props);
            var replyText = $('textarea[name=replyTextArea' + this.props.parentId + ']').val();
            var comment = {
                'articleId': articleId,
                'replyText': replyText,
                'parentId': parentId,
                'userId': this.props.userId,
                'discussionthreadclientid': discussionthreadclientid
            };
            this.saveComment('/comment/reply/save', comment);
        },
        saveComment: function saveComment(url, commentData) {
            var instance = this;
            $.ajax({
                method: 'POST',
                url: url,
                data: JSON.stringify(commentData),
                dataType: 'json',
                contentType: 'application/json; charset=utf-8',
                beforeSend: function beforeSend() {
                    instance.state.displayLoader = true;
                    instance.setState(instance.state);
                },
                success: function success(comment) {
                    console.log(comment);
                },
                complete: function complete() {
                    instance.state.displayLoader = false;
                }
            });
        },
        render: function render() {
            if (this.props.display) {
                return React.createElement('form', { className: 'ContactForm', onSubmit: this.handleReplySave }, React.createElement('textarea', {
                    className: 'replyInput',
                    type: 'text',
                    placeholder: 'θα ήθελα να δηλώσω...',
                    name: 'replyTextArea' + this.props.parentId
                }), React.createElement('button', { type: 'submit', className: 'btn blue replyBtn' }, 'Καταχώρηση'));
            } else {
                return React.createElement('div', null);
            }
        }

    });
})();

//# sourceMappingURL=ReplyBox-compiled.js.map