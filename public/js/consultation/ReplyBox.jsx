(function(){
    scify.ReplyBox = React.createClass({
        getInitialState : function() {
            return {
                busy: false,
                display: this.props.display
            }
        },
        handleReplySave: function(event) {
            event.preventDefault();
            var parentId = this.props.parentId;
            var articleId = this.props.articleId;
            var discussionthreadclientid = this.props.discussionthreadclientid
            console.log(this.props);
            var replyText = $('textarea[name=replyTextArea' + this.props.parentId +']').val();
            var comment = {
                'articleId': articleId,
                'replyText': replyText,
                'parentId': parentId,
                'userId': this.props.userId,
                'discussionthreadclientid':discussionthreadclientid
            };
            this.saveComment("/comment/reply/save", comment);
        },
        saveComment : function(url,commentData) {
            var instance = this;
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(commentData),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend:function(){
                    instance.state.busy=true;
                    instance.setState(instance.state);
                },
                success : function(comment){
                    instance.props.onReplySuccess(comment);
                    //console.log(comment);

                },
                complete: function(){
                    instance.state.busy=false;
                    instance.props.display = false;
                    instance.setState(instance.state);
                }
            });
        },
        render: function() {
            if (this.props.display) {
                if(!this.state.busy) {
                    if (this.props.userId) {
                        return (
                            React.createElement('form', {className: 'ContactForm', onSubmit: this.handleReplySave},
                                React.createElement('textarea', {
                                    className: 'replyInput',
                                    type: 'text',
                                    placeholder: "θα ήθελα να δηλώσω...",
                                    name: "replyTextArea" + this.props.parentId
                                }),
                                React.createElement('button', {
                                    type: 'submit',
                                    className: 'btn blue replyBtn'
                                }, "Καταχώρηση")
                            )
                        )
                    } else {
                        //displayNotLoggedIn();
                        return (
                            <div>not logged in</div>
                        );
                    }
                } else {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                }
            } else {
                return (
                    <div></div>
                );
            }

        }

    });

})()