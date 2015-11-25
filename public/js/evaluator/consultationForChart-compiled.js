"use strict";

(function () {

    scify.consultationForChart = React.createClass({
        displayName: "consultationForChart",

        getInitialState: function getInitialState() {
            return {
                consultations: [],
                busy: false,
                display: false
            };
        },
        getConsultationsFromServer: function getConsultationsFromServer(cons_ids) {
            console.log(cons_ids);
            this.state.consultations = [];
            var instance = this;
            var promise = $.ajax({
                method: "POST",
                url: "/evaluator/consultations/get",
                data: { cons_ids: cons_ids },
                beforeSend: function beforeSend() {
                    instance.state.consultations = [];
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
                    instance.setState(instance.state);
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
                    instance.state.consultations.forEach(function (consultation) {
                        console.log(consultation);
                        divToDisplay.push(React.createElement(
                            "div",
                            { className: "consItem comment" },
                            React.createElement(
                                "div",
                                { className: "consTitle" },
                                consultation.title
                            ),
                            React.createElement(
                                "div",
                                null,
                                "Ημερομηνία που ήταν ανοιχτή η διαβούλευση: ",
                                React.createElement(
                                    "span",
                                    { className: "consDate" },
                                    new Date(consultation.start_date).toLocaleDateString("el-EL", { hour: "2-digit" })
                                ),
                                " έως ",
                                React.createElement(
                                    "span",
                                    { className: "consDate" },
                                    new Date(consultation.end_date).toLocaleDateString("el-EL", { hour: "2-digit" })
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "linkToCons" },
                                "Δείτε τη διαβούλευση ",
                                React.createElement(
                                    "a",
                                    { href: "/consultation/" + consultation.id },
                                    "εδώ"
                                )
                            ),
                            React.createElement(
                                "div",
                                { className: "linkToCons" },
                                "Δείτε τη διαβούλευση στο ",
                                React.createElement(
                                    "a",
                                    { href: consultation.opengov_url },
                                    "opengov"
                                )
                            )
                        ));
                    });
                    return React.createElement(
                        "div",
                        { className: "commentList" },
                        divToDisplay
                    );
                }
            } else {
                return React.createElement("div", null);
            }
        }
    });
})();

//# sourceMappingURL=consultationForChart-compiled.js.map