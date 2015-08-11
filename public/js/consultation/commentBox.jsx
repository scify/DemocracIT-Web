(function(){


    scify.CommentBox = React.createClass({
        getInitialState : function(){
            return { comments: [],
                     discussionThreadId: this.props.discussionthreadid,
                     commentsCount: this.props.commentsCount
            };
        },
        findTopComments : function(comments){

            if (comments.length<9)
                return comments;  //dont filter;

            var topComments =_.filter(comments,function(comment){
                return comment.likesCounter >0;
            }); //get all comments with likes, and then sort them

            topComments =_.sortBy(topComments,function(comment){
               return    -comment.likesCounter;
            })

            if (topComments.length>1) //display top if they more than one
                return topComments.splice(0,5);
            else
                return comments;

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
                    instance.state.allComments = data;
                    instance.state.topcomments = instance.findTopComments(data);
                    instance.state.comments =instance.state.topcomments;
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
        loadAll: function(){
            this.setState({comments:this.state.allComments})
        },
        saveComment : function(url,data){
            var instance = this;

            var postedData = {
                consultationId : this.props.consultationid,
                articleId: this.props.articleid,
                discussionThreadId : instance.state.discussionthreadid,
                discussionthreadclientid : this.props.discussionthreadclientid, //the id generated by javascript
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text
                fullName :this.props.fullName,
                dateAdded : new Date(),
                userAnnotatedText: data.userAnnotatedText,
                body : data.body,
                annotationTagTopics : data.annotationTagTopics,
                annotationTagProblems : data.annotationTagProblems
            };

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data: JSON.stringify(postedData),
                dataType: "json",
                contentType: "application/json; charset=utf-8",
                beforeSend:function(){
                    instance.state.display=true;
                    instance.state.busy=true;
                    instance.setState(instance.state);
                },
                success : function(comment){
                    instance.state.discussionthreadid = comment.discussionThread.id; //set discussion thread to state
                    instance.state.commentsCount = instance.state.commentsCount+1;
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
            var loadAllClasses =classNames("load-all",{ hide :!this.shouldDisplayLoadMoreOption()});

            return (
                <div className={topClasses}>
                    <TotalCommentsLink onClick={this.refreshComments} count={this.state.commentsCount} source={this.props.source} />
                    <div className={commendBoxclasses }>
                        <div className={loadAllClasses} >
                            βλέπετε τα { this.state.comments.length } πιο δημοφιλη σχόλια <a onClick={this.loadAll}>κλικ εδώ για να τα δείτε όλα</a>
                        </div>
                        <CommentList consultationEndDate={this.props.consultationEndDate} data={this.state.comments} />
                        <CommentForm />
                    </div>
                </div>

            );
        }
    });
    var TotalCommentsLink = React.createClass({
        render : function(){

            var label = "σχόλια";
            if (this.props.count==1)
                label="σχόλιο";

            if (this.props.source && this.props.source =="opengov")
                label +=" απο το opengov";

            if (this.props.count>0)
                return (
                    <a className="load" onClick={this.props.onClick}>{this.props.count} {label} </a>
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

            var instance = this;
            var commentNodes = this.props.data.map(function (comment) {
                return (
                    <Comment consultationEndDate={instance .props.consultationEndDate} key={comment.id} data={comment} />
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
                        likeCounter: this.props.data.likesCounter,
                        dislikeCounter: this.props.data.dislikesCounter,
                        liked : this.props.data.loggedInUserRating  //if not null it means has liked/disliked this comment
                    };
        },
        postRateCommentAndRefresh: function(){
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
            this.postRateCommentAndRefresh();
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
            this.postRateCommentAndRefresh();
        },
        componentDidMount : function(){
            $(React.findDOMNode(this)).find('[data-toggle="tooltip"]').tooltip();
        },
        render: function() {
            var date =moment(this.props.data.dateAdded).format('llll');

            var taggedProblems = this.props.data.annotationTagProblems.map(function (tag) {
                return (
                    <div className="tag"><span >{tag.description }</span></div>
                );
            });

            var taggedTopics = this.props.data.annotationTagTopics.map(function (tag) {
                return (
                    <div className="tag"><span >{tag.description }</span></div>
                );
            });

            //todo: enable reply functionality, now its hidden
            var replyClasses = classNames("reply","hide" )//,{hide: this.props.data.source.commentSource ==2}); //hide for opengov
            var agreeClasses = classNames("agree", {active: this.state.liked===true});
            var disagreeClasses = classNames("disagree", {active: this.state.liked ===false})
            //hide lock icon for open gov consultations, and for comments that we posted before the end of the consultation date
            var iconsClasses = classNames("icons",
                                          { hide: this.props.data.source.commentSource ==2 ||
                                                  this.props.data.dateAdded < this.props.consultationEndDate
                                          });
            return (
                <div className="comment">
                    <div className='avatar'>
                        <img src="/assets/images/profile_default.jpg" />
                    </div>
                    <div className='body'>
                        <span className="commentAuthor">{this.props.data.fullName}</span>
                        <span dangerouslySetInnerHTML={{__html: this.props.data.body}}></span>
                        {taggedProblems} {taggedTopics}
                    </div>
                    <div className="options">
                        <a className={agreeClasses} onClick={this.handleLikeComment}>
                            Συμφωνώ<i className="fa fa-thumbs-o-up"></i>

                        </a><span className="c"> ({this.state.likeCounter})</span>
                        <a className={disagreeClasses} onClick={this.handleDislikeComment}>
                                Διαφωνώ<i className="fa fa-thumbs-o-down"></i>
                        </a> <span className="c"> ({this.state.dislikeCounter})</span>
                        <a className={replyClasses} href="#">Απάντηση <i className="fa fa-reply"></i></a>
                        <span className="date">{date}</span>
                    </div>
                    <div className={iconsClasses}>
                        <a data-toggle="tooltip" data-original-title="Το σχόλιο εισήχθει μετά τη λήξη της διαβούλευσης"><img src="/assets/images/closed.gif"/></a>
                     </div>
                </div>
            );
        }
    });
})()


