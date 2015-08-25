"use strict";

(function () {

    scify.UserBox = React.createClass({
        displayName: "UserBox",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user
            };
        },
        fetchInfo: function fetchInfo() {
            var domElementToAddComponent = document.getElementById("info_" + this.props.userId);
            var infoBoxProperties = {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user
            };
            React.render(React.createElement(scify.InfoBox, infoBoxProperties), domElementToAddComponent);
        },
        getCommentsFromServer: function getCommentsFromServer() {
            var instance = this;

            var promise = $.ajax({
                method: "GET",
                url: "/comments/retrieve",
                cache: false,
                data: {
                    consultationId: this.props.consultationid,
                    userId: this.props.userId
                },
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    instance.state.allComments = data;
                    instance.state.busy = false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function error(x, z, y) {
                    alert(x);
                }
            });

            return promise;
        },
        render: function render() {
            /*if (this.state.busy)
            {
                return (
                    <div>
                        <scify.ReactLoader display={this.state.busy} />
                    </div>
                );
            }*/
            var infoBoxClasses = classNames("infoBox", { hide: !this.state.display });
            return React.createElement(
                "div",
                { className: "", onClick: this.fetchInfo },
                React.createElement(
                    "a",
                    null,
                    this.props.user.first_name,
                    " ",
                    this.props.user.last_name,
                    " (",
                    this.props.user.role,
                    ")"
                ),
                React.createElement("div", { className: "infoBox", id: "info_" + this.props.user.user_id })
            );
        }
    });

    scify.InfoBox = React.createClass({
        displayName: "InfoBox",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user
            };
        },
        render: function render() {
            return React.createElement(
                "div",
                { className: "info" },
                "Hello"
            );
        }
    });
})();

//# sourceMappingURL=userBox-compiled.js.map