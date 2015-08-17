scify.ConsultationDisplayAllPageHandler = function(consultations ){
    this.consultations = consultations;
}

scify.ConsultationDisplayAllPageHandler.prototype = function(){

    var init = function(){
        var instance = this;

        for (var i=0; i<instance.consultations.length; i ++)
        {
            instance.consultations[i].unshift((i+1)+'.');
        }

        $('#consultations').DataTable( {
            data: instance.consultations,
            columns: [
                { title: '#' },
                { title: 'Λήξη' },
                { title: 'Τίτλος' },
                { title: "άρθρα" },
                //{ title: "Διάρκεια" },
                //{ title: "Λήξη" }
            ],
            "lengthMenu": [[25, 50,100, -1], [25, 50,100, "Όλες"]],
            language: {
                "sProcessing":   "Επεξεργασία...",
                "sLengthMenu":   "_MENU_ ανα σελίδα",
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