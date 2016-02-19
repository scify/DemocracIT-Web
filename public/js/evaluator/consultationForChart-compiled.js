"use strict";

(function () {

    scify.consultationForChart = React.createClass({
        displayName: "consultationForChart",

        getInitialState: function getInitialState() {
            return {
                consultations: [],
                displayedConsultations: [],
                busy: false,
                display: false,
                page: 10,
                shouldDisplayLoadMoreBtn: true,
                messages: this.props.evaluationMessages
            };
        },
        displayNextBatch: function displayNextBatch(event) {
            //event.preventDefault();
            var loaded = this.state.displayedConsultations.length;
            var nextBatchMargin = this.state.page;
            var toLoad = loaded + nextBatchMargin;
            if (toLoad > this.state.consultations.length) {
                toLoad = this.state.consultations.length;
                this.state.shouldDisplayLoadMoreBtn = false;
            }
            this.state.displayedConsultations = this.state.consultations.slice(0, toLoad);
            this.setState(this.state);
        },
        getConsultationsFromServer: function getConsultationsFromServer(cons_ids) {
            //console.log(cons_ids)
            this.state.consultations = [];
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/evaluator/consultations/get",
                data: { cons_ids: cons_ids },
                beforeSend: function beforeSend() {
                    instance.state.consultations = [];
                    instance.state.displayedConsultations = [];
                    instance.state.busy = true;
                    instance.state.display = true;
                    instance.setState(instance.state);
                },
                success: function success(data) {
                    //console.log(data);
                    instance.state.consultations = data;
                },
                complete: function complete() {
                    instance.state.busy = false;
                    instance.state.display = true;
                    instance.displayNextBatch.call(instance);
                },
                error: function error(x, z, y) {
                    console.log(x);
                }
            });
            return promise;
        },
        render: function render() {
            var instance = this;
            if (this.state.display) {
                if (this.state.busy) {
                    return React.createElement(
                        "div",
                        null,
                        React.createElement(scify.ReactLoader, { display: this.state.busy })
                    );
                } else {
                    var divToDisplay = [];
                    console.log(instance.state.displayedConsultations.length);
                    instance.state.displayedConsultations.forEach(function (consultation) {
                        //console.log(consultation);
                        divToDisplay.push(React.createElement(
                            "div",
                            { className: "consItem comment" },
                            React.createElement(
                                "div",
                                { className: "consTitle" },
                                React.createElement(
                                    "a",
                                    { href: "/consultation/" + consultation.id },
                                    consultation.title
                                )
                            ),
                            React.createElement(
                                "div",
                                null,
                                instance.state.messages.dateWhenConsWasActive,
                                ":",
                                React.createElement(
                                    "span",
                                    { className: "consDate" },
                                    new Date(consultation.start_date).toLocaleDateString("el-EL", { hour: "2-digit" })
                                ),
                                " ",
                                instance.state.messages.consTo,
                                " ",
                                React.createElement(
                                    "span",
                                    { className: "consDate" },
                                    new Date(consultation.end_date).toLocaleDateString("el-EL", { hour: "2-digit" })
                                )
                            )
                        ));
                    });
                    var loadMoreBtnClasses = classNames("loadMoreBtn", { hide: !instance.state.shouldDisplayLoadMoreBtn });
                    return React.createElement(
                        "div",
                        { className: "commentList" },
                        divToDisplay,
                        React.createElement(
                            "div",
                            { className: loadMoreBtnClasses, onClick: this.displayNextBatch },
                            "load more ",
                            React.createElement(
                                "div",
                                { className: "loadMoreIcon" },
                                React.createElement("i", { className: "fa fa-sort-desc" })
                            )
                        )
                    );
                }
            } else {
                return React.createElement("div", null);
            }
        }
    });
})();

//# sourceMappingURL=consultationForChart-compiled.js.map