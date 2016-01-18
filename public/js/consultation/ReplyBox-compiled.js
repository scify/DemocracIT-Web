'use strict';

(function () {
    scify.ReplyBox = React.createClass({
        displayName: 'ReplyBox',

        //getInitialState : function() {
        //    return {
        //        display: this.props.display, //should this reply box be visible
        //        parentId: this.props.parentId //the Id of the comment this reply box belongs to
        //    }
        //},
        handleReplySave: function handleReplySave(event) {
            event.preventDefault();
            console.log($('td[name=replyTextArea]'));
        },
        render: function render() {
            if (this.props.display) {
                return React.createElement('form', { className: 'ContactForm', onSubmit: this.handleReplySave }, React.createElement('textarea', {
                    className: 'replyInput',
                    type: 'text',
                    placeholder: 'θα ήθελα να δηλώσω...',
                    name: 'replyTextArea'
                }), React.createElement('button', { type: 'submit', className: 'btn blue replyBtn' }, 'Καταχώρηση'));
            } else {
                return React.createElement('div', null);
            }
        }

    });
})();

//# sourceMappingURL=ReplyBox-compiled.js.map