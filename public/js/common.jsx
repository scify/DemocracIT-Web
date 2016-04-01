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

            displayNotLoggedIn(request);
        }

        if (request.status == 403)
        {
            swal({
                title: "Oops...",
                text: response.body,
                html: true});
        }
    },
    displayNotLoggedIn = function(request) {
        swal({
            title: "Είσοδος",
            text: 'Για αυτή την ενέργεια χρειάζεται να είστε <a href="'+request.responseJSON+'">συνδεδεμένοι</a>',
            html: true
        });
    },
    initToolTips = function(){
        $('[data-toggle="tooltip"]').tooltip()
    };
    initGoogleEvents = function(){

        $("a[data-event='contact']").click(function(){
            ga('send', 'event', 'Contact', 'contact', 'clicked contact us');
            return true;
        });
    }

    $(document).ajaxError(handleAjaxLoginErrors);
    $(function(){
        initToolTips();
        initGoogleEvents();
    })
})();
