(function(){

    scify.UserBox = React.createClass({
        getInitialState: function() {
          return {
              consultationid: this.props.consultationid,
              userId: this.props.userId,
              user: this.props.user
          };
        },
        fetchInfo: function() {
            var domElementToAddComponent = document.getElementById("info_" + this.props.userId);
            var infoBoxProperties = {
                consultationid          : this.props.consultationid,
                userId                  : this.props.userId,
                user                    : this.props.user
            };
            React.render(React.createElement(scify.InfoBox, infoBoxProperties), domElementToAddComponent);
        },
        render: function() {

            var infoBoxClasses = classNames("infoBox",{ hide :!this.state.display});
            return (
                <div className="" onClick={this.fetchInfo}>
                    <a>{this.props.user.first_name} {this.props.user.last_name} ({this.props.user.role})</a>
                    <div className="infoBox" id={"info_" + this.props.user.user_id}></div>
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
        componentWillMount: function() {
            console.log(this.props.userId);
            this.getCommentsFromServer();
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


