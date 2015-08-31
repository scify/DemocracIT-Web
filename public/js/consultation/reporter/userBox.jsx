(function(){

    scify.UserBox = React.createClass({
        getInitialState: function() {
          return {
              consultationid: this.props.consultationid,
              userId: this.props.userId,
              user: this.props.user,
              comments: null
          };
        },
        getCommentsFromServer: function(){
            //retrives with ajax

            this.state.comments = []; //the comments from server
            this.replaceState(this.state);
        },
        render: function() {

            return (
                <div className="" onClick={this.getCommentsFromServer}>
                    <a>{this.props.user.first_name} {this.props.user.last_name} ({this.props.user.role})</a>
                    <scify.InfoBox data={this.state.comments}/>
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
                busy: false
            };
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
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.allComments = data;
                    instance.state.busy=false;
                    instance.state.display=true;
                    instance.setState(instance.state);

                },
                error: function(x,z,y){
                    console.log(x);
                }
            });

            return promise;
        },
        render: function() {

            if (this.state.busy)
            {
                return (
                    <div>
                        <scify.ReactLoader display={this.state.busy} />
                    </div>
                );
            }
            return (
                <div className="info">
                    Hello
                </div>
            );
        }
    });

})()


