(function(){

    scify.ReporterCommentList = React.createClass({
        getInitialState: function() {
            return {
                articleId: this.props.articleId,
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
        getOpenGovCommentsByArticleId : function(articleId){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/forarticle/opengov",
                cache:false,
                data:{
                    articleId :articleId
                },
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                    if(data.length == 0)
                        $("#commentsOpenGov").append("<div class='noStats'>Δεν υπάρχουν σχόλια από το opengov.gr για αυτό το άρθρο.</div>")
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
            //return promise;
        },
        getDITCommentsByArticleId : function(articleId){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/forarticle/dit",
                cache:false,
                data:{
                    articleId :articleId
                },
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                    if(data.length == 0)
                        $("#commentsDIT").append("<div class='noStats'>Δεν υπάρχουν σχόλια από το democracit για αυτό το άρθρο.</div>")
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
            //return promise;
        },
        getCommentsByAnnId : function(annId, consultationId){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/byannid",
                cache:false,
                data:{
                    annId :annId,
                    consultationId: consultationId
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
            //return promise;
        },
        getCommentsByAnnIdPerArticle : function(annId, articleId){
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve/byannid/perarticle",
                cache:false,
                data:{
                    annId :annId,
                    articleId: articleId
                },
                beforeSend: function(){
                    instance.state.busy=true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                    //console.log(data);
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
            //return promise;
        },
        render: function() {
            if(this.state.display) {
                if (this.state.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.state.busy}/>
                        </div>
                    );
                }
                return (
                    <scify.CommentList
                        appState={this.props.appState}
                        consultationId={this.props.consultationId}
                        imagesPath={this.props.imagesPath}
                        consultationEndDate={this.props.consultationEndDate}
                        userId = {this.props.userId}
                        userDefined={this.props.userDefined}
                        data={this.state.comments}
                        parent="reporter"
                        shouldDisplayCommenterName={this.props.shouldDisplayCommenterName}
                        shouldDisplayEditIcon={this.props.shouldDisplayEditIcon}
                        shouldDisplayCommentEdited={this.props.shouldDisplayCommentEdited}
                        shouldDisplayShareBtn={this.props.shouldDisplayShareBtn}
                        shouldDisplayCommentBody={this.props.shouldDisplayCommentBody}
                        shouldDisplayEmotion={this.props.shouldDisplayEmotion}
                        shouldDisplayAnnotatedText={this.props.shouldDisplayAnnotatedText}
                        shouldDisplayReplyBox={this.props.shouldDisplayReplyBox}
                        shouldDisplayReplies={this.props.shouldDisplayReplies}
                        optionsEnabled={this.props.optionsEnabled}
                        shouldDisplayTopics={this.props.shouldDisplayTopics}
                        commentClassNames={this.props.commentClassNames}
                        shouldDisplayFinalLawAnnBtn={this.props.shouldDisplayFinalLawAnnBtn}/>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }
    });
})()