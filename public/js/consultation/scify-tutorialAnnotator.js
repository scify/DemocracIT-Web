scify.TutorialAnnotator = function() {

}
scify.TutorialAnnotator.prototype = (function(){

    var init = function(){
            $(".title").find(".ann-icon").each(function(index){
                //Added this block of code for creating the final step of the tutorial
                if(index == 0) {
                    $(this).attr( "id", "step5" );
                }
                //
                $(this).attr("title","κλικ εδώ για σχολιασμού όλου του άρθρου");
            });

            $( "#tutorial" ).on( "click", function() {
                $('[data-id="ann-0"]').trigger("mouseover");
                startIntro();
            });
        },
        startIntro = function() {
            var intro = introJs();
            intro.setOptions({
                steps: [
                    {
                        element: '#step1',
                        intro: "Μπορείτε να δείτε το περιεχόμενο ενός άρθρου πατώντας πάνω του και να σχολιάσετε τα άρθρα της διαβούλευσης κάνοντας mouseover στο άρθρο"
                    },
                    {
                        element: '#step2',
                        intro: "Πατώντας σε αυτή την καρτέλα βλέπετε τους σχετικούς νόμους",
                        position: 'bottom'
                    },
                    {
                        element: '#step3',
                        intro: 'Πατώντας εδω μπορείτε να δείτε τη σελίδα με τα στατιστικά της διαβούλευσης'
                    },
                    {
                        element: '#step4',
                        intro: "Πατώντας εδω μπορείτε να δείτε το σχετικό υλικό"
                    },
                    {
                        element: '#step5',
                        intro: 'Πατώντας επάνω στο μολυβάκι μπορείτε να σχολιάσετε το περιεχόμενο του άρθρου'
                    }
                ]
            });
            intro.start();
        };
    return {
        init:init
    }
})();