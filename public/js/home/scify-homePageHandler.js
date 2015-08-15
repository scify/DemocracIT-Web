scify.HomePageHandler = function(searchUrl){
    this.searchUrl = searchUrl;
}

scify.HomePageHandler .prototype = function(){

    var init = function(){

        React.render(React.createElement(scify.SearchContainer, { url: this.searchUrl}),document.getElementById("search-wrapper") );

    }

    return {
        init:init
    }

}();