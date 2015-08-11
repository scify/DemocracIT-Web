window.scify = window.scify || {}; //define global namespace

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
