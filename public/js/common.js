window.scify = window.scify || {}; //define global namespace

$(document).ajaxError(function(event, request, settings){

    if (request.status == 401)
    {

        swal({
            title: "Είσοδος",
            text: 'Για αυτή την ενέργεια χρειάζεται να είστε <a href="'+request.responseJson+'">συνδεδεμένοι</a>',
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
});