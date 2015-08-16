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
            ],
            language: {
                "sProcessing":   "Επεξεργασία...",
                "sLengthMenu":   "Δείξε _MENU_ εγγραφές",
                "sZeroRecords":  "Δεν βρέθηκαν εγγραφές που να ταιριάζουν",
                "sInfo":         "Δείχνοντας _START_ εως _END_ από _TOTAL_ εγγραφές",
                "sInfoEmpty":    "Δείχνοντας 0 εως 0 από 0 εγγραφές",
                "sInfoFiltered": "(φιλτραρισμένες από _MAX_ συνολικά εγγραφές)",
                "sInfoPostFix":  "",
                "sSearch":       "Αναζήτηση:",
                "sUrl":          "",
                "oPaginate": {
                    "sFirst":    "Πρώτη",
                    "sPrevious": "Προηγούμενη",
                    "sNext":     "Επόμενη",
                    "sLast":     "Τελευταία"
                }
            }
        } );
    }

    return {
        init:init
    }

}();