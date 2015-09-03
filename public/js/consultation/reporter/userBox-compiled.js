"use strict";

(function () {

    scify.UserBox = React.createClass({
        displayName: "UserBox",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user,
                comments: [],
                busy: false,
                display: false
            };
        },
        getCommentsFromServer: function getCommentsFromServer() {
            var instance = this;
            var promise = $.ajax({
                method: "GET",
                url: "/comments/cons/retrieve",
                cache: false,
                data: {
                    consultationId: this.props.consultationid,
                    userId: this.props.userId
                },
                beforeSend: function beforeSend() {
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    instance.state.comments = data;
                    console.log(data);
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                error: function error(x, z, y) {
                    console.log(x);
                }
            });

            return promise;
        },
        render: function render() {

            return React.createElement(
                "div",
                { className: "", onClick: this.getCommentsFromServer },
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
                React.createElement(scify.InfoBox, { display: this.state.display, busy: this.state.busy, data: this.state.comments })
            );
        }
    });

    scify.InfoBox = React.createClass({
        displayName: "InfoBox",

        getInitialState: function getInitialState() {
            return {
                consultationid: this.props.consultationid,
                userId: this.props.userId,
                user: this.props.user,
                display: this.props.display
            };
        },
        render: function render() {
            if (this.props.display) {
                if (this.props.busy) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(scify.ReactLoader, { display: this.props.busy })
                    );
                }
                //todo: iterate to data and display
                return React.createElement(CommentList, { data: this.props.data });
            } else {
                return React.createElement("div", null);
            }
        }
    });
})();

//# sourceMappingURL=userBox-compiled.js.map