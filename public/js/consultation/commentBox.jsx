var scify = scify || {};


var CommentList = React.createClass({
        render: function() {
            var commentNodes = this.props.data.map(function (comment) {
                    return (
                            <Comment data={comment} />
                            );
                });

            return (
                        <div className="commentList">
                            {commentNodes}
                        </div>
                    );
            }
        });

var CommentBox = React.createClass({
        getInitialState : function(){
           return {comments: []};
        },
        refreshComments : function(url){
            var instance = this;
            //todo: cancel previous event
            //todo: display loading icon.
            $.ajax({
                method: "POST",
                url: url,
                beforeSend: function(){

                },
                success : function(data){
                    instance.state.comments = data;
                    instance.setState(instance.state);
                },
                error: function(x,z,y){
                    alert(x)
                }
            })
        },
        render: function() {
            return (
                <div className="commentBox">
                <CommentForm />
                <CommentList data={this.state.comments} />
                </div>
             );
        }
});

var CommentForm = React.createClass({
    render: function() {
        return (
            <div className="commentForm">
            <textarea placeholder="leave your comment here"></textarea>
        </div>
        );
    }
});
var Comment = React.createClass({
        render: function() {
            return (
                <div className="comment">
                <h2 className="commentAuthor">
                {this.props.data.fullName}
        </h2>
        {this.props.data.body}
    </div>
);
}
});


$(function(){
    scify.commentBox = React.render(<CommentBox/>, document.getElementById('comment-box-wrp'));
})
