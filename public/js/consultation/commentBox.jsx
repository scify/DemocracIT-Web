(function(){


    scify.CommentBox = React.createClass({
        getInitialState : function(){
            return {comments: []};
        },
        getCommentsFromServer : function(url){
            var instance = this;
            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                beforeSend: function(){
                    instance.state.loading=true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                    instance.state.loading=false;
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
            data.discussionthreadid = this.props.discussionthreadid;

            //Render it before it is saved
            var comment = {
                    fullName : "full name",
                    body : data.comment,
                    annText: data.text,
                    annTagId: data.annTagId,
                    tagText: data.tagText,
                    dateAdded : new Date()
                };
            instance.state.comments.push(comment);
            instance.state.saving=true;
            instance.state.display=true;
            instance.setState(instance.state);

            //todo: cancel any previous events
            $.ajax({
                method: "POST",
                url: url,
                data:data,
                success : function(comment){
                    instance.state.saving=false;
                    instance.setState(instance.state);
                },
                error: function(error){
                    alert(error)
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
            if (this.state.loading)
            {
                return (
                    <div className="loading-wrp">
                        <div className="spinner-loader">
                            Φόρτωση
                        </div>
                    </div>
                );
            }
            var classes = classNames("commentBox",{ hide :!this.state.display});

            return (
                <div className={classes}>
                    <a onClick={toggleBox}>{this.state.display? "Κλεισιμο" : "Ανοιγμα"}</a>
                    <CommentForm consultationid={this.props.consultationid}
                                 articleid={this.props.articleid}
                                 />
                    <CommentList data={this.state.comments} />
                </div>

            );
        }
    });
    var CommentForm = React.createClass({
        render: function() {
            return (
                <div className="commentForm">
                    {/*
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
                     */}
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


