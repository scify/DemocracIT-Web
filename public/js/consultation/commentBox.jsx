(function(){


    scify.CommentBox = React.createClass({
        getInitialState : function(){
            return { comments: [],
                     discussionThreadId: this.props.discussionthreadid
            };
        },
        getCommentsFromServer : function(url){
            var instance = this;
            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                    instance.state.busy=false;
                    instance.state.display=true;
                    instance.setState(instance.state);

                },
                error: function(x,z,y){
                    alert(x)
                }
            })
        },
        saveComment : function(url,data){
            var instance = this;

            var comment = {
                consultationId : this.props.consultationid,
                articleId: this.props.articleid,
                body : data.body,
                annotationTagId: data.annotationTagId, //the id from the select box
                annotationTagText: data.annotationTagText, //the text from the select box
                userAnnotatedText: data.userAnnotatedText, //the user user annotated
                discussionThreadId : instance.state.discussionThreadId,
                discussionThreadClientId : this.props.discussionThreadClientId, //the id generated by javascript
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text

                fullName :this.props.fullName,
                dateAdded : new Date()
            };

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data:comment,
                beforeSend:function(){
                    instance.state.display=true;
                    instance.state.busy=true;
                    instance.setState(instance.state);
                },
                success : function(response){
                    comment.id = response.id;
                    instance.state.discussionThreadId = response.discussionThread.id; //set discussion thread to state
                    instance.state.comments.push(comment);
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = instance.state.comments.length>0;
                    instance.setState(instance.state);
                }
            })

        },
        setVisibibility : function(display){
            this.state.display=display;
            this.setState(this.state);
        },
        refreshComments : function(url){
            var instance = this;
            if (!instance.state.comments || instance.state.comments.length==0)
                instance.getCommentsFromServer.call(instance,url);
            else if (instance.state.display)
                instance.setVisibibility.call(instance,false);
            else
                instance.setVisibibility.call(instance,true);
        },
        toogleBox: function(){
            this.state.display= !this.state.display;
            this.setState(this.state);
        },
        render: function() {
            if (this.state.busy)
            {
                return (
                    <div className="loading-wrp">
                        <div className="spinner-loader">
                            ...
                        </div>
                    </div>
                );
            }
            var classes = classNames("commentBox",{ hide :!this.state.display});

            return (
                <div className={classes}>
                    <a onClick={this.toogleBox}>{this.state.display? "Κλεισιμο" : "Ανοιγμα"}</a>
                    <CommentForm />
                    <CommentList data={this.state.comments} />
                </div>

            );
        }
    });
    var CommentForm = React.createClass({
        render: function() {
            return (
                <div className="commentForm">

                </div>
            );
        }
    });
    var CommentList = React.createClass({
        render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                return (
                    <Comment data={comment} />
                );
            });

            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
        }
    });
    var Comment = React.createClass({

        render: function() {
            var date =moment(this.props.data.dateAdded).format('llll');
            //new Date(this.props.data.dateAdded).toDateString()
            // console.log(this.props.data.dateAdded);
            var tagInfo ;
            if (this.props.data.annTagId>0 && this.props.data.tagText && this.props.data.tagText .length>0){
                tagInfo = <div className="tag"><span >{this.props.data.tagText }</span></div>
            }

            return (
                <div className="comment">
                    <div className='avatar'>
                        <img src="/assets/images/profile_default.jpg" />
                    </div>
                    <div className='body'>
                        <span className="commentAuthor">{this.props.data.fullName}</span>
                        <span dangerouslySetInnerHTML={{__html: this.props.data.body}}></span>
                        {tagInfo}
                    </div>
                    <div className="options">
                        <a className="agree" href="#">Συμφωνώ<i className="fa fa-thumbs-o-up"></i></a>
                        <a className="disagree" href="#">Διαφωνώ<i className="fa fa-thumbs-o-down"></i></a>
                        <a className="reply" href="#">Απάντηση <i className="fa fa-reply"></i></a>
                        <span className="date">{date}</span>
                    </div>
                </div>
            );
        }
    });
})()


