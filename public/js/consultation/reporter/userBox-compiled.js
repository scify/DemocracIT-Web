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
        render: function render() {
            return React.createElement(
                "div",
                { className: "", onClick: this.fetchInfo },
                this.props.user.first_name,
                " ",
                this.props.user.last_name,
                " (",
                this.props.user.role,
                ")",
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