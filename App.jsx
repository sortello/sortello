import React from "react" // ES6 import
import ApiKey from "./components/ApiKey.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import Results from "./components/Results.jsx"

const App = React.createClass({
  getInitialState: function(){
    return {
      apiKey: false,
      Trello: Trello
    };
  },
  setApiKey : function(apiKey){
    this.state.apiKey = apiKey
  },
  navigateTo: function navigateTo(divId) {
    if ("card_url_div" == divId) {
      jQuery('#api_key_div').animate({'margin-top': -1 * jQuery('#api_key_div').outerHeight()});
    }

    if ("second_div" == divId) {
      jQuery('#card_url_div').animate({'margin-top': -1 * jQuery('#card_url_div').outerHeight()});
      jQuery('#card_url').click();
    }

    if ("last_div" == divId) {
      jQuery('#card_url_div').animate({'margin-top': -2 * jQuery('#card_url_div').outerHeight()});
    }
  },
  render: function() {
        return (
            <div id="container_div">
                <ApiKey apikey={this.state.apiKey} Trello={this.state.Trello} setApiKey={this.setApiKey} navigateTo={this.navigateTo}/>
                <ColumnSelection />
                <Choices />
                <Results />
            </div>
        )
    },
})

export default App // important