scify.ConsultationDisplayAllPageHandler = function(consultations, messages){
    this.consultations = consultations;
    this.messages = messages;
    console.log(messages);
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
                { title: this.messages.end },
                { title: this.messages.title },
                { title: this.messages.articlePlural },
                //{ title: "Διάρκεια" },
                //{ title: "Λήξη" }
            ],
            "lengthMenu": [[25, 50,100, -1], [25, 50,100, "Όλες"]],
            language: {
                "sProcessing":   this.messages.editMsg + "...",
                "sLengthMenu":   "_MENU_ " + this.messages.perPage,
                "sZeroRecords":  this.messages.noRecords,
                "sInfo":         this.messages.showing + " _START_ " + this.messages.to + " _END_ " + this.messages.from + " _TOTAL_ " + this.messages.records,
                "sInfoEmpty":    this.messages.showing + " 0 " + this.messages.to + " 0 " + this.messages.from + " 0 " + this.messages.records,
                "sInfoFiltered": this.messages.sortedBy + " _MAX_ " + this.messages.totalRecords,
                "sInfoPostFix":  "",
                "sSearch":       this.messages.search + ":",
                "sUrl":          "",
                "oPaginate": {
                    "sFirst":    this.messages.firstPage,
                    "sPrevious": this.messages.previousPage,
                    "sNext":     this.messages.nextPage,
                    "sLast":     this.messages.lastPage
                }
            }
        } );
    }

    return {
        init:init
    }

}();