"use strict";

window.scify = window.scify || {}; //define global namespace

scify.ReactLoader = React.createClass({
    displayName: "ReactLoader",

    render: function render() {

        if (this.props.display) return React.createElement(
            "div",
            { className: "loading-wrp" },
            React.createElement(
                "div",
                { className: "spinner-loader" },
                "..."
            )
        );else return React.createElement("div", null);
    }
});

(function () {

    var handleAjaxLoginErrors = function handleAjaxLoginErrors(event, request, settings) {
        if (request.status == 401) {

            displayNotLoggedIn(request);
        }

        if (request.status == 403) {
            swal({
                title: "Oops...",
                text: response.body,
                html: true });
        }
    },
        displayNotLoggedIn = function displayNotLoggedIn(request) {
        var nonLoggedInLabel = $("body").data("not-authorized").replace("{0}", "<a href=\"" + request.responseJSON + "\">").replace("{1}", "</a>");

        swal({
            title: $("body").data("login-title"),
            text: nonLoggedInLabel,
            html: true
        });
    },
        initToolTips = function initToolTips() {
        $("[data-toggle=\"tooltip\"]").tooltip();
    },
        initGoogleEvents = function initGoogleEvents() {

        $("a[data-event='contact']").click(function () {
            ga("send", "event", "Contact", "contact", "clicked contact us");
            return true;
        });
    };

    $(document).ajaxError(handleAjaxLoginErrors);
    $(function () {
        initToolTips();
        initGoogleEvents();
    });
})();

//# sourceMappingURL=common-compiled.js.map