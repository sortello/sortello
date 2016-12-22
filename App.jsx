import React from "react" // ES6 import
import ApiKey from "./components/ApiKey.jsx"
import ColumnSelection from "./components/ColumnSelection.jsx"
import Choices from "./components/Choices.jsx"
import Results from "./components/Results.jsx"

const App = React.createClass({
  getInitialState: function () {
    return {
      apiKey: false,
      Trello: Trello,
      nodes: Array(),
      rootNode: null
    };
  },
  componentDidMount: function () {
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
  setApiKey: function (apiKey) {
    this.setState({
      apiKey: apiKey
    });
  },
  navigateTo: function navigateTo (divId) {
    if ("card_url_div" == divId) {
      document.getElementById("api_key_div").style.marginTop = -1 * document.getElementById("api_key_div").offsetHeight
    }

    if ("second_div" == divId) {
      document.getElementById("card_url_div").style.marginTop = -1 * document.getElementById("card_url_div").offsetHeight
    }

    if ("last_div" == divId) {
      document.getElementById("card_url_div").style.marginTop = -2 * document.getElementById("card_url_div").offsetHeight
    }
  },
  handleCards: function (listCards) {
    var nodes = [];
    for (var i = 0; i < listCards.length; i++) {
      var node = new TreeNode(listCards[i]);
      nodes.push(node);
    }
    this.setState({
      nodes: nodes,
      rootNode: nodes[0]
    })
    this.navigateTo("second_div");
    this.refs.choices.startChoices();
  },
  getNodes: function () {
    return this.state.nodes
  },
  getRootNode: function () {
    return this.state.rootNode
  },
  setSortedRootNode: function (rootNode) {
    this.setState({
      rootNode: rootNode
    })
  },
  render: function () {
    return (
        <div id="container_div">
          <ApiKey apikey={this.state.apiKey} Trello={this.state.Trello} setApiKey={this.setApiKey}
                  navigateTo={this.navigateTo}/>
          <ColumnSelection apikey={this.state.apiKey} Trello={this.state.Trello} handleCards={this.handleCards}/>
          <Choices ref="choices" setSortedRootNode={this.setSortedRootNode} getNodes={this.getNodes}
                   getRootNode={this.getRootNode} navigateTo={this.navigateTo}/>
          <Results getRootNode={this.getRootNode} Trello={this.state.Trello}/>
        </div>
    )
  },
})

export default App // important