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
            return (
                <div className="" onClick={this.fetchInfo}>
                    {this.props.user.first_name} {this.props.user.last_name} ({this.props.user.role})
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
                user: this.props.user
            };
        },
        render: function() {
            return (
                <div className="info">
                    Hello
                </div>
            );
        }
    });

})()


