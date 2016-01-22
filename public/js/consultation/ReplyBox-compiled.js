'use strict';

(function () {
    scify.ReplyBox = React.createClass({
        displayName: 'ReplyBox',

        getInitialState: function getInitialState() {
            return {
                busy: false,
                display: this.props.display
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
                'discussionthreadclientid': discussionthreadclientid,
                'commenterId': this.props.commenterId,
                'annotationId': this.props.annotationId,
                'consultationId': this.props.consultationId
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
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(comment) {
                    instance.props.onReplySuccess(comment);
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.props.display = false;
                    instance.setState(instance.state);
                }
            });
        },
        render: function render() {
            if (this.props.display) {
                if (!this.state.busy) {
                    if (this.props.userId) {
                        return React.createElement('form', { className: 'ContactForm', onSubmit: this.handleReplySave }, React.createElement('textarea', {
                            className: 'replyInput',
                            type: 'text',
                            placeholder: 'θα ήθελα να δηλώσω...',
                            name: 'replyTextArea' + this.props.parentId
                        }), React.createElement('button', {
                            type: 'submit',
                            className: 'btn blue replyBtn'
                        }, 'Καταχώρηση'));
                    } else {
                        swal({
                            title: 'Είσοδος',
                            text: 'Για αυτή την ενέργεια χρειάζεται να είστε <a href="/signIn">συνδεδεμένοι</a>',
                            html: true
                        });
                        return React.createElement('div', null);
                    }
                } else {
                    return React.createElement(
                        'div',
                        null,
                        React.createElement(scify.ReactLoader, { display: this.state.busy })
                    );
                }
            } else {
                return React.createElement('div', null);
            }
        }

    });
})();

//# sourceMappingURL=ReplyBox-compiled.js.map