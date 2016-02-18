scify.TutorialAnnotator = function(consultationIsActive, assetsUrl) {
    this.consultationIsActive = consultationIsActive;
    this.assetsUrl = assetsUrl;
}
scify.TutorialAnnotator.prototype = (function(){
    this.stepsForTutorial = [];
    var init = function(){
            var instance = this;
            var elementToAddStep5;
            var shouldAddStep5 = true;
            $(".title").find(".ann-icon").each(function(index){
                //Added this block of code for creating the final step of the tutorial
                if(index == 0) {
                    $(this).attr( "id", "step4" );
                    $(this).attr( "tutorial-id", "clicked");
                    //elementToAddStep5 is the first link to load comments
                    elementToAddStep5 = $(".article:first").find(".load:first");
                    //if the consultation is new (no comments yet), the element is empty
                    //so we should attach the step to the first annotation area
                    //if the element is not found, it means that we do not have comments in the first article.
                    if(elementToAddStep5.length == 0) {
                        shouldAddStep5 = false
                    } else {
                        $(elementToAddStep5).attr("id", "step5");
                    }
                }
                $(this).attr("title","κλικ εδώ για σχολιασμού όλου του άρθρου");
            });

            $("[data-id='ann-1']").find(".ann-icon").attr( "id", "step3" );
            if(checkAndReadCookie()) {
                $('[data-id="ann-0"]').find(".ann-icon").addClass("on");
                $("[data-id='ann-1']").find(".ann-icon").addClass("on");
                startIntro.call(instance, shouldAddStep5);
            }

            $( "#tutorial" ).on( "click", function() {
                $('[data-id="ann-0"]').find(".ann-icon").addClass("on");
                $("[data-id='ann-1']").find(".ann-icon").addClass("on");
                startIntro.call(instance, shouldAddStep5);
            });

        },
        checkAndReadCookie = function() {
            var tutorialCookie = getCookie("tutorialCookie");
            //console.log(tutorialCookie);
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
        startIntro = function(shouldAddStep5) {
            var intro = introJs();

            this.stepsForTutorial = [
                {
                    element: '#step3',
                    intro: '<div class="tutGif">Θέλετε να σχολιάσετε μία συγκεκριμένη φράση; Πατήστε το μολυβάκι δίπλα της. <img src="'+ this.assetsUrl + "/tutorialAnn.gif" +'" alt="Tutorial" height="300px" width="400px"></div>',
                    position: 'right'
                },
                {
                    element: '#step4',
                    intro: "Θέλετε να σχολιάσετε ένα άρθρο συνολικά; Πατήστε το μολυβάκι δίπλα στον τίτλο του.",
                    position: 'right'
                }
            ];
            if(this.consultationIsActive) {
                this.stepsForTutorial.splice(0, 0,{
                    element: '#step1',
                    intro: "Εδώ εκφράζεστε! Δείτε το κείμενο της διαβούλευσης, τα σχόλια άλλων πολιτών και υποβάλετε τα δικά σας."
                });
                this.stepsForTutorial.splice(1,0,{
                    element: '#step2',
                    intro: "Μάθετε καλύτερα το θέμα πριν εκφραστείτε. Βρείτε εδώ το απαραίτητο σχετικό υλικό π.χ. την αιτιολογική έκθεση του νομοσχεδίου.",
                    position: 'bottom'
                });
            } else {
                this.stepsForTutorial.splice(0, 0,{
                    element: '#step1',
                    intro: "Δείτε το κείμενο της διαβούλευσης και τα σχόλια των πολιτών."
                });
                this.stepsForTutorial.splice(1,0,{
                    element: '#step2',
                    intro: "Βρείτε εδώ το απαραίτητο σχετικό υλικό π.χ. την αιτιολογική έκθεση του νομοσχεδίου.",
                    position: 'bottom'
                });
            }
            if(shouldAddStep5) {
                this.stepsForTutorial.push(
                    {
                        element: '#step5',
                        intro: 'Θέλετε να δείτε τα σχόλια άλλων πολιτών; Δείτε τα εδώ και εκφράστε τη γνώμη σας.',
                        position: 'right'
                    }
                );
            }

            intro.setOptions({
                steps: this.stepsForTutorial,
                exitOnEsc: true,
                keyboardNavigation: true,
                scrollToElement: true
            });
            intro.start();

        };
    return {
        init:init
    }
})();