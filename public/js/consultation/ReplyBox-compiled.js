"use strict";

(function () {
    scify.ReplyBox = React.createClass({
        displayName: "ReplyBox",

        //getInitialState : function() {
        //    return {
        //        display: this.props.display, //should this reply box be visible
        //        parentId: this.props.parentId //the Id of the comment this reply box belongs to
        //    }
        //},

        render: function render() {
            if (this.props.display) {
                return React.createElement(
                    "div",
                    null,
                    "Hello"
                );
            } else {
                return React.createElement("div", null);
            }
        }

    });
})();

//# sourceMappingURL=ReplyBox-compiled.js.map