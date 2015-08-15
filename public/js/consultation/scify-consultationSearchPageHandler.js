scify.ConsultationSearchPageHandler = function(consultations ){
    this.consultations = consulations;
}

scify.ConsultationSearchPageHandler.prototype = function(){

    var init = function(){

        React.render(React.createElement(scify.SearchContainer, { url: this.searchUrl}),document.getElementById("search-wrapper") );
    }

    return {
        init:init
    }

}();