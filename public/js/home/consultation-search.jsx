scify.SearchContainer = React.createClass({
    getInitialState: function(){
        return { isBusy:false , consultations:[] , searchQuery :""};
    },
    handleReset : function(){
        $("#consultations").stop().fadeIn();
    },
    abortAnyPendingAjaxRequest : function(){
        if (this.searchRequest) //abort any pending requests
            this.searchRequest.abort();
    },
    loadConsultations: function(query, serializedData) {
        var instance = this;
        instance.state.searchQuery = query;
        instance.abortAnyPendingAjaxRequest();

        if (query.length==0)
        {
            instance.handleReset();
            instanse.setState(instance.state);
        }
        else
        {
            instance.searchRequest=  $.ajax({
                method: "GET",
                url: instance.props.url,
                data:  serializedData,
                beforeSend: function(){
                    instance.state.isBusy = true;
                    instance.state.consultations =[];
                    instance.setState(instance.state);
                },
                success: function (results) {
                    instance.state.consultations =results;
                },
                complete : function(){

                    instance.state.isBusy=false;
                    instance.replaceState(instance.state);
                    $("#consultations").stop().hide();
                }
            });
        }

    },
    render : function(){
        return (
            <div>
                <SearchBox onChange={this.loadConsultations} />
                <scify.ReactLoader  display={this.state.isBusy} />
                <SearchResultsList isSearching={this.state.isBusy}
                                   searchQuery={this.state.searchQuery}
                                   handeReset={this.handleReset}
                                   data={this.state.consultations} />
            </div>
        )
    }
});
var SearchBox = React.createClass({
    handleKeyUp: function(){
        var query = this.refs.searchInput.getDOMNode().value;
        this.props.onChange(query, $(this.refs.form.getDOMNode()).serialize());
    },
    render : function(){
        return (
            <div id="search-box">
                <div className="wrapper">
                    <form ref="form" className="form-inline" >
                        <div className="form-group">
                            <div className="box">
                                <span className="icon"><i className="fa fa-search"></i></span>
                                <input ref="searchInput" type="search" id="search" name="query" placeholder="Αναζήτηση..." onKeyUp={this.handleKeyUp} />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        )
    }
});
var SearchResultsList = React.createClass({
    render: function(){
        var resultNodes = this.props.data.map(function (result) {
            return (
                <ConsultationResult key={result.id}  data={result} />
            );
        });

        if (this.props.isSearching) {
            return (
                <div></div>
            );
        }
        else if ( this.props.data.length>0) {
            return (
                <div className="consultation-list container">
                    <h2>Βρέθηκαν {this.props.data.length} διαβουλεύσεις</h2>
                    <div className="results">
                        {resultNodes}
                    </div>
                </div>
            );
        }
        else if (this.props.data.length == 0 && this.props.searchQuery.length>0 ) {
            return (
                <div className="consultation-list container">
                    <h2>Δε βρέθηκαν αποτελέσματα για '<span dangerouslySetInnerHTML={{__html:this.props.searchQuery}} ></span>' </h2>
                </div>
            );
        }
        else {
            return (<div></div>);
        }

    }
});
var ConsultationResult= React.createClass({
    render: function(){
        var cons = this.props.data;
        var expiredLabel = this.props.data.isActive ? "λήξη:" : "έληξε:";
        var href = "/consultation/" + cons.id;
        return (
            <div className="consultation">
                <a href={href} dangerouslySetInnerHTML={{__html: cons.title}}></a><br/>
                <span className="duration">{expiredLabel} {cons.endDateFormatted} | διάρκεια {cons.totalDurationFormatted}</span>
            </div>
        );
    }
 });