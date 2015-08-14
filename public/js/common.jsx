window.scify = window.scify || {}; //define global namespace

scify.ReactLoader = React.createClass({
    render:function(){

        if (this.props.display)
            return (
                <div className="loading-wrp">
                    <div className="spinner-loader">
                        ...
                    </div>
                </div>
            );
            else
                return (<div></div>);
    }
});

(function(){

var handleAjaxLoginErrors = function(event, request, settings){
        if (request.status == 401)
        {

            swal({
                title: "Είσοδος",
                text: 'Για αυτή την ενέργεια χρειάζεται να είστε <a href="'+request.responseJSON+'">συνδεδεμένοι</a>',
                html: true
            });
        }

        if (request.status == 403)
        {
            swal({
                title: "Oops...",
                text: response.body,
                html: true});
        }
    },
    initToolTips = function(){
        $('[data-toggle="tooltip"]').tooltip()
    };

    $(document).ajaxError(handleAjaxLoginErrors);
    $(function(){
        initToolTips();
    })
})();
