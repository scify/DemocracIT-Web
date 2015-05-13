
scify.ConsultationIndexPageHandler = function(){};
scify.ConsultationIndexPageHandler.prototype = function(){

    var init = function(){
        $("#consultation-body").annotator()
                               .annotator('setupPlugins');
    };

    return {
        init:init
    }
}();