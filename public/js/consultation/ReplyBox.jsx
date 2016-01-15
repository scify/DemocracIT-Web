(function(){
    scify.ReplyBox = React.createClass({
        //getInitialState : function() {
        //    return {
        //        display: this.props.display, //should this reply box be visible
        //        parentId: this.props.parentId //the Id of the comment this reply box belongs to
        //    }
        //},

        render: function() {
            if(this.props.display) {
                return (
                    <div>Hello</div>
                );
            } else {
                return (
                    <div></div>
                );
            }
        }

    });

})()