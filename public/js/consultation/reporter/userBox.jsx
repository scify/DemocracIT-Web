(function(){

    scify.UserBox = React.createClass({
        getInitialState: function() {
          return {
              consultationid: this.props.consultationid,
              userId: this.props.userId,
              user: this.props.user,
              comments: [],
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
                    instance.state.comments = data;
                },
                complete: function(){
                    instance.state.busy=false;
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
                <div className="" onClick={this.getCommentsFromServer}>
                    <a>{this.props.user.first_name} {this.props.user.last_name} ({this.props.user.role})</a>
                    <scify.InfoBox busy={this.state.busy} data={this.state.comments}/>
                </div>
            );
        }
    });


    scify.InfoBox = React.createClass({
        getInitialState: function() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user
            };
        },
        render: function() {

            if (this.state.busy)
            {
                return (
                    <div>
                        <scify.ReactLoader display={this.props.busy} />
                    </div>
                );
            }
            //todo: iterate to data and display
            return (
                <div className="info">
                    Hello
                </div>
            );
        }
    });

})()


