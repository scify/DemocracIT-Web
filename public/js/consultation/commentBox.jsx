(function(){


    scify.CommentBox = React.createClass({
        getInitialState : function(){
            return { comments: [],
                     discussionThreadId: this.props.discussionthreadid,
                     commentsCount: this.props.commentsCount
            };
        },
        getCommentsFromServer : function(url){
            var instance = this;

           var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve",
                cache:false,
                data:{
                    consultationId :this.props.consultationid,
                    articleId :this.props.articleid,
                    source : this.props.source,
                    discussionthreadid : this.state.discussionthreadid,
                    discussionthreadclientid: this.props.discussionthreadclientid
                },
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
            });

            return promise;
        },
        saveComment : function(url,data){
            var instance = this;

            var postedData = {
                consultationId : this.props.consultationid,
                articleId: this.props.articleid,
                body : data.body,
                annotationTagId: data.annotationTagId, //the id from the select box
                annotationTagText: data.annotationTagText, //the text from the select box
                userAnnotatedText: data.userAnnotatedText, //the user user annotated
                discussionThreadId : instance.state.discussionthreadid,
                discussionthreadclientid : this.props.discussionthreadclientid, //the id generated by javascript
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text

                fullName :this.props.fullName,
                dateAdded : new Date()
            };

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data:postedData,
                beforeSend:function(){
                    instance.state.display=true;
                    instance.state.busy=true;
                    instance.setState(instance.state);
                },
                success : function(comment){
                    instance.state.discussionthreadid = comment.discussionThread.id; //set discussion thread to state

                    instance.state.commentsCount = instance.state.commentsCount+1;
                    //attach first
                    instance.state.comments.push(comment);
                },
                complete: function(){
                    instance.state.busy=false;
                    instance.state.display = instance.state.comments.length>0;
                    instance.setState(instance.state);
                }
            });

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
        toogleBox: function(){
            this.state.display= !this.state.display;
            this.setState(this.state);
        },
        shouldDisplayLoadMoreOption : function(){
             return  this.state.commentsCount > this.state.comments.length;
        },
        render: function() {
            if (this.state.busy)
            {
                return (
                    <div>
                        <TotalCommentsLink onClick={this.refreshComments} count={this.state.commentsCount} />
                        <div className="loading-wrp">
                            <div className="spinner-loader">
                                ...
                            </div>
                        </div>
                    </div>
                );
            }
            var topClasses = classNames({hide: this.state.commentsCount==0});
            var commendBoxclasses = classNames("commentBox",{ hide :!this.state.display});
            var loadMoreClasses =classNames("load-more",{ hide :!this.shouldDisplayLoadMoreOption()});
            return (
                <div className={topClasses}>
                    <TotalCommentsLink onClick={this.refreshComments} count={this.state.commentsCount} source={this.props.source} />
                    <div className={commendBoxclasses }>
                        { /*  <a onClick={this.toogleBox}>{this.state.display? "Κλεισιμο" : "Ανοιγμα"}</a> */ }
                        <div className={loadMoreClasses} >
                            <a onClick={this.refreshComments}>φόρτωση ολων των σχολίων</a>
                        </div>
                        <CommentList data={this.state.comments} />
                        <CommentForm />
                    </div>
                </div>

            );
        }
    });
    var TotalCommentsLink = React.createClass({
        handleClick : function(){
          this.props.onClick();
        },
        render : function(){

            var label = "σχόλια";
            if (this.props.count==1)
                label="σχόλιο";

            if (this.props.source && this.props.source =="opengov")
                label +=" απο το opengov";

            if (this.props.count>0)
                return (
                    <a className="load" onClick={this.handleClick}>{this.props.count} {label} </a>
                )
            else //todo: how can i return an empty element?
                return (<span></span>)
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
        getInitialState: function(){
            return {
                        likeCounter:  0 ,//this.props.likeCounter,
                        dislikeCounter: 0,//this.props.dislikeCounter,
                        liked : null
                    };
        },
        rateComment: function(){
            var instance = this;
           //todo: make ajax call and increment decremet the counters.
            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: "/comments/rate",
                data: { comment_id : this.props.data.id , liked : instance.state.liked},
                beforeSend:function(){
                    instance.setState(instance.state);
                },
                success : function(response){
                    var x = "stop";
                },
                complete: function(){},
                error:function(x,y,z){
                    console.log(x);
                }
            })

        },
        handleLikeComment :function(){ //user pressed the liked button
            var oldLikeStatus =this.state.liked;
            var newLikeStatus=true;

            if (oldLikeStatus ===true) { //if comment was already liked, undo it
                newLikeStatus=null;
                this.state.likeCounter = this.state.likeCounter -1;
            }
            if (oldLikeStatus ===false) //comment was disliked and now it was liked, remove it from counter
                this.state.dislikeCounter= this.state.dislikeCounter-1;

            if (newLikeStatus===true)
                this.state.likeCounter = this.state.likeCounter + 1

            this.state.liked= newLikeStatus;
            this.rateComment();
        },
        handleDislikeComment:function(){ //user pressed the dislike button
            var oldLikeStatus =this.state.liked;
            var newLikeStatus=false;

            if (oldLikeStatus ===false) { //if comment was already disliked, undo it
                newLikeStatus=null;
                this.state.dislikeCounter = this.state.dislikeCounter  -1;
            }
            if (oldLikeStatus ===true) //comment was liked and now it was disliked, remove it from counter
                this.state.likeCounter= this.state.likeCounter-1;

            if (newLikeStatus===false)
                this.state.dislikeCounter = this.state.dislikeCounter + 1

            this.state.liked= newLikeStatus;
            this.rateComment();
        },
        render: function() {
            var date =moment(this.props.data.dateAdded).format('llll');

            var tagNodes = this.props.data.annotationTags.map(function (tag) {
                return (
                    <div className="tag"><span >{tag.description }</span></div>
                );
            });

            //todo: enable reply functionality, now its hidden
            var replyClasses = classNames("reply","hide" )//,{hide: this.props.data.source.commentSource ==2}); //hide for opengov
            var agreeClasses = classNames("agree", {active: this.state.liked===true});
            var disagreeClasses = classNames("disagree", {active: this.state.liked ===false})
            return (
                <div className="comment">
                    <div className='avatar'>
                        <img src="/assets/images/profile_default.jpg" />
                    </div>
                    <div className='body'>
                        <span className="commentAuthor">{this.props.data.fullName}</span>
                        <span dangerouslySetInnerHTML={{__html: this.props.data.body}}></span>
                        {tagNodes}
                    </div>
                    <div className="options">
                        <a className={agreeClasses} onClick={this.handleLikeComment} href="#">
                                Συμφωνώ<i className="fa fa-thumbs-o-up"></i>
                        </a> {this.state.likeCounter}
                        <a className={disagreeClasses} onClick={this.handleDislikeComment} href="#">
                                Διαφωνώ<i className="fa fa-thumbs-o-down"></i>
                        </a> {this.state.dislikeCounter}
                        <a className={replyClasses} href="#">Απάντηση <i className="fa fa-reply"></i></a>
                        <span className="date">{date}</span>
                    </div>
                </div>
            );
        }
    });
})()


