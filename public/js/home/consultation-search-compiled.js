"use strict";

scify.SearchContainer = React.createClass({
    displayName: "SearchContainer",

    getInitialState: function getInitialState() {
        return { isBusy: false, consultations: [], searchQuery: "" };
    },
    handleReset: function handleReset() {
        $("#consultations").stop().fadeIn();
    },
    abortAnyPendingAjaxRequest: function abortAnyPendingAjaxRequest() {
        if (this.searchRequest) //abort any pending requests
            this.searchRequest.abort();
    },
    loadConsultations: function loadConsultations(query, serializedData) {

        var instance = this;
        instance.state.searchQuery = query;
        instance.abortAnyPendingAjaxRequest();

        if (query.length == 0) {
            instance.handleReset();
            instance.setState(instance.state);
        } else if (query.length > 2) {

            instance.searchRequest = $.ajax({
                method: "GET",
                url: instance.props.url,
                data: serializedData + "&datatype=json",
                dataType: "json", //expected data type returned from the server
                beforeSend: function beforeSend() {
                    instance.state.isBusy = true;
                    instance.state.consultations = [];
                    instance.setState(instance.state);
                },
                success: function success(results) {
                    instance.state.consultations = results;
                },
                complete: function complete() {

                    instance.state.isBusy = false;
                    instance.replaceState(instance.state);
                    $("#consultations").stop().hide();
                }
            });
        }
    },
    render: function render() {
        return React.createElement(
            "div",
            null,
            React.createElement(SearchBox, { onChange: this.loadConsultations, lang: this.props.lang }),
            React.createElement(scify.ReactLoader, { display: this.state.isBusy }),
            React.createElement(SearchResultsList, { isSearching: this.state.isBusy,
                searchQuery: this.state.searchQuery,
                handeReset: this.handleReset,
                data: this.state.consultations,
                lang: this.props.lang
            })
        );
    }
});
var SearchBox = React.createClass({
    displayName: "SearchBox",

    handleKeyUp: function handleKeyUp() {
        var query = this.refs.searchInput.getDOMNode().value;
        this.props.onChange(query, $(this.refs.form.getDOMNode()).serialize());
    },
    render: function render() {
        return React.createElement(
            "div",
            { id: "search-box" },
            React.createElement(
                "div",
                { className: "wrapper" },
                React.createElement(
                    "form",
                    { ref: "form", className: "form-inline" },
                    React.createElement(
                        "div",
                        { className: "form-group" },
                        React.createElement(
                            "div",
                            { className: "box" },
                            React.createElement(
                                "span",
                                { className: "icon" },
                                React.createElement("i", { className: "fa fa-search" })
                            ),
                            React.createElement("input", { ref: "searchInput", type: "search", id: "search", name: "query", placeholder: this.props.lang.searchPlaceHolder, onKeyUp: this.handleKeyUp })
                        )
                    )
                ),
                React.createElement(
                    "a",
                    { href: "/consultation/display-all" },
                    this.props.lang.clickToDisplayAll
                )
            )
        );
    }
});
var SearchResultsList = React.createClass({
    displayName: "SearchResultsList",

    render: function render() {
        var resultNodes = this.props.data.map(function (result) {
            return React.createElement(ConsultationResult, { key: result.id, data: result });
        });

        if (this.props.isSearching) {
            return React.createElement("div", null);
        } else if (this.props.data.length > 0) {
            return React.createElement(
                "div",
                { className: "consultation-list container" },
                React.createElement(
                    "h2",
                    null,
                    this.props.lang.results.replace("{0}", this.props.data.length)
                ),
                React.createElement(
                    "div",
                    { className: "results" },
                    resultNodes
                )
            );
        } else if (this.props.data.length == 0 && this.props.searchQuery.length > 0) {
            return React.createElement(
                "div",
                { className: "consultation-list container" },
                React.createElement(
                    "h2",
                    null,
                    this.props.lang.noresults,
                    " "
                )
            );
        } else {
            return React.createElement("div", null);
        }
    }
});
var ConsultationResult = React.createClass({
    displayName: "ConsultationResult",

    render: function render() {
        var cons = this.props.data;
        var expiredLabel = this.props.data.isActive ? "λήξη:" : "έληξε:";
        var href = "/consultation/" + cons.id;
        return React.createElement(
            "div",
            { className: "consultation" },
            React.createElement("a", { href: href, dangerouslySetInnerHTML: { __html: cons.title } }),
            React.createElement("br", null),
            React.createElement(
                "span",
                { className: "duration" },
                expiredLabel,
                " ",
                cons.endDateFormatted,
                " | διάρκεια ",
                cons.totalDurationFormatted
            )
        );
    }
});

//# sourceMappingURL=consultation-search-compiled.js.map