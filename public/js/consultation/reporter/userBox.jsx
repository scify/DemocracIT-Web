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
                    <scify.InfoBox display={this.state.display} busy={this.state.busy} data={this.state.comments}/>
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
            if(this.props.display) {
                if (this.props.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.props.busy}/>
                        </div>
                    );
                }
                return (
                    <scify.CommentList data={this.props.data} parent="reporter"/>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }
    });

    scify.CommentsForArticle = React.createClass({
        getInitialState: function() {
            return {
                display: this.props.display
            };
        },
        render: function() {
            if(this.props.display) {
                if (this.props.busy) {
                    return (
                        <div>
                            <scify.ReactLoader display={this.props.busy}/>
                        </div>
                    );
                }
                return (
                    <scify.CommentList data={this.props.data} parent="reporter"/>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }
    });

})()


