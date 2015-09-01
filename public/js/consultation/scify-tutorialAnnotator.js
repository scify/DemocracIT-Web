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

            if(checkAndReadCookie()) {
                $('[data-id="ann-0"]').trigger("mouseover");
                startIntro();
            }

            $( "#tutorial" ).on( "click", function() {
                $('[data-id="ann-0"]').trigger("mouseover");
                startIntro();
            });
        },
        checkAndReadCookie = function() {
            var tutorialCookie = getCookie("tutorialCookie");
            console.log(tutorialCookie);
            if (tutorialCookie!="") {
                return false;
            } else {
                setCookie("tutorialCookie", "tutorial", 5*365);
                console.log(tutorialCookie);
            }
            return true;
        },
        getCookie = function(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0)==' ') c = c.substring(1);
                if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
            }
            return "";
        },
        setCookie = function(cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays*24*60*60*1000));
            var expires = "expires="+d.toUTCString();
            document.cookie = cname + "=" + cvalue + "; " + expires;
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