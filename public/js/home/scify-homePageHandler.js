scify.HomePageHandler = function(searchUrl, lang){
    this.searchUrl = searchUrl;
    this.lang = lang;
}

scify.HomePageHandler.prototype = function(){

    var init = function(){

        $('.carousel').carousel({
            interval: 5000
        });

        React.render(React.createElement(scify.SearchContainer, { url: this.searchUrl, lang:this.lang}),document.getElementById("search-wrapper") );

    }

    return {
        init:init
    }

}();