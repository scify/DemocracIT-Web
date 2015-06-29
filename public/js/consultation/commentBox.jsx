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
                    instance.state.loading=true;
                    instance.setState(instance.state);
                },
                success : function(data){
                    instance.state.comments = data;
                    instance.state.loading=false;
                    instance.setState(instance.state);

                },
                error: function(x,z,y){
                    alert(x)
                }
            })
        },
        render: function() {
            //var classes = React.addons.classSet({
            //    'commentBox' :true,
            //    'loading': this.state.loading
            //});

            if (this.state.loading)
            {
                return (
                    <div className="loading-wrp">
                        <div className="spinner-loader">
                            Loading…
                        </div>
                    </div>
                );
            }

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
var Comment = React.createClass({
        render: function() {
            var date =moment(this.props.data.dateAdded).format('llll');
             //new Date(this.props.data.dateAdded).toDateString()
            // console.log(this.props.data.dateAdded);
            return (
                <div className="comment">
                    <div className='avatar'>
                        <img src="/assets/images/profile_default.jpg" />
                    </div>
                    <div className='body'>
                        <span className="commentAuthor">{this.props.data.fullName}</span>
                        <span dangerouslySetInnerHTML={{__html: this.props.data.body}}></span>
                    </div>
                    <div className="options">
                        <a className="agree" href="#">Συμφωνώ<i className="fa fa-thumbs-o-up"></i></a>
                        <a className="disagree" href="#">Διαφωνώ<i className="fa fa-thumbs-o-down"></i></a>
                        <a className="reply" href="#">Απάντηση <i className="fa fa-reply"></i></a>
                        <span className="date">{date}</span>
                    </div>
                </div>
);
}
});


$(function(){
    scify.commentBox = React.render(<CommentBox/>, document.getElementById('comment-box-wrp'));
})
