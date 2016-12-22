import React from "react" // ES6 import
import ApiKey from "./components/ApiKey.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import Results from "./components/Results.jsx"

const App = React.createClass({
  getInitialState: function(){
    return {
      apiKey: false,
      Trello: Trello,
      nodes: Array(),
      rootNode: null
    };
  },
  componentDidMount: function(){
    jQuery(".centered_content").each(function () {
      var content_height = jQuery(this).outerHeight();
      var viewport_height = jQuery(document).innerHeight();
      var padding_top = (viewport_height / 2) - content_height / 2;
      jQuery(this).css('padding-top', padding_top + 'px');
    });

    jQuery('.choice_button .card_link').click(function (e) {
      e.stopPropagation();
    });
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
  handleCards: function (listCards) {
    for (var i = 0; i < listCards.length; i++) {
      var node = new TreeNode(listCards[i]);
      this.state.nodes.push(node);
    }
    this.state.rootNode = this.state.nodes[0];
    this.navigateTo("second_div");
    this.refs.choices.startChoices();
  },
  getNodes: function(){
    return this.state.nodes
  },
  getRootNode: function(){
    return this.state.rootNode
  },
  setSortedRootNode: function(rootNode){
    this.state.rootNode = rootNode
  },
  render: function() {
        return (
            <div id="container_div">
                <ApiKey apikey={this.state.apiKey} Trello={this.state.Trello} setApiKey={this.setApiKey} navigateTo={this.navigateTo}/>
                <ColumnSelection apikey={this.state.apiKey} Trello={this.state.Trello} handleCards={this.handleCards}/>
                <Choices ref="choices" setSortedRootNode={this.setSortedRootNode} getNodes={this.getNodes} getRootNode={this.getRootNode} navigateTo={this.navigateTo}/>
                <Results getRootNode={this.getRootNode} Trello={this.state.Trello}/>
            </div>
        )
    },
})

export default App // important