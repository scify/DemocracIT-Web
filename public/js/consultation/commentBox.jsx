(function(){


    scify.CommentBox = React.createClass({
        getInitialState : function(){
            return { comments: [], //the comments that will be displayed (either all comments or top comments)
                     allComments: [], //in case we display a subset of comments, this array contains all the comments
                     topComments:[], //contains the top comments, the one with the most likes
                     discussionThreadId: this.props.discussionthreadid,
                totalCommentsCount: this.props.commentsCount
            };
        },
        findTopComments : function(comments){

            if (comments.length<9)
                return comments;  //dont filter;

            var topComments =_.filter(comments,function(comment){
                return comment.likesCounter >0;
            }); //get all comments with likes,

            topComments =_.sortBy(topComments,function(comment){ // sort comments by likes descending
               return    -comment.likesCounter;
            })

            if (topComments.length>1) //display the first 5 comments if we have at least two 2 top comments
                return topComments.splice(0,5);
            else
                return comments;

        },
        topCommentsAreDisplayed : function(){
            return this.state.topComments.length == this.state.comments.length;
        },
        commentsLoadedFromServer: function(){
            return this.state.allComments.length>0;
        },
        getCommentsFromServer : function(){
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
                    instance.state.topComments = instance.findTopComments(data);
                    instance.state.comments =instance.state.topComments;
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
                discussionthreadtypeid : data.discussionroomtypeid,
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text
                fullName :this.props.fullName,
                dateAdded : new Date(),
                userAnnotatedText: data.userAnnotatedText,
                body : data.body,
                annotationTagTopics : data.annotationTagTopics,
                annotationTagProblems : data.annotationTagProblems,
                emotionId : data.emotionId
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
                    instance.state.totalCommentsCount = instance.state.totalCommentsCount+1;

                    if (instance.commentsLoadedFromServer())
                    {
                        instance.state.allComments.unshift(comment);
                        //if we have comments loaded, and all are displayed (not just the top comments) also display the new one
                        if (!instance.topCommentsAreDisplayed())
                            instance.state.comments.unshift(comment);
                    }
                },
                complete: function(){

                     if (instance.commentsLoadedFromServer())
                     {
                         instance.state.busy=false;
                         instance.setState(instance.state);
                     }
                    else
                     {
                         instance.getCommentsFromServer.call(instance);
                     }

                }
            });

        },
        updateComment : function(url,data){
            var instance = this;
            var postedData = {
                commentId: data.commentId,
                consultationId : this.props.consultationid,
                articleId: this.props.articleid,
                discussionThreadId : instance.state.discussionthreadid,
                discussionthreadclientid : this.props.discussionthreadclientid, //the id generated by javascript
                discussionthreadtypeid : data.discussionroomtypeid,
                discussionThreadText: this.props.discussionThreadText, //contains the whole discussion thread text
                fullName :this.props.fullName,
                dateAdded : new Date(),
                userAnnotatedText: data.userAnnotatedText,
                body : data.body,
                annotationTagTopics : data.annotationTagTopics,
                annotationTagProblems : data.annotationTagProblems,
                emotionId : data.emotionId,
                revision: data.revision
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
                    instance.state.totalCommentsCount = instance.state.totalCommentsCount;

                    if (instance.commentsLoadedFromServer())
                    {
                        instance.state.allComments.unshift(comment);
                        //if we have comments loaded, and all are displayed (not just the top comments) also display the new one
                        if (!instance.topCommentsAreDisplayed())
                            instance.state.comments.unshift(comment);
                    }
                },
                complete: function(){

                    if (instance.commentsLoadedFromServer())
                    {
                        instance.state.busy=false;
                        instance.setState(instance.state);
                    }
                    else
                    {
                        instance.getCommentsFromServer.call(instance);
                    }

                }
            });

        },
        setVisibibility : function(display){
            this.state.display=display;
            this.setState(this.state);
        },
        refreshComments : function(){
            var instance = this;
            if (instance.state.totalCommentsCount > instance.state.comments.length )
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
             return  this.state.totalCommentsCount > this.state.comments.length;
        },
        render: function() {

            if (this.state.busy)
            {
                return (
                    <div>
                        <TotalCommentsLink onClick={this.refreshComments} count={this.state.totalCommentsCount} />
                        <scify.ReactLoader display={this.state.busy} />
                    </div>
                );
            }
            var topClasses = classNames({hide: this.state.totalCommentsCount==0});
            var commendBoxclasses = classNames("commentBox",{ hide :!this.state.display});
            var loadAllClasses =classNames("load-all",{ hide :!this.shouldDisplayLoadMoreOption()});
            return (

                <div className={topClasses}>
                    <TotalCommentsLink onClick={this.refreshComments}
                                       count={this.state.totalCommentsCount}
                                       source={this.props.source}
                                       isdiscussionForTheWholeArticle={this.props.isdiscussionForTheWholeArticle} />
                    <div className={commendBoxclasses }>
                        <div className={loadAllClasses} >
                            βλέπετε τα { this.state.comments.length } πιο δημοφιλη σχόλια <a onClick={this.loadAll}>κλικ εδώ για να τα δείτε όλα</a>
                        </div>
                        <scify.CommentList
                            consultationEndDate={this.props.consultationEndDate}
                            annotationId = {this.props.annotationId}
                            consultationId = {this.props.consultationId}
                            userId = {this.props.userId}
                            data={this.state.comments}
                            parent={this.props.parent}
                            userDefined={this.props.userDefined}
                            imagesPath = {this.props.imagesPath}
                            scrollToComment={this.props.scrollToComment}
                            appState={this.props.appState}
                            annId={this.props.annId}/>
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
                label +=" απο το opengov ";

            if (this.props.isdiscussionForTheWholeArticle)
                label +=" για ολόκληρο το άρθρο";
            else
                label +=" για το τμήμα κειμένου";

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
    window.scify.CommentList = React.createClass({
        render: function() {
            var instance = this;

            var commentNodes = this.props.data.map(function (comment) {
                return (
                    <scify.Comment scrollToComment={instance.props.scrollToComment} imagesPath = {instance.props.imagesPath} userId={instance.props.userId}
                                   userDefined={instance.props.userDefined} parent={instance.props.parent}
                                   consultationEndDate={instance.props.consultationEndDate} key={comment.id} data={comment}
                                   annotationId = {instance.props.annotationId}
                                   consultationId = {instance.props.consultationId}
                                   appState={instance.props.appState}
                                   annId={instance.props.annId}
                                   revision={comment.revision}/>
                );
            });

            return (
                <div className="commentList">
                    {commentNodes}
                </div>
            );
        }
    });
    window.scify.Comment = React.createClass({
        getInitialState: function(){
            function sortByKey(array, key) {
                return array.sort(function(a, b) {
                    var x = a[key]; var y = b[key];
                    return ((x > y) ? -1 : ((x < y) ? 1 : 0));
                });

            }
            if(this.props.data.commentReplies!= undefined)
                if(this.props.data.commentReplies.length > 1)
                    sortByKey(this.props.data.commentReplies, 'dateAdded');
            return {
                        likeCounter: this.props.data.likesCounter,
                        dislikeCounter: this.props.data.dislikesCounter,
                        liked : this.props.data.loggedInUserRating,  //if not null it means has liked/disliked this comment
                        comment: this.props.data,
                        displayReplyBox: false
                    };
        },
        componentDidMount : function(){
            var instance = this;
            $(React.findDOMNode(this)).find('[data-toggle="tooltip"]').tooltip();
            if(this.props.scrollToComment != undefined && this.getHashValue("commentid") == this.props.data.id) {
                this.props.scrollToComment();
            }
            $("#shareComment-" + instance.props.data.id).click(function() {
                var commentId = $(this).attr('id').split('-')[1];
                var annotationId = instance.props.annotationId;
                //if annotationId is undefined, we are in reporter page, so we cannot get the annId from the DOM.
                //we need to get it from the comment object
                if(annotationId == undefined) {
                    annotationId = instance.props.data.discussionThread.text.split('-')[1];
                }
                var longUrl ="";
                $("#shareComment-"+commentId).prev().toggleClass('shareArticleHiddenComment');
                if(instance.props.appState == "development") {
                    longUrl = "http://localhost:9000/consultation/";
                } else {
                    longUrl = "http://democracit.org/consultation/";
                }
                longUrl += instance.props.consultationId + "#commentid=" + commentId + "&articleid=" + instance.props.data.articleId + "&annid=" + annotationId;
                //show the extra div
                if($("#shareComment-"+commentId).prev().find(".shareUrl").length == 0)
                    $("#shareComment-"+commentId).prev().append('<div class="shareUrl"><a href="' + longUrl + '">' + longUrl + '</a></div>');
            });
        },
        getHashValue : function(key) {
            var matches = location.hash.match(new RegExp(key+'=([^&]*)'));
            return matches ? matches[1] : null;
        },
        handleReply: function() {
            this.state.displayReplyBox = !this.state.displayReplyBox;
            this.setState(this.state);
        },
        handleSavedComment: function(comment) {
            //add the new comment to the list of replies
            this.state.comment.commentReplies.unshift(comment);
            this.setState(this.state);
        },
        handleEditComment: function(){
            var commentToBeEdited = this.props.data;
            commentToBeEdited.annId = "ann-" + this.props.annId;
            //throw custom event on the body html passing the comment that will be edited. The comment should have its id populated
            $("body").trigger("editcomment", commentToBeEdited);
        },
        render: function() {
            var userId = this.props.userId;
            var commenterId = this.props.data.userId;
            var editIcon = <span></span>;
            //if the logged in user is the same as the commenter user, the edit comment icon is populated
            //we only present the Edit option if the user is Logged in and it's id is equal to the comment's id
            //we only present the edit icon in the Consultation index page (not the reporter page)
            if(userId == commenterId && userId != undefined && this.props.parent == "consultation") {
                editIcon = <span className="editIcon" title="Τροποποιήστε το σχόλιο σας" onClick={this.handleEditComment}><i className="fa fa-pencil-square-o"></i></span>
            }
            if(this.props.parent == "consultation" || this.props.parent == "reporter" || this.props.parent == "comment") {
                var commentFromDB = this.props.data;
            } else {
                var commentFromDB = this.props.data.comment;
            }
            var taggedProblems = commentFromDB.annotationTagProblems.map(function (tag) {
                if (tag != undefined) {
                return (
                    <span className="tag pr"><span>{tag.description}</span></span>
                );
                }
            });
            var taggedTopics = commentFromDB.annotationTagTopics.map(function (tag) {
                if (tag != undefined) {
                    return (
                        <span className="tag topic"><span >{"#" + tag.description }</span></span>
                    );
                }
            });
            var taggedProblemsContainer = commentFromDB.annotationTagProblems.length > 0 ?
                <span>Προβλήματα: { taggedProblems} </span> : "";
            var taggedTopicsContainer = commentFromDB.annotationTagTopics.length > 0 ?
                <span>Κατηγορία: { taggedTopics} </span> : "";

            //todo: enable reply functionality, now its hidden

            //hide lock icon for open gov consultations, and for comments that we posted before the end of the consultation date
            var iconsClasses = classNames("icons",
                {
                    hide: commentFromDB.source.commentSource == 2 ||
                    commentFromDB.dateAdded < this.props.consultationEndDate
                });

            var options,avatarDiv,commenterName,commentBody,annotatedText, topicsHtml;
            var emotion = <span></span>;
            var emotionId = this.props.data.emotionId;
            if(emotionId == undefined && this.props.data.comment != null)
                emotionId = this.props.data.comment.emotionId
            if(emotionId != undefined) {
                var image="";
                switch(emotionId) {
                    case 1:
                        image = "/emoticons/emoticon-superhappy.png";
                        break;
                    case 2:
                        image = "/emoticons/emoticon-happy.png"
                        break;
                    case 3:
                        image = "/emoticons/emoticon-worried.png";
                        break;
                    case 4:
                        image = "/emoticons/emoticon-sad.png";
                        break;
                    case 5:
                        image = "/emoticons/emoticon-angry.png";
                        break;
                }
                var imageWithPath = this.props.imagesPath + image;
                emotion = <div className="userEmotion htmlText">Ο χρήστης εκδήλωσε το συναίσθημα: <img src={imageWithPath}></img></div>;
            }
            var shareBtn = <span></span>;

            var commentSource = this.props.data.source;

            //we only present the share button to the comments from DemocracIT (comment source ID is 1)
            //we do not present the share button in the userCommentStats tab in reporter page
            if(commentSource != undefined) {
                if(commentSource.commentSource == 1) {
                    var commentIdForShare = this.props.data.id;
                    //if we call commentBox from reporterUserStats tab, the comment id is nested in the data.comment object
                    if (commentIdForShare == undefined)
                        commentIdForShare = this.props.data.comment.id;
                    shareBtn = <div className="shareLink"><span className="shareSpanComment shareArticleHiddenComment">
                    Κάντε αντιγραφή τον παρακάτω σύνδεσμο:</span><
                        span className="shareBtnComment" id={"shareComment-" + commentIdForShare}>
                    <i className="fa fa-link"></i>
                </span></div>;
                }
            }
            if(this.props.parent == "consultation" || this.props.parent == "reporter") {
                options = <CommentActionsEnabled userDefined={this.props.userDefined} handleReply={this.handleReply} source={this.props.data.source.commentSource}
                                                 id={this.props.data.id} dateAdded={this.props.data.dateAdded} likeCounter={this.props.data.likesCounter}
                                                 dislikeCounter={this.props.data.dislikesCounter} loggedInUserRating={this.props.loggedInUserRating}
                                                 emotionId={this.props.data.emotionId} imagesPath={this.props.imagesPath}/>;

                avatarDiv =<div className='avatar'><img src={this.props.data.avatarUrl ? this.props.data.avatarUrl : "/assets/images/profile_default.jpg"} /></div>;

                if (this.props.data.profileUrl)
                    commenterName = <span className="commentAuthor"><a target="_blank" href={this.props.data.profileUrl}>{this.props.data.fullName}</a></span>;
                else
                    commenterName = <span className="commentAuthor">{this.props.data.fullName}</span>;

                commentBody = <div className="htmlText"><i className="fa fa-comment-o"></i>
                    <span className="partName">Σχόλιο: </span>
                    <span dangerouslySetInnerHTML={{__html: this.props.data.body}}></span></div>;

                if(this.props.data.source.commentSource == 1) {
                    var replyBox = <scify.ReplyBox onReplySuccess={this.handleSavedComment}
                                                   discussionthreadclientid={this.props.data.discussionThread.id}
                                                   commenterId={this.props.data.userId}
                                                   userId={this.props.userId} parentId={this.props.data.id}
                                                   articleId={this.props.data.articleId}
                                                   display={this.state.displayReplyBox}
                                                   annotationId = {this.props.annotationId}
                                                   consultationId = {this.props.consultationId}/>;
                } else {
                    var replyBox =<div></div>;
                }
                var replies = <div></div>;
                if(this.props.data.commentReplies.length > 0) {
                    replies = <scify.CommentList consultationEndDate={this.props.consultationEndDate}
                                                     userId={this.props.userId}
                                                     data={this.props.data.commentReplies}
                                                     parent="comment"
                                                     userDefined={this.props.userDefined}
                                                     updateComments={this.handleSavedComment}
                                                     annotationId = {this.props.annotationId}
                                                     appState = {this.props.appState}
                                                     consultationId = {this.props.consultationId}
                                                     scrollToComment={this.props.scrollToComment}/>;
                }
                var commentClassNames="comment";
            } else if(this.props.parent == "reporterUserStats") {
                options = <CommentActionsDisabled imagesPath={this.props.imagesPath} dateAdded={this.props.data.comment.dateAdded} likeCounter={this.props.data.comment.likesCounter} dislikeCounter={this.props.data.comment.dislikesCounter} loggedInUserRating={this.props.loggedInUserRating} emotionId={this.props.data.comment.emotionId}/>;
                commentBody = <div className="htmlText"><i className="fa fa-comment-o"></i><span className="partName">Σχόλιο: </span><span dangerouslySetInnerHTML={{__html: this.props.data.comment.body}}></span></div>;
                if(this.props.data.comment.discussionThread.discussion_thread_type_id == 2)
                    annotatedText = <div className="htmlText"><i className="fa fa-file-text-o"></i><span className="partName">Τμήμα κειμένου: </span><span dangerouslySetInnerHTML={{__html: this.props.data.article_name}}></span></div>;
                else
                    annotatedText = <div className="htmlText"><i className="fa fa-file-text-o"></i><span className="partName">Όνομα άρθρου: </span><span dangerouslySetInnerHTML={{__html: this.props.data.article_name}}></span></div>;
                var replyBox = <div></div>;
                var commentClassNames="comment";
            } else if(this.props.parent == "comment") {
                options = <CommentActionsEnabled imagesPath={this.props.imagesPath} userDefined={this.props.userDefined} handleReply={this.handleReply} source={2} id={this.props.data.id} dateAdded={this.props.data.dateAdded} likeCounter={this.props.data.likesCounter} dislikeCounter={this.props.data.dislikesCounter} loggedInUserRating={this.props.loggedInUserRating} />;
                avatarDiv =<div className='avatar'><img src={this.props.data.avatarUrl ? this.props.data.avatarUrl : "/assets/images/profile_default.jpg"} /></div>;

                if (this.props.data.profileUrl)
                    commenterName = <span className="commentAuthor"><a target="_blank" href={this.props.data.profileUrl}>{this.props.data.fullName}</a></span>;
                else
                    commenterName = <span className="commentAuthor">{this.props.data.fullName}</span>;
                commentBody = <div className="htmlText"><i className="fa fa-comment-o"></i><span className="partName">Σχόλιο: </span><span dangerouslySetInnerHTML={{__html: this.props.data.body}}></span></div>;
                var replyBox = <div></div>;
                var replies = <div></div>;
                var commentClassNames="comment replyComment";
            }
            if(this.props.parent == "reporter") {
                if(this.props.data.userAnnotatedText != null) {
                    if(this.props.data.userAnnotatedText)
                        if(this.props.data.discussionThread.discussion_thread_type_id == 2)
                            annotatedText = <div className="htmlText"><i className="fa fa-file-text-o"></i><span className="partName">Τμήμα κειμένου: </span><span dangerouslySetInnerHTML={{__html: this.props.data.userAnnotatedText}}></span></div>;
                        else
                            annotatedText = <div className="htmlText"><i className="fa fa-file-text-o"></i><span className="partName">Όνομα άρθρου: </span><span dangerouslySetInnerHTML={{__html: this.props.data.userAnnotatedText}}></span></div>;
                }
            }
            if(taggedProblems.length > 0 || taggedTopics.length > 0)
                topicsHtml = <div className="tags htmlText"><i className="fa fa-thumb-tack"></i><span className="partName">Θέματα: </span> {taggedProblemsContainer} {taggedTopicsContainer}</div>;
            if(this.props.data.commentReplies!= undefined)
                if(this.props.data.commentReplies.length > 0) {
                    var replyTitle = <div className="replyTitle">Απαντήσεις σε αυτό το σχόλιο:</div>;
                }
            return (
                <div className={commentClassNames} id={this.props.data.id}>
                    {avatarDiv}
                    <div className='body'>
                        {commenterName}{editIcon}{shareBtn}
                        {commentBody}
                        {emotion}
                        {annotatedText}
                        {topicsHtml}
                    </div>
                    {options}
                    <div className={iconsClasses}>
                        <a data-toggle="tooltip" data-original-title="Το σχόλιο εισήχθει μετά τη λήξη της διαβούλευσης"><img src="/assets/images/closed.gif"/></a>
                     </div>
                        {replyBox}
                        {replyTitle}
                        {replies}
                </div>
            );
        }
    });

    var CommentActionsEnabled = React.createClass({
        getInitialState: function(){
            return {
                likeCounter: this.props.likeCounter,
                dislikeCounter: this.props.dislikeCounter,
                liked : this.props.loggedInUserRating,  //if not null it means has liked/disliked this comment
                source: this.props.source, //source =1 for democracIt, source = 2 for opengov
                handleReply: this.props.handleReply
            };
        },
        postRateCommentAndRefresh: function(){
            var instance = this;
            //todo: make ajax call and increment decremet the counters.
            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: "/comments/rate",
                data: { comment_id : this.props.id , liked : instance.state.liked},
                beforeSend:function(){},
                success : function(response){},
                complete: function(){
                    instance.setState(instance.state);
                },
                error:function(err){ console.log(err)}
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

        render: function() {
            var replyClasses = classNames("reply",{hide: this.state.source ==2})//,{hide: this.props.data.source.commentSource ==2}); //hide for opengov
            var agreeClasses = classNames("agree", {active: this.state.liked===true});
            var disagreeClasses = classNames("disagree", {active: this.state.liked ===false});
            var date =moment(this.props.dateAdded).format('llll');

            return (
                <div className="optionsContainer">
                    <div className="options">
                        <a className={agreeClasses} onClick={this.handleLikeComment}>
                            Συμφωνώ<i className="fa fa-thumbs-o-up"></i>

                        </a><span className="c"> ({this.state.likeCounter})</span>
                        <a className={disagreeClasses} onClick={this.handleDislikeComment}>
                            Διαφωνώ<i className="fa fa-thumbs-o-down"></i>
                        </a> <span className="c"> ({this.state.dislikeCounter})</span>
                        <a className={replyClasses} onClick={this.state.handleReply}>Απάντηση <i className="fa fa-reply"></i></a>
                        <span className="date">{date}</span>
                    </div>
                </div>
            );
        }
    });
    var CommentActionsDisabled = React.createClass({
        getInitialState: function(){
            return {
                likeCounter: this.props.likeCounter,
                dislikeCounter: this.props.dislikeCounter,
                liked : this.props.loggedInUserRating  //if not null it means has liked/disliked this comment
            };
        },
        render: function() {
            var agreeClasses = classNames("agree", {active: this.state.liked===true});
            var disagreeClasses = classNames("disagree", {active: this.state.liked ===false});
            var date =moment(this.props.dateAdded).format('llll');
            return (
                <div className="optionsContainerDisabled">
                    <div className="options">
                        <div className={agreeClasses}>
                            Χρήστες που συμφωνούν<i className="fa fa-thumbs-o-up"></i>
                        </div><span className="c"> ({this.state.likeCounter})</span>
                        <div className={disagreeClasses}>
                            Χρήστες που διαφωνούν<i className="fa fa-thumbs-o-down"></i>
                        </div> <span className="c"> ({this.state.dislikeCounter})</span>
                        <span className="date">{date}</span>
                    </div>
                </div>
            );
        }
    });
})()


