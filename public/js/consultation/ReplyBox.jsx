(function(){
    scify.ReplyBox = React.createClass({
        //getInitialState : function() {
        //    return {
        //        display: this.props.display, //should this reply box be visible
        //        parentId: this.props.parentId //the Id of the comment this reply box belongs to
        //    }
        //},
        handleReplySave: function() {
            console.log("sdfasdf");
        },
        render: function() {
            if(this.props.display) {
                return (
                    React.createElement('form', {className: 'ContactForm', onSubmit:this.handleReplySave},
                        React.createElement('textarea', {
                            className:'replyInput',
                            type: 'text',
                            placeholder: "θα ήθελα να δηλώσω..."
                        }),
                        React.createElement('button', {type: 'submit', className:'btn blue replyBtn'}, "Καταχώρηση")
                    )
                );
            } else {
                return (
                    <div></div>
                );
            }
        }

    });

})()