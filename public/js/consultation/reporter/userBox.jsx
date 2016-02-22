(function(){

    scify.UserBox = React.createClass({
        getInitialState: function() {
          return {
              consultationid: this.props.consultationid,
              userId: this.props.userId,
              user: this.props.user,
              comments: [],
              busy: false,
              display: false,
              commentsCount: this.props.commentsCount
          };
        },
        setVisibibility : function(display){
            this.state.display=display;
            this.setState(this.state);
        },
        refreshComments : function(){
            var instance = this;
            if (instance.state.commentsCount > instance.state.comments.length )
                instance.getCommentsFromServer.call(instance);
            else if (instance.state.display)
                instance.setVisibibility.call(instance,false);
            else
                instance.setVisibibility.call(instance,true);
        },
        getCommentsFromServer : function(){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/cons/retrieve",
                cache:false,
                data:{
                    consultationId :this.props.consultationid,
                    userId :this.props.userId
                },
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function(x,z,y){
                    console.log(x);
                }
            });

            return promise;
        },
        render: function() {
            return (
                <div className="" onClick={this.refreshComments}>
                    <a>{this.props.user.first_name} {this.props.user.last_name}</a>
                    <scify.InfoBox imagesPath = {this.props.imagesPath} display={this.state.display} busy={this.state.busy} data={this.state.comments}
                                   messages={this.props.messages}/>
                </div>
            );
        }
    });

    scify.InfoBox = React.createClass({
        getInitialState: function() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user,
                display: this.props.display
            };
        },
        render: function() {
            var instance = this;
            if(this.props.display) {
                if (this.props.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.props.busy}/>
                        </div>
                    );
                }
                var commentNodes = this.props.data.map(function (commentWithArticleName) {
                    commentWithArticleName.comment.userAnnotatedText = commentWithArticleName.article_name;
                    //define the source as Democracit
                    commentWithArticleName.comment.source.commentSource = 2;
                    var comment = commentWithArticleName.comment;
                    return (
                            <scify.Comment
                                           imagesPath = {instance.props.imagesPath}
                                           key={commentWithArticleName.comment.id}
                                           data={comment}
                                           shouldDisplayCommenterName={true}
                                           shouldDisplayEditIcon={false}
                                           shouldDisplayCommentEdited={true}
                                           shouldDisplayShareBtn={false}
                                           shouldDisplayCommentBody={true}
                                           shouldDisplayEmotion={true}
                                           shouldDisplayAnnotatedText={true}
                                           shouldDisplayReplyBox={false}
                                           shouldDisplayReplies={false}
                                           optionsEnabled={false}
                                           shouldDisplayTopics={true}
                                           shouldDisplayLikeDislike={true}
                                           commentClassNames="comment"
                                           shouldDisplayFinalLawAnnBtn={false}
                                           messages={instance.props.messages}/>

                    );
                });
                return (
                    <div className="commentList">
                        {commentNodes}
                    </div>
                );

            } else {
                return (
                    <div></div>
                );
            }
        }
    });

})()


