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
        var nonLoggedInLabel = $("body").data("not-authorized")
                                    .replace("{0}",'<a href="'+request.responseJSON+'">')
                                    .replace("{1}",'</a>');

        swal({
            title: $("body").data("login-title"),
            text:nonLoggedInLabel,
            html: true
        });
    },
    initToolTips = function(){
        $('[data-toggle="tooltip"]').tooltip()
    },
    initGoogleEvents = function(){

        $("a[data-event='contact']").click(function(){
            ga('send', 'event', 'Contact', 'contact', 'clicked contact us');
            return true;
        });
    };

    $(document).ajaxError(handleAjaxLoginErrors);
    $(function(){
        initToolTips();
        initGoogleEvents();
    })
})();
