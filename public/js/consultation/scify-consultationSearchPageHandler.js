scify.ConsultationSearchPageHandler = function(consultations ){
    this.consultations = consultations;
}

scify.ConsultationSearchPageHandler.prototype = function(){

    var init = function(){
        var instance = this;

        $('#consultations').DataTable( {
            data: instance.consultations,
            columns: [
                { title: 'Λήξη' },
                { title: 'Τίτλος' },
                { title: "άρθρα" },
                //{ title: "Διάρκεια" },
                //{ title: "Λήξη" }
            ]
        } );
    }

    return {
        init:init
    }

}();