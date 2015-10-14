(function(){

    scify.commentList = React.createClass({
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
                    <scify.CommentList data={this.state.comments} parent="reporter"/>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }
    });
})()